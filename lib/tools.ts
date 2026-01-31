// Simulated tools that the Agent can call via Gemini Function Calling

export interface ToolCall {
  name: string;
  args: Record<string, any>;
  result: any;
  timestamp: string;
}

export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
  requiredPermission: string;
}

// Available tools for Agents
export const AVAILABLE_TOOLS: Tool[] = [
  {
    name: 'check_calendar',
    description: 'Check calendar events for a specific date or date range',
    parameters: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
        include_details: { type: 'boolean', description: 'Include event details' }
      },
      required: ['date']
    },
    requiredPermission: 'data_analysis'
  },
  {
    name: 'send_email',
    description: 'Send an email to a recipient',
    parameters: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Recipient email address' },
        subject: { type: 'string', description: 'Email subject' },
        body: { type: 'string', description: 'Email body content' }
      },
      required: ['to', 'subject', 'body']
    },
    requiredPermission: 'text_generation'
  },
  {
    name: 'search_documents',
    description: 'Search through documents for specific information',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        max_results: { type: 'number', description: 'Maximum number of results' }
      },
      required: ['query']
    },
    requiredPermission: 'data_analysis'
  },
  {
    name: 'analyze_data',
    description: 'Analyze data and generate insights',
    parameters: {
      type: 'object',
      properties: {
        data_type: { type: 'string', description: 'Type of data to analyze' },
        metrics: { type: 'array', description: 'Metrics to calculate' }
      },
      required: ['data_type']
    },
    requiredPermission: 'data_analysis'
  },
  {
    name: 'generate_code',
    description: 'Generate code based on requirements',
    parameters: {
      type: 'object',
      properties: {
        language: { type: 'string', description: 'Programming language' },
        requirements: { type: 'string', description: 'Code requirements' }
      },
      required: ['language', 'requirements']
    },
    requiredPermission: 'code_generation'
  },
  {
    name: 'translate_text',
    description: 'Translate text to another language',
    parameters: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'Text to translate' },
        target_language: { type: 'string', description: 'Target language' }
      },
      required: ['text', 'target_language']
    },
    requiredPermission: 'translation'
  }
];

// Simulated tool execution results
export function executeToolCall(toolName: string, args: Record<string, any>): any {
  const now = new Date().toISOString();

  switch (toolName) {
    case 'check_calendar':
      return {
        success: true,
        events: [
          { time: '09:00', title: 'Team Standup', duration: '30min' },
          { time: '14:00', title: 'Project Review', duration: '1hr' },
          { time: '16:30', title: 'Client Call', duration: '45min' }
        ],
        date: args.date
      };

    case 'send_email':
      return {
        success: true,
        message_id: `msg_${Date.now()}`,
        sent_at: now,
        recipient: args.to,
        status: 'delivered'
      };

    case 'search_documents':
      return {
        success: true,
        results: [
          { title: 'Q4 Report.pdf', relevance: 0.95, snippet: 'Revenue increased by 23%...' },
          { title: 'Strategy Doc.docx', relevance: 0.87, snippet: 'Key initiatives for next quarter...' },
          { title: 'Meeting Notes.txt', relevance: 0.72, snippet: 'Action items discussed...' }
        ],
        total_found: 3,
        query: args.query
      };

    case 'analyze_data':
      return {
        success: true,
        insights: [
          'Data shows 15% improvement over last period',
          'Peak activity occurs between 2-4 PM',
          'Recommended action: increase resource allocation'
        ],
        confidence: 0.89,
        data_type: args.data_type
      };

    case 'generate_code':
      return {
        success: true,
        code: `// Generated ${args.language} code\nfunction example() {\n  // Implementation based on requirements\n  return "Hello, World!";\n}`,
        language: args.language,
        lines: 5
      };

    case 'translate_text':
      return {
        success: true,
        original: args.text,
        translated: `[Translated to ${args.target_language}]: ${args.text}`,
        target_language: args.target_language
      };

    default:
      return { success: false, error: 'Unknown tool' };
  }
}

// Get tools available for given permissions
export function getToolsForPermissions(permissions: string[]): Tool[] {
  return AVAILABLE_TOOLS.filter(tool =>
    permissions.includes(tool.requiredPermission)
  );
}

// Check if a tool call is allowed
export function isToolCallAllowed(toolName: string, permissions: string[]): boolean {
  const tool = AVAILABLE_TOOLS.find(t => t.name === toolName);
  if (!tool) return false;
  return permissions.includes(tool.requiredPermission);
}
