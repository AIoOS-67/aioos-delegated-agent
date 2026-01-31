import { GoogleGenerativeAI, FunctionDeclarationSchemaType } from '@google/generative-ai';
import { AVAILABLE_TOOLS, executeToolCall, getToolsForPermissions, isToolCallAllowed, ToolCall } from './tools';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface TaskStep {
  step: number;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
  toolCalls?: ToolCall[];
  delegationCheck?: DelegationCheck;
}

export interface DelegationCheck {
  status: 'checking' | 'valid' | 'invalid';
  checks: {
    name: string;
    status: 'pass' | 'fail';
    detail: string;
  }[];
  timestamp: string;
}

export interface ExecutionContext {
  agentName: string;
  agentId: string;
  permissions: string[];
  constraints?: string;
  onStepUpdate: (steps: TaskStep[]) => Promise<void>;
  onDelegationCheck: (check: DelegationCheck) => Promise<void>;
  checkValid: () => boolean;
}

// Generate a delegation check result
export function generateDelegationCheck(
  agentId: string,
  permissions: string[],
  constraints?: string,
  tokensUsed: number = 0
): DelegationCheck {
  const checks = [
    {
      name: 'Delegation Status',
      status: 'pass' as const,
      detail: 'Agent delegation is active'
    },
    {
      name: 'Permissions',
      status: 'pass' as const,
      detail: `Granted: [${permissions.join(', ')}]`
    },
    {
      name: 'Constraints',
      status: 'pass' as const,
      detail: constraints || 'No constraints'
    },
    {
      name: 'Token Usage',
      status: 'pass' as const,
      detail: `${tokensUsed} tokens used this session`
    }
  ];

  return {
    status: 'valid',
    checks,
    timestamp: new Date().toISOString()
  };
}

// Convert our tools to Gemini function declarations
function getGeminiFunctionDeclarations(permissions: string[]) {
  const allowedTools = getToolsForPermissions(permissions);

  return allowedTools.map(tool => ({
    name: tool.name,
    description: tool.description,
    parameters: {
      type: FunctionDeclarationSchemaType.OBJECT,
      properties: Object.fromEntries(
        Object.entries(tool.parameters.properties).map(([key, value]: [string, any]) => [
          key,
          { type: FunctionDeclarationSchemaType.STRING, description: value.description }
        ])
      ),
      required: tool.parameters.required
    }
  }));
}

