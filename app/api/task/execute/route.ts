import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser } from '@/lib/auth';
import { getAgentById, isAgentValid, createTask, updateTask, logAudit } from '@/lib/db';
import { executeTask, TaskStep, DelegationCheck } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { agentId, description } = body;

    if (!agentId || !description) {
      return new Response(
        JSON.stringify({ error: 'Agent ID and task description are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify agent
    const agent = getAgentById(agentId);
    if (!agent) {
      return new Response(
        JSON.stringify({ error: 'Agent not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify ownership
    if (agent.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if agent is valid
    if (!isAgentValid(agentId)) {
      return new Response(
        JSON.stringify({ error: 'Agent is not active or has expired' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create task record
    const taskId = uuidv4();
    createTask({
      id: taskId,
      agent_id: agentId,
      description,
    });

    logAudit(agentId, user.id, 'task_started', `Task: ${description.slice(0, 100)}`);

    // Stream response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (data: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        try {
          // Execute task with streaming updates
          const result = await executeTask(description, {
            agentName: agent.name,
            agentId: agentId,
            permissions: agent.permissions,
            constraints: agent.constraints,
            onStepUpdate: async (steps: TaskStep[]) => {
              sendEvent({ type: 'steps', steps });
              updateTask(taskId, { steps });
            },
            onDelegationCheck: async (check: DelegationCheck) => {
              sendEvent({ type: 'delegation_check', check });
              logAudit(agentId, user.id, 'delegation_verified', `Status: ${check.status}`);
            },
            checkValid: () => isAgentValid(agentId),
          });

          // Update task as completed
          updateTask(taskId, {
            status: 'completed',
            steps: result.steps,
            result: result.finalResult,
          });

          logAudit(agentId, user.id, 'task_completed', `Task completed successfully`);

          // Send final result
          sendEvent({ type: 'result', result: result.finalResult });
          sendEvent({ type: 'done' });
        } catch (error: any) {
          const errorMessage = error.message || 'Task execution failed';

          // Update task as failed
          updateTask(taskId, {
            status: 'failed',
            result: errorMessage,
          });

          if (errorMessage.includes('AGENT_REVOKED')) {
            logAudit(agentId, user.id, 'task_aborted', 'Task aborted due to agent revocation');
          } else {
            logAudit(agentId, user.id, 'task_failed', errorMessage);
          }

          sendEvent({ type: 'error', error: errorMessage });
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error executing task:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
