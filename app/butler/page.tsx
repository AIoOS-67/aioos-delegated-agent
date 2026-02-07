'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Agent Pool with lifecycle states
interface AgentInPool {
  id: string;
  name: string;
  type: string;
  vertical: string;
  jurisdiction: string[];
  state: 'DORMANT' | 'ACTIVATING' | 'ACTIVE' | 'EXECUTING' | 'HIBERNATING';
  trust_tier: string;
  permission_level: string;
  utilization: number;
}

const initialAgentPool: AgentInPool[] = [
  { id: 'agent-re-042', name: 'Real Estate Pro', type: 'RealEstate', vertical: 'Real Estate', jurisdiction: ['NYC', 'NY_State'], state: 'DORMANT', trust_tier: 'Verified', permission_level: 'execute_with_human', utilization: 0 },
  { id: 'agent-legal-156', name: 'Contract Analyzer', type: 'LegalAnalysis', vertical: 'Legal', jurisdiction: ['NY_Bar', 'Contract_Law'], state: 'DORMANT', trust_tier: 'Verified', permission_level: 'advisory_only', utilization: 0 },
  { id: 'agent-fin-089', name: 'Financial Advisor', type: 'Financial', vertical: 'Financial', jurisdiction: ['SEC', 'FINRA'], state: 'DORMANT', trust_tier: 'Premium', permission_level: 'advisory_only', utilization: 0 },
  { id: 'agent-tech-201', name: 'Code Assistant', type: 'Technical', vertical: 'Technical', jurisdiction: ['Global'], state: 'ACTIVE', trust_tier: 'Elite', permission_level: 'execute_with_human', utilization: 45 },
  { id: 'agent-health-077', name: 'Health Advisor', type: 'Healthcare', vertical: 'Healthcare', jurisdiction: ['HIPAA'], state: 'HIBERNATING', trust_tier: 'Basic', permission_level: 'advisory_only', utilization: 0 },
];

interface Message {
  id: string;
  role: 'user' | 'butler' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    type?: 'discovery' | 'license_check' | 'activation' | 'execution' | 'result' | 'escalation' | 'dispatch' | 'revoke' | 'audit';
    agentId?: string;
    agentName?: string;
    details?: any;
  };
}

interface DiscoveryResult {
  agent: AgentInPool;
  fitness_score: number;
  match_reasons: string[];
}

interface DispatchInfo {
  agent: AgentInPool;
  taskDescription: string;
  estimatedTokens: number;
  intent: { vertical: string; keywords: string[] };
}

interface ExecutionStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
}

interface AuditRecord {
  timestamp: Date;
  action: string;
  agentId: string;
  agentName: string;
  status: 'success' | 'failed' | 'revoked';
  tokensUsed: number;
  duration: number;
}

const stateColors: Record<string, { bg: string; text: string; icon: string }> = {
  DORMANT: { bg: 'bg-gray-600', text: 'text-gray-300', icon: '💤' },
  ACTIVATING: { bg: 'bg-yellow-500', text: 'text-yellow-100', icon: '⚡' },
  ACTIVE: { bg: 'bg-green-500', text: 'text-green-100', icon: '🟢' },
  EXECUTING: { bg: 'bg-blue-500', text: 'text-blue-100', icon: '🔄' },
  HIBERNATING: { bg: 'bg-purple-500', text: 'text-purple-100', icon: '🧊' },
};

const examplePrompts = [
  { text: "Review this lease for my Brooklyn apartment", category: "Real Estate", icon: "🏠" },
  { text: "Analyze the risks in this NDA contract", category: "Legal", icon: "⚖️" },
  { text: "Should I rebalance my retirement portfolio?", category: "Financial", icon: "💰" },
  { text: "Write a Python function to sort a list", category: "Technical", icon: "💻" },
];