// Plan task into steps using Gemini
export async function planTask(taskDescription: string, permissions: string[]): Promise<TaskStep[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const availableTools = getToolsForPermissions(permissions);
  const toolNames = availableTools.map(t => t.name).join(', ');

  const prompt = `You are a task planning assistant. Break down the following task into 3-5 clear, actionable steps.

Task: ${taskDescription}

Available permissions: ${permissions.join(', ')}
Available tools: ${toolNames}

For each step, consider if a tool should be used. Respond with a JSON array of steps:
[
  {"step": 1, "description": "Brief description", "useTool": "tool_name or null"},
  ...
]

IMPORTANT: Respond ONLY with the JSON array, no other text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse task steps');
    }

    const steps = JSON.parse(jsonMatch[0]);
    return steps.map((s: any) => ({
      step: s.step,
      description: s.description,
      status: 'pending' as const,
      toolCalls: s.useTool ? [] : undefined
    }));
  } catch (error) {
    console.error('Error planning task:', error);
    return [
      { step: 1, description: 'Analyze the task requirements', status: 'pending' },
      { step: 2, description: 'Execute the main operation', status: 'pending' },
      { step: 3, description: 'Validate and return results', status: 'pending' },
    ];
  }
}

// Execute a single step with potential tool calls
export async function executeStep(
  step: TaskStep,
  taskDescription: string,
  previousResults: string[],
  context: ExecutionContext,
  tokensUsed: number
): Promise<{ output: string; toolCalls: ToolCall[]; tokensUsed: number }> {
  // Check if agent is still valid
  if (!context.checkValid()) {
    throw new Error('AGENT_REVOKED: Agent has been revoked or expired');
  }

  // Perform delegation check
  const delegationCheck = generateDelegationCheck(
    context.agentId,
    context.permissions,
    context.constraints,
    tokensUsed
  );
  await context.onDelegationCheck(delegationCheck);

  const allowedTools = getToolsForPermissions(context.permissions);
  const toolCalls: ToolCall[] = [];

  // Build the model with function calling if tools are available
  const modelConfig: any = { model: 'gemini-2.0-flash' };

  if (allowedTools.length > 0) {
    modelConfig.tools = [{
      functionDeclarations: getGeminiFunctionDeclarations(context.permissions)
    }];
  }

  const model = genAI.getGenerativeModel(modelConfig);

  const constraintsText = context.constraints
    ? `\nConstraints you must follow: ${context.constraints}`
    : '';

  const previousResultsText = previousResults.length > 0
    ? `\nResults from previous steps:\n${previousResults.map((r, i) => `Step ${i + 1}: ${r}`).join('\n')}`
    : '';

  const toolsText = allowedTools.length > 0
    ? `\nYou have access to these tools: ${allowedTools.map(t => `${t.name} (${t.description})`).join(', ')}`
    : '';

  const prompt = `You are an AI agent named "${context.agentName}" (ID: ${context.agentId}) executing a delegated task.

Overall Task: ${taskDescription}
Current Step: Step ${step.step} - ${step.description}
Your Permissions: ${context.permissions.join(', ')}${constraintsText}${toolsText}${previousResultsText}

Execute this step. If appropriate, use a tool to complete the action. Provide a clear, concise result.
Keep your response focused and under 300 words.`;

  try {
    const chat = model.startChat();
    let result = await chat.sendMessage(prompt);
    let response = result.response;
    let newTokens = response.usageMetadata?.totalTokenCount || 100;

    // Handle function calls
    while (response.candidates?.[0]?.content?.parts) {
      const parts = response.candidates[0].content.parts;
      const functionCallPart = parts.find((p: any) => p.functionCall);

      if (!functionCallPart?.functionCall) {
        break;
      }

      const functionCall = functionCallPart.functionCall;
      const toolName = functionCall.name;
      const toolArgs = functionCall.args || {};

      // Verify permission for this tool
      if (!isToolCallAllowed(toolName, context.permissions)) {
        throw new Error(`PERMISSION_DENIED: Agent not authorized to use tool: ${toolName}`);
      }

      // Check agent validity before tool execution
      if (!context.checkValid()) {
        throw new Error('AGENT_REVOKED: Agent has been revoked or expired');
      }

      // Execute the tool
      const toolResult = executeToolCall(toolName, toolArgs);

      toolCalls.push({
        name: toolName,
        args: toolArgs,
        result: toolResult,
        timestamp: new Date().toISOString()
      });

      // Send result back to model
      result = await chat.sendMessage([{
        functionResponse: {
          name: toolName,
          response: toolResult
        }
      }]);

      response = result.response;
      newTokens += response.usageMetadata?.totalTokenCount || 50;
    }

    const textContent = response.candidates?.[0]?.content?.parts
      ?.filter((p: any) => p.text)
      ?.map((p: any) => p.text)
      ?.join('\n') || 'Step completed';

    return {
      output: textContent,
      toolCalls,
      tokensUsed: tokensUsed + newTokens
    };
  } catch (error: any) {
    console.error('Error executing step:', error);
    throw new Error(`Step execution failed: ${error.message}`);
  }
}

// Execute the full task
export async function executeTask(
  taskDescription: string,
  context: ExecutionContext
): Promise<{ steps: TaskStep[]; finalResult: string }> {
  // Check validity before starting
  if (!context.checkValid()) {
    throw new Error('AGENT_REVOKED: Agent has been revoked or expired');
  }

  // Plan the task
  const steps = await planTask(taskDescription, context.permissions);
  await context.onStepUpdate(steps);

  const results: string[] = [];
  let totalTokensUsed = 0;

  // Execute each step
  for (let i = 0; i < steps.length; i++) {
    // Check validity before each step
    if (!context.checkValid()) {
      steps[i].status = 'failed';
      steps[i].output = 'Agent was revoked';
      steps[i].delegationCheck = {
        status: 'invalid',
        checks: [{ name: 'Delegation Status', status: 'fail', detail: 'Agent revoked' }],
        timestamp: new Date().toISOString()
      };

      for (let j = i + 1; j < steps.length; j++) {
        steps[j].status = 'failed';
        steps[j].output = 'Skipped - Agent was revoked';
      }
      await context.onStepUpdate(steps);
      throw new Error('AGENT_REVOKED: Agent has been revoked or expired');
    }

    // Mark step as running
    steps[i].status = 'running';
    await context.onStepUpdate(steps);

    try {
      // Add processing delay for visual effect
      await new Promise(resolve => setTimeout(resolve, 800));

      const { output, toolCalls, tokensUsed } = await executeStep(
        steps[i],
        taskDescription,
        results,
        context,
        totalTokensUsed
      );

      totalTokensUsed = tokensUsed;
      steps[i].status = 'completed';
      steps[i].output = output;
      steps[i].toolCalls = toolCalls.length > 0 ? toolCalls : undefined;
      steps[i].delegationCheck = generateDelegationCheck(
        context.agentId,
        context.permissions,
        context.constraints,
        totalTokensUsed
      );
      results.push(output);
    } catch (error: any) {
      steps[i].status = 'failed';
      steps[i].output = error.message;
      steps[i].delegationCheck = {
        status: 'invalid',
        checks: [{ name: 'Execution', status: 'fail', detail: error.message }],
        timestamp: new Date().toISOString()
      };

      if (error.message.includes('AGENT_REVOKED')) {
        for (let j = i + 1; j < steps.length; j++) {
          steps[j].status = 'failed';
          steps[j].output = 'Skipped - Agent was revoked';
        }
        await context.onStepUpdate(steps);
        throw error;
      }
    }

    await context.onStepUpdate(steps);
  }

  // Generate final summary
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const summaryPrompt = `Summarize the results of this completed task in 2-3 sentences:

Task: ${taskDescription}
Results:
${results.map((r, i) => `Step ${i + 1}: ${r}`).join('\n')}

Provide a brief, clear summary.`;

  let finalResult: string;
  try {
    const summaryResponse = await model.generateContent(summaryPrompt);
    finalResult = summaryResponse.response.text();
  } catch {
    finalResult = results[results.length - 1] || 'Task completed';
  }

  return { steps, finalResult };
}