export default function ButlerPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'butler',
      content: "Hello! I'm your Butler Agent - your single entry point to the AIoOS ecosystem. I can interpret your requests, discover the right specialized agents, and orchestrate complex tasks. What can I help you with today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentPool, setAgentPool] = useState<AgentInPool[]>(initialAgentPool);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [discoveryResults, setDiscoveryResults] = useState<DiscoveryResult[] | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentInPool | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dispatch-related state
  const [showDispatchConfirm, setShowDispatchConfirm] = useState(false);
  const [dispatchInfo, setDispatchInfo] = useState<DispatchInfo | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [currentExecutionStep, setCurrentExecutionStep] = useState<number>(-1);
  const [auditLog, setAuditLog] = useState<AuditRecord[]>([]);
  const [canRevoke, setCanRevoke] = useState(false);
  const [isRevoked, setIsRevoked] = useState(false);
  const revokeRef = useRef(false);
  const [userMessage, setUserMessage] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (msg: Omit<Message, 'id' | 'timestamp'>) => {
    const newMsg: Message = {
      ...msg,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMsg]);
    return newMsg;
  };

  const updateAgentState = (agentId: string, newState: AgentInPool['state'], utilization?: number) => {
    setAgentPool(prev => prev.map(agent =>
      agent.id === agentId
        ? { ...agent, state: newState, utilization: utilization ?? agent.utilization }
        : agent
    ));
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const detectIntent = (text: string): { vertical: string; keywords: string[] } => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('lease') || lowerText.includes('apartment') || lowerText.includes('rent') || lowerText.includes('property')) {
      return { vertical: 'Real Estate', keywords: ['lease', 'apartment', 'rental', 'property'] };
    }
    if (lowerText.includes('contract') || lowerText.includes('nda') || lowerText.includes('legal') || lowerText.includes('agreement')) {
      return { vertical: 'Legal', keywords: ['contract', 'NDA', 'legal', 'agreement'] };
    }
    if (lowerText.includes('portfolio') || lowerText.includes('invest') || lowerText.includes('401k') || lowerText.includes('stock') || lowerText.includes('financial')) {
      return { vertical: 'Financial', keywords: ['portfolio', 'investment', 'retirement', 'stocks'] };
    }
    if (lowerText.includes('code') || lowerText.includes('python') || lowerText.includes('function') || lowerText.includes('program') || lowerText.includes('debug')) {
      return { vertical: 'Technical', keywords: ['code', 'programming', 'function', 'software'] };
    }
    if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('symptom')) {
      return { vertical: 'Healthcare', keywords: ['health', 'medical', 'symptoms'] };
    }

    return { vertical: 'General', keywords: [] };
  };

  // Estimate token usage based on task complexity
  const estimateTokens = (vertical: string): number => {
    const baseTokens: Record<string, number> = {
      'Real Estate': 2500,
      'Legal': 3200,
      'Financial': 2800,
      'Technical': 1800,
      'Healthcare': 2200,
      'General': 1500,
    };
    return baseTokens[vertical] || 1500;
  };

  // Handle initial submit - stops at license check
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMsg = input.trim();
    setInput('');
    setIsProcessing(true);
    setDiscoveryResults(null);
    setSelectedAgent(null);
    setShowDispatchConfirm(false);
    setDispatchInfo(null);
    setIsRevoked(false);
    revokeRef.current = false;
    setUserMessage(userMsg);

    // Add user message
    addMessage({ role: 'user', content: userMsg });

    await sleep(500);

    // Step 1: Intent Interpretation
    setCurrentStep('intent');
    const intent = detectIntent(userMsg);
    addMessage({
      role: 'system',
      content: `🎯 **Intent Analysis**\nDetected vertical: **${intent.vertical}**\nKeywords: ${intent.keywords.join(', ')}`,
      metadata: { type: 'discovery' }
    });

    await sleep(1000);

    // Step 2: Agent Discovery
    setCurrentStep('discovery');
    addMessage({
      role: 'system',
      content: `🔍 **Agent Discovery Engine**\nSearching for qualified agents in **${intent.vertical}** vertical...`,
      metadata: { type: 'discovery' }
    });

    await sleep(1200);

    // Find matching agents
    const matchingAgents = agentPool.filter(a => a.vertical === intent.vertical);
    const results: DiscoveryResult[] = matchingAgents.map(agent => ({
      agent,
      fitness_score: 85 + Math.floor(Math.random() * 15),
      match_reasons: [
        `Vertical match: ${agent.vertical}`,
        `Jurisdiction: ${agent.jurisdiction.join(', ')}`,
        `Trust tier: ${agent.trust_tier}`,
      ]
    })).sort((a, b) => b.fitness_score - a.fitness_score);

    setDiscoveryResults(results);

    if (results.length === 0) {
      addMessage({
        role: 'butler',
        content: `I couldn't find a specialized agent for ${intent.vertical}. Let me handle this with general capabilities.`,
      });
      setIsProcessing(false);
      setCurrentStep(null);
      return;
    }

    const bestMatch = results[0];
    setSelectedAgent(bestMatch.agent);

    addMessage({
      role: 'system',
      content: `✅ **Agent Matched**\n**${bestMatch.agent.name}** (${bestMatch.agent.id})\nFitness Score: **${bestMatch.fitness_score}%**\nJurisdiction: ${bestMatch.agent.jurisdiction.join(', ')}`,
      metadata: { type: 'discovery', agentId: bestMatch.agent.id, agentName: bestMatch.agent.name }
    });

    await sleep(1000);

    // Step 3: License Verification
    setCurrentStep('license');
    addMessage({
      role: 'system',
      content: `📜 **License Verification**\nChecking license for ${bestMatch.agent.name}...`,
      metadata: { type: 'license_check', agentId: bestMatch.agent.id }
    });

    await sleep(800);

    addMessage({
      role: 'system',
      content: `✓ License Type: **${bestMatch.agent.type}**\n✓ Trust Tier: **${bestMatch.agent.trust_tier}**\n✓ Permission Level: **${bestMatch.agent.permission_level}**\n✓ Insurance: Active\n✓ Jurisdiction: Valid`,
      metadata: { type: 'license_check', agentId: bestMatch.agent.id }
    });

    await sleep(500);

    // Step 4: Show Dispatch Button (NEW - Stop here and wait for user to dispatch)
    setCurrentStep('dispatch_ready');
    setDispatchInfo({
      agent: bestMatch.agent,
      taskDescription: userMsg,
      estimatedTokens: estimateTokens(intent.vertical),
      intent,
    });
    setShowDispatchConfirm(true);
    setIsProcessing(false);

    addMessage({
      role: 'system',
      content: `✅ **License Check Passed**\n\nAgent **${bestMatch.agent.name}** is ready to be dispatched.\nClick the green **Dispatch Agent** button to proceed.`,
      metadata: { type: 'dispatch', agentId: bestMatch.agent.id }
    });
  };

  // Handle Dispatch Confirmation
  const handleDispatchConfirm = async () => {
    if (!dispatchInfo || !selectedAgent) return;

    const startTime = Date.now();
    setShowDispatchConfirm(false);
    setIsProcessing(true);
    setIsExecuting(true);
    setCanRevoke(true);
    revokeRef.current = false;

    const { agent, intent } = dispatchInfo;

    addMessage({
      role: 'system',
      content: `🚀 **Dispatch Confirmed**\nInitiating task execution with **${agent.name}**...`,
      metadata: { type: 'dispatch', agentId: agent.id }
    });

    await sleep(500);

    // Step 4: Agent Activation (PTAS lifecycle)
    setCurrentStep('activation');
    const wasState = agent.state;

    if (wasState === 'DORMANT' || wasState === 'HIBERNATING') {
      addMessage({
        role: 'system',
        content: `⚡ **Agent Activation (PTAS)**\n${agent.name}: **${wasState}** → **ACTIVATING**`,
        metadata: { type: 'activation', agentId: agent.id }
      });

      updateAgentState(agent.id, 'ACTIVATING');
      await sleep(600);

      if (revokeRef.current) {
        await handleRevoked(agent, startTime);
        return;
      }

      addMessage({
        role: 'system',
        content: `🟢 ${agent.name}: **ACTIVATING** → **ACTIVE** (180ms)`,
        metadata: { type: 'activation', agentId: agent.id }
      });

      updateAgentState(agent.id, 'ACTIVE', 50);
    }

    await sleep(500);

    if (revokeRef.current) {
      await handleRevoked(agent, startTime);
      return;
    }

    // Step 5: Multi-step Task Execution
    setCurrentStep('execution');
    updateAgentState(agent.id, 'EXECUTING', 70);

    // Define execution steps based on vertical
    const steps = getExecutionSteps(intent.vertical);
    setExecutionSteps(steps);

    addMessage({
      role: 'system',
      content: `🔄 **Executing Task**\n${agent.name}: **ACTIVE** → **EXECUTING**\n\n**Task Pipeline** (${steps.length} steps):`,
      metadata: { type: 'execution', agentId: agent.id }
    });

    // Execute each step with progress
    for (let i = 0; i < steps.length; i++) {
      if (revokeRef.current) {
        await handleRevoked(agent, startTime);
        return;
      }

      setCurrentExecutionStep(i);
      setExecutionSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'running' } : s
      ));

      const utilization = 70 + Math.floor((i / steps.length) * 25);
      updateAgentState(agent.id, 'EXECUTING', utilization);

      addMessage({
        role: 'system',
        content: `▶️ **Step ${i + 1}/${steps.length}**: ${steps[i].name}\n   Status: Running...`,
        metadata: { type: 'execution', agentId: agent.id }
      });

      await sleep(800 + Math.random() * 400);

      if (revokeRef.current) {
        await handleRevoked(agent, startTime);
        return;
      }

      const stepOutput = generateStepOutput(steps[i].name, intent.vertical);
      setExecutionSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'completed', output: stepOutput } : s
      ));

      addMessage({
        role: 'system',
        content: `✅ **Step ${i + 1}**: Completed\n   Output: ${stepOutput}`,
        metadata: { type: 'execution', agentId: agent.id }
      });
    }

    setCanRevoke(false);

    // Step 6: Check if human approval needed
    if (agent.permission_level === 'execute_with_human') {
      setCurrentStep('escalation');
      addMessage({
        role: 'system',
        content: `⚠️ **Human Approval Required**\nPermission level: **execute_with_human**\nThis result requires human professional review before final delivery.`,
        metadata: { type: 'escalation', agentId: agent.id }
      });
      await sleep(1000);
    }

    // Step 7: Return result
    setCurrentStep('result');
    updateAgentState(agent.id, 'EXECUTING', 100);

    // Generate contextual response based on vertical
    const response = generateResponse(intent.vertical, agent);

    addMessage({
      role: 'butler',
      content: response,
      metadata: { type: 'result', agentId: agent.id, agentName: agent.name }
    });

    // Return agent to DORMANT
    await sleep(500);
    updateAgentState(agent.id, 'ACTIVE', 30);
    await sleep(1000);
    updateAgentState(agent.id, 'DORMANT', 0);

    addMessage({
      role: 'system',
      content: `💤 ${agent.name}: **ACTIVE** → **DORMANT**\nAgent returned to low-power state.`,
      metadata: { type: 'activation', agentId: agent.id }
    });

    // Add audit record
    const endTime = Date.now();
    const newAuditRecord: AuditRecord = {
      timestamp: new Date(),
      action: `Task: ${userMessage}`,
      agentId: agent.id,
      agentName: agent.name,
      status: 'success',
      tokensUsed: dispatchInfo.estimatedTokens + Math.floor(Math.random() * 200),
      duration: endTime - startTime,
    };
    setAuditLog(prev => [newAuditRecord, ...prev]);

    addMessage({
      role: 'system',
      content: `📋 **Audit Record**\n✓ Agent: ${agent.name} (${agent.id})\n✓ Status: SUCCESS\n✓ Duration: ${((endTime - startTime) / 1000).toFixed(2)}s\n✓ Tokens Used: ${newAuditRecord.tokensUsed}\n✓ Timestamp: ${newAuditRecord.timestamp.toISOString()}`,
      metadata: { type: 'audit', agentId: agent.id }
    });

    setIsProcessing(false);
    setIsExecuting(false);
    setCurrentStep(null);
    setExecutionSteps([]);
    setCurrentExecutionStep(-1);
  };

  // Handle Revoke
  const handleRevoke = () => {
    revokeRef.current = true;
    setIsRevoked(true);
  };

  const handleRevoked = async (agent: AgentInPool, startTime: number) => {
    setCanRevoke(false);

    addMessage({
      role: 'system',
      content: `🛑 **TASK REVOKED**\nAgent **${agent.name}** execution has been interrupted.\nAll pending operations cancelled.`,
      metadata: { type: 'revoke', agentId: agent.id }
    });

    // Return agent to DORMANT immediately
    updateAgentState(agent.id, 'DORMANT', 0);

    // Add audit record for revoked task
    const endTime = Date.now();
    const newAuditRecord: AuditRecord = {
      timestamp: new Date(),
      action: `Task: ${userMessage} (REVOKED)`,
      agentId: agent.id,
      agentName: agent.name,
      status: 'revoked',
      tokensUsed: Math.floor(dispatchInfo?.estimatedTokens || 0 * 0.3), // Partial usage
      duration: endTime - startTime,
    };
    setAuditLog(prev => [newAuditRecord, ...prev]);

    addMessage({
      role: 'system',
      content: `📋 **Audit Record**\n⚠️ Agent: ${agent.name} (${agent.id})\n⚠️ Status: REVOKED\n⚠️ Duration: ${((endTime - startTime) / 1000).toFixed(2)}s\n⚠️ Tokens Used: ${newAuditRecord.tokensUsed} (partial)\n⚠️ Timestamp: ${newAuditRecord.timestamp.toISOString()}`,
      metadata: { type: 'audit', agentId: agent.id }
    });

    setIsProcessing(false);
    setIsExecuting(false);
    setCurrentStep(null);
    setShowDispatchConfirm(false);
    setDispatchInfo(null);
    setExecutionSteps([]);
    setCurrentExecutionStep(-1);
  };

  // Handle Cancel Dispatch
  const handleDispatchCancel = () => {
    setShowDispatchConfirm(false);
    setDispatchInfo(null);
    setCurrentStep(null);

    addMessage({
      role: 'system',
      content: `❌ **Dispatch Cancelled**\nTask execution was cancelled by user.`,
      metadata: { type: 'dispatch' }
    });
  };

  // Get execution steps based on vertical
  const getExecutionSteps = (vertical: string): ExecutionStep[] => {
    const stepSets: Record<string, string[]> = {
      'Real Estate': [
        'Parsing document structure',
        'Extracting key terms and clauses',
        'Analyzing compliance with NY Housing Law',
        'Identifying risk factors',
        'Generating recommendations'
      ],
      'Legal': [
        'Document classification',
        'Clause extraction and analysis',
        'Risk assessment scoring',
        'Compliance verification',
        'Report generation'
      ],
      'Financial': [
        'Portfolio data analysis',
        'Risk metric calculation',
        'Market comparison',
        'Diversification analysis',
        'Recommendation synthesis'
      ],
      'Technical': [
        'Requirements analysis',
        'Algorithm selection',
        'Code generation',
        'Validation checks'
      ],
      'Healthcare': [
        'Symptom classification',
        'Knowledge base lookup',
        'Risk assessment',
        'Recommendation generation'
      ],
    };

    const names = stepSets[vertical] || ['Processing', 'Analyzing', 'Generating'];
    return names.map((name, idx) => ({
      id: `step-${idx}`,
      name,
      status: 'pending' as const,
    }));
  };

  // Generate step output
  const generateStepOutput = (stepName: string, vertical: string): string => {
    const outputs: Record<string, Record<string, string>> = {
      'Real Estate': {
        'Parsing document structure': '42 sections identified, 128 clauses extracted',
        'Extracting key terms and clauses': 'Found 15 key terms, 8 financial obligations',
        'Analyzing compliance with NY Housing Law': '3 potential compliance issues detected',
        'Identifying risk factors': 'Risk score: 6.2/10 (Moderate)',
        'Generating recommendations': '4 recommendations generated',
      },
      'Legal': {
        'Document classification': 'Type: NDA | Subtype: Mutual | Complexity: High',
        'Clause extraction and analysis': '24 clauses analyzed, 3 flagged for review',
        'Risk assessment scoring': 'Overall risk: 7.1/10',
        'Compliance verification': 'Jurisdiction check passed',
        'Report generation': 'Report compiled (2,400 words)',
      },
      'Financial': {
        'Portfolio data analysis': 'Assets: $245K | Holdings: 18 positions',
        'Risk metric calculation': 'Sharpe Ratio: 0.82 | Beta: 1.15',
        'Market comparison': 'Outperforming S&P 500 by 2.3%',
        'Diversification analysis': 'Sector concentration: Tech 45%',
        'Recommendation synthesis': '3 rebalancing suggestions generated',
      },
      'Technical': {
        'Requirements analysis': 'Input: List | Output: Sorted List | Complexity: O(n log n)',
        'Algorithm selection': 'Selected: Timsort (hybrid merge/insertion)',
        'Code generation': 'Generated 15 lines of Python',
        'Validation checks': 'All edge cases handled',
      },
    };

    return outputs[vertical]?.[stepName] || 'Completed successfully';
  };

  // Generate response based on vertical
  const generateResponse = (vertical: string, agent: AgentInPool): string => {
    const responses: Record<string, string> = {
      'Real Estate': `**Lease Analysis Complete**\n\nI've analyzed the lease document and identified the following key points:\n\n1. **Rent Terms**: Standard NYC market rate structure\n2. **Security Deposit**: 1 month (compliant with NY Housing Stability Act)\n3. ⚠️ **Risk Flag**: Unusual early termination penalty clause (Section 12.3)\n4. **Recommendation**: Negotiate the penalty clause before signing\n\n*This analysis was performed by ${agent.name} under ${agent.permission_level} authorization. ${agent.permission_level === 'execute_with_human' ? 'A licensed broker has reviewed and approved this analysis.' : ''}*`,
      'Legal': `**Contract Analysis Complete**\n\nI've reviewed the NDA and extracted key risks:\n\n1. **Non-Compete Duration**: 2 years (aggressive)\n2. **Geographic Scope**: Nationwide (broad)\n3. ⚠️ **Risk Flag**: Unilateral modification clause in Section 8\n4. **Recommendation**: Request mutual modification rights\n\n⚖️ *ANALYSIS ONLY - NOT LEGAL ADVICE*\n*Performed by ${agent.name}. Please consult with your attorney.*`,
      'Financial': `**Portfolio Analysis Complete**\n\nBased on your 401k allocation:\n\n1. **Current Risk Level**: High concentration in tech sector (45%)\n2. **Recommendation**: Consider diversifying into bonds/international\n3. **Target Allocation**: 60% stocks, 30% bonds, 10% alternatives\n\n💰 *Advisory Only - This is not investment advice*\n*Performed by ${agent.name}. Execute trades through your own broker.*`,
      'Technical': `**Code Solution**\n\n\`\`\`python\ndef sort_list(items, reverse=False):\n    """Sort a list using Python's built-in Timsort.\n    \n    Args:\n        items: List to sort\n        reverse: Sort in descending order if True\n    \n    Returns:\n        New sorted list\n    """\n    return sorted(items, reverse=reverse)\n\n# Example usage\nnumbers = [3, 1, 4, 1, 5, 9, 2, 6]\nprint(sort_list(numbers))  # [1, 1, 2, 3, 4, 5, 6, 9]\n\`\`\`\n\n*Generated by ${agent.name}*`,
    };

    return responses[vertical] || `I've processed your request through ${agent.name}. The analysis is complete.`;
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="AIoOS Logo" width={32} height={32} />
              <span className="text-lg font-bold">AIoOS</span>
              <span className="px-2 py-0.5 bg-blue-600 text-xs rounded-full">Butler Agent</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/lifecycle" className="text-sm text-green-400 hover:text-green-300">
                PTAS Demo
              </Link>
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
                Dashboard
              </Link>
              <Link href="/architecture" className="text-sm text-gray-400 hover:text-white">
                Architecture
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl rounded-xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : msg.role === 'butler'
                    ? 'bg-gray-700 text-white'
                    : msg.metadata?.type === 'dispatch'
                    ? 'bg-green-900/30 text-green-300 border border-green-700 text-sm font-mono'
                    : msg.metadata?.type === 'revoke'
                    ? 'bg-red-900/30 text-red-300 border border-red-700 text-sm font-mono'
                    : msg.metadata?.type === 'audit'
                    ? 'bg-purple-900/30 text-purple-300 border border-purple-700 text-sm font-mono'
                    : 'bg-gray-800 text-gray-300 border border-gray-600 text-sm font-mono'
                }`}>
                  {msg.role === 'butler' && (
                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
                      <span>🎩</span>
                      <span>Butler Agent</span>
                    </div>
                  )}
                  {msg.role === 'system' && msg.metadata?.type && (
                    <div className="flex items-center gap-2 mb-2 text-xs text-purple-400">
                      <span>{msg.metadata.type === 'dispatch' ? '🚀' : msg.metadata.type === 'revoke' ? '🛑' : msg.metadata.type === 'audit' ? '📋' : '⚙️'}</span>
                      <span className="uppercase">{msg.metadata.type.replace('_', ' ')}</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/`([^`]+)`/g, '<code class="bg-gray-900 px-1 rounded">$1</code>')
                      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 p-2 rounded mt-2 overflow-x-auto"><code>$2</code></pre>')
                  }} />
                </div>
              </div>
            ))}

            {/* Dispatch Confirmation Panel */}
            {showDispatchConfirm && dispatchInfo && (
              <div className="flex justify-start">
                <div className="max-w-2xl w-full bg-gradient-to-br from-green-900/40 to-green-800/20 border-2 border-green-500 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🚀</span>
                    <h3 className="text-lg font-bold text-green-400">Dispatch Agent Confirmation</h3>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between py-2 border-b border-green-700/50">
                      <span className="text-gray-400">Agent Name:</span>
                      <span className="text-white font-medium">{dispatchInfo.agent.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-green-700/50">
                      <span className="text-gray-400">Agent ID:</span>
                      <span className="text-green-400 font-mono text-sm">{dispatchInfo.agent.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-green-700/50">
                      <span className="text-gray-400">Task Description:</span>
                      <span className="text-white text-sm max-w-xs truncate">{dispatchInfo.taskDescription}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-green-700/50">
                      <span className="text-gray-400">Permission Level:</span>
                      <span className={`font-medium ${
                        dispatchInfo.agent.permission_level === 'advisory_only' ? 'text-green-400' :
                        dispatchInfo.agent.permission_level === 'execute_with_human' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>{dispatchInfo.agent.permission_level}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-green-700/50">
                      <span className="text-gray-400">Trust Tier:</span>
                      <span className="text-white">{dispatchInfo.agent.trust_tier}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">Est. Token Consumption:</span>
                      <span className="text-cyan-400 font-mono">~{dispatchInfo.estimatedTokens.toLocaleString()} tokens</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleDispatchCancel}
                      className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDispatchConfirm}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <span>✓</span>
                      <span>Confirm Dispatch</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Dispatch Button (shown after license check passes) */}
            {currentStep === 'dispatch_ready' && !showDispatchConfirm && dispatchInfo && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowDispatchConfirm(true)}
                  className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-3 shadow-lg shadow-green-500/30"
                >
                  <span className="text-xl">✓</span>
                  <span>Dispatch Agent</span>
                </button>
              </div>
            )}

            {/* Execution Progress Panel */}
            {isExecuting && executionSteps.length > 0 && (
              <div className="flex justify-start">
                <div className="max-w-2xl w-full bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl animate-pulse">🔄</span>
                      <h3 className="text-lg font-bold text-blue-400">Execution Progress</h3>
                    </div>
                    {canRevoke && (
                      <button
                        onClick={handleRevoke}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                      >
                        <span>🛑</span>
                        <span>Revoke</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {executionSteps.map((step, idx) => (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 p-2 rounded-lg ${
                          step.status === 'running' ? 'bg-blue-800/30' :
                          step.status === 'completed' ? 'bg-green-800/20' :
                          'bg-gray-800/30'
                        }`}
                      >
                        <div className="w-6 h-6 flex items-center justify-center">
                          {step.status === 'pending' && <span className="text-gray-500">○</span>}
                          {step.status === 'running' && (
                            <svg className="animate-spin h-5 w-5 text-blue-400" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          )}
                          {step.status === 'completed' && <span className="text-green-400">✓</span>}
                          {step.status === 'failed' && <span className="text-red-400">✗</span>}
                        </div>
                        <div className="flex-1">
                          <div className={`text-sm ${
                            step.status === 'running' ? 'text-blue-300 font-medium' :
                            step.status === 'completed' ? 'text-green-300' :
                            'text-gray-400'
                          }`}>
                            Step {idx + 1}: {step.name}
                          </div>
                          {step.output && (
                            <div className="text-xs text-gray-500 mt-0.5">{step.output}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-blue-400">
                        {executionSteps.filter(s => s.status === 'completed').length}/{executionSteps.length} steps
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                        style={{ width: `${(executionSteps.filter(s => s.status === 'completed').length / executionSteps.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Example Prompts */}
          {messages.length === 1 && (
            <div className="px-4 pb-4">
              <div className="text-sm text-gray-400 mb-2">Try these examples:</div>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleExampleClick(prompt.text)}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm flex items-center gap-2 transition-colors"
                  >
                    <span>{prompt.icon}</span>
                    <span>{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-700 p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Butler Agent anything..."
                className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={isProcessing || !input.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl font-medium transition-colors"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing
                  </span>
                ) : 'Send'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar - Agent Pool Monitor */}
        <div className="w-80 border-l border-gray-700 bg-gray-800 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>🤖</span>
              Agent Pool Monitor
              <span className="text-xs text-gray-400 font-normal">(Patent 3: PTAS)</span>
            </h3>

            {/* Lifecycle Legend */}
            <div className="mb-4 p-3 bg-gray-900 rounded-lg">
              <div className="text-xs text-gray-400 mb-2">Lifecycle States:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stateColors).map(([state, colors]) => (
                  <div key={state} className="flex items-center gap-1">
                    <span className={`w-2 h-2 ${colors.bg} rounded-full`}></span>
                    <span className="text-xs text-gray-400">{state}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Processing Step */}
            {currentStep && (
              <div className={`mb-4 p-3 border rounded-lg ${
                currentStep === 'dispatch_ready'
                  ? 'bg-green-900/30 border-green-700'
                  : isExecuting
                  ? 'bg-blue-900/30 border-blue-700'
                  : 'bg-blue-900/30 border-blue-700'
              }`}>
                <div className={`text-xs mb-1 ${
                  currentStep === 'dispatch_ready' ? 'text-green-400' : 'text-blue-400'
                }`}>Current Step:</div>
                <div className={`text-sm font-medium capitalize ${
                  currentStep === 'dispatch_ready' ? 'text-green-300' : 'text-blue-300'
                }`}>
                  {currentStep === 'dispatch_ready' ? 'Ready to Dispatch' : currentStep.replace('_', ' ')}
                </div>
                {isExecuting && (
                  <div className="mt-2 flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-blue-400" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-xs text-blue-300">Processing...</span>
                  </div>
                )}
              </div>
            )}

            {/* Revoke Button in Sidebar */}
            {canRevoke && !isRevoked && (
              <div className="mb-4">
                <button
                  onClick={handleRevoke}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span>🛑</span>
                  <span>Revoke Execution</span>
                </button>
              </div>
            )}

            {/* Discovery Results */}
            {discoveryResults && discoveryResults.length > 0 && (
              <div className="mb-4 p-3 bg-purple-900/30 border border-purple-700 rounded-lg">
                <div className="text-xs text-purple-400 mb-2">Discovery Results:</div>
                {discoveryResults.slice(0, 3).map((result, i) => (
                  <div key={result.agent.id} className={`flex items-center justify-between py-1 ${i === 0 ? 'text-green-400' : 'text-gray-400'}`}>
                    <span className="text-xs">{result.agent.name}</span>
                    <span className="text-xs font-mono">{result.fitness_score}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* Agent Cards */}
            <div className="space-y-3">
              {agentPool.map((agent) => {
                const stateStyle = stateColors[agent.state];
                const isSelected = selectedAgent?.id === agent.id;

                return (
                  <div
                    key={agent.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-blue-900/30 border-blue-500'
                        : 'bg-gray-900 border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{stateStyle.icon}</span>
                        <span className="font-medium text-sm">{agent.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 ${stateStyle.bg} ${stateStyle.text} text-xs rounded font-mono`}>
                        {agent.state}
                      </span>
                    </div>

                    <div className="text-xs text-gray-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Vertical:</span>
                        <span className="text-gray-300">{agent.vertical}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trust:</span>
                        <span className="text-gray-300">{agent.trust_tier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Permission:</span>
                        <span className={`${
                          agent.permission_level === 'advisory_only' ? 'text-green-400' :
                          agent.permission_level === 'execute_with_human' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>{agent.permission_level}</span>
                      </div>
                    </div>

                    {/* Utilization Bar */}
                    {agent.state !== 'DORMANT' && agent.state !== 'HIBERNATING' && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Utilization</span>
                          <span className="text-gray-400">{agent.utilization}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${stateStyle.bg} transition-all duration-500`}
                            style={{ width: `${agent.utilization}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pool Stats */}
            <div className="mt-4 p-3 bg-gray-900 rounded-lg">
              <div className="text-xs text-gray-400 mb-2">Pool Statistics:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total:</span>
                  <span>{agentPool.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Active:</span>
                  <span className="text-green-400">{agentPool.filter(a => a.state === 'ACTIVE' || a.state === 'EXECUTING').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dormant:</span>
                  <span className="text-gray-400">{agentPool.filter(a => a.state === 'DORMANT').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Hibernating:</span>
                  <span className="text-purple-400">{agentPool.filter(a => a.state === 'HIBERNATING').length}</span>
                </div>
              </div>
            </div>

            {/* Audit Log */}
            {auditLog.length > 0 && (
              <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                  <span>📋</span>
                  <span>Audit Log</span>
                  <span className="ml-auto text-gray-500">({auditLog.length})</span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {auditLog.slice(0, 5).map((record, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded text-xs border ${
                        record.status === 'success'
                          ? 'bg-green-900/20 border-green-800'
                          : record.status === 'revoked'
                          ? 'bg-yellow-900/20 border-yellow-800'
                          : 'bg-red-900/20 border-red-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-300">{record.agentName}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                          record.status === 'success'
                            ? 'bg-green-800 text-green-300'
                            : record.status === 'revoked'
                            ? 'bg-yellow-800 text-yellow-300'
                            : 'bg-red-800 text-red-300'
                        }`}>
                          {record.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-gray-500 truncate">{record.action}</div>
                      <div className="flex justify-between text-gray-600 mt-1">
                        <span>{record.tokensUsed} tokens</span>
                        <span>{(record.duration / 1000).toFixed(1)}s</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Execution Steps Mini View */}
            {isExecuting && executionSteps.length > 0 && (
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
                <div className="text-xs text-blue-400 mb-2 flex items-center gap-2">
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Task Execution</span>
                </div>
                <div className="space-y-1">
                  {executionSteps.map((step, idx) => (
                    <div key={step.id} className="flex items-center gap-2 text-xs">
                      <span className={`w-4 ${
                        step.status === 'completed' ? 'text-green-400' :
                        step.status === 'running' ? 'text-blue-400' :
                        'text-gray-600'
                      }`}>
                        {step.status === 'completed' ? '✓' : step.status === 'running' ? '▶' : '○'}
                      </span>
                      <span className={
                        step.status === 'completed' ? 'text-gray-400' :
                        step.status === 'running' ? 'text-blue-300' :
                        'text-gray-600'
                      }>
                        {idx + 1}. {step.name.slice(0, 20)}{step.name.length > 20 ? '...' : ''}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${(executionSteps.filter(s => s.status === 'completed').length / executionSteps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
