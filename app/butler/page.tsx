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
    type?: 'discovery' | 'license_check' | 'activation' | 'execution' | 'result' | 'escalation';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    setIsProcessing(true);
    setDiscoveryResults(null);
    setSelectedAgent(null);

    // Add user message
    addMessage({ role: 'user', content: userMessage });

    await sleep(500);

    // Step 1: Intent Interpretation
    setCurrentStep('intent');
    const intent = detectIntent(userMessage);
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

    await sleep(1000);

    // Step 4: Agent Activation (PTAS lifecycle)
    setCurrentStep('activation');
    const wasState = bestMatch.agent.state;

    if (wasState === 'DORMANT' || wasState === 'HIBERNATING') {
      addMessage({
        role: 'system',
        content: `⚡ **Agent Activation (PTAS)**\n${bestMatch.agent.name}: **${wasState}** → **ACTIVATING**`,
        metadata: { type: 'activation', agentId: bestMatch.agent.id }
      });

      updateAgentState(bestMatch.agent.id, 'ACTIVATING');
      await sleep(600);

      addMessage({
        role: 'system',
        content: `🟢 ${bestMatch.agent.name}: **ACTIVATING** → **ACTIVE** (180ms)`,
        metadata: { type: 'activation', agentId: bestMatch.agent.id }
      });

      updateAgentState(bestMatch.agent.id, 'ACTIVE', 50);
    }

    await sleep(500);

    // Step 5: Task Execution
    setCurrentStep('execution');
    addMessage({
      role: 'system',
      content: `🔄 **Executing Task**\n${bestMatch.agent.name}: **ACTIVE** → **EXECUTING**\nProcessing your request...`,
      metadata: { type: 'execution', agentId: bestMatch.agent.id }
    });

    updateAgentState(bestMatch.agent.id, 'EXECUTING', 95);

    await sleep(2000);

    // Step 6: Check if human approval needed
    if (bestMatch.agent.permission_level === 'execute_with_human') {
      setCurrentStep('escalation');
      addMessage({
        role: 'system',
        content: `⚠️ **Human Approval Required**\nPermission level: **execute_with_human**\nThis result requires human professional review before final delivery.`,
        metadata: { type: 'escalation', agentId: bestMatch.agent.id }
      });
      await sleep(1000);
    }

    // Step 7: Return result
    setCurrentStep('result');

    // Generate contextual response based on vertical
    let response = '';
    if (intent.vertical === 'Real Estate') {
      response = `**Lease Analysis Complete**\n\nI've analyzed the lease document and identified the following key points:\n\n1. **Rent Terms**: Standard NYC market rate structure\n2. **Security Deposit**: 1 month (compliant with NY Housing Stability Act)\n3. ⚠️ **Risk Flag**: Unusual early termination penalty clause (Section 12.3)\n4. **Recommendation**: Negotiate the penalty clause before signing\n\n*This analysis was performed by ${bestMatch.agent.name} under ${bestMatch.agent.permission_level} authorization. ${bestMatch.agent.permission_level === 'execute_with_human' ? 'A licensed broker has reviewed and approved this analysis.' : ''}*`;
    } else if (intent.vertical === 'Legal') {
      response = `**Contract Analysis Complete**\n\nI've reviewed the NDA and extracted key risks:\n\n1. **Non-Compete Duration**: 2 years (aggressive)\n2. **Geographic Scope**: Nationwide (broad)\n3. ⚠️ **Risk Flag**: Unilateral modification clause in Section 8\n4. **Recommendation**: Request mutual modification rights\n\n⚖️ *ANALYSIS ONLY - NOT LEGAL ADVICE*\n*Performed by ${bestMatch.agent.name}. Please consult with your attorney.*`;
    } else if (intent.vertical === 'Financial') {
      response = `**Portfolio Analysis Complete**\n\nBased on your 401k allocation:\n\n1. **Current Risk Level**: High concentration in tech sector (45%)\n2. **Recommendation**: Consider diversifying into bonds/international\n3. **Target Allocation**: 60% stocks, 30% bonds, 10% alternatives\n\n💰 *Advisory Only - This is not investment advice*\n*Performed by ${bestMatch.agent.name}. Execute trades through your own broker.*`;
    } else if (intent.vertical === 'Technical') {
      response = `**Code Solution**\n\n\`\`\`python\ndef sort_list(items, reverse=False):\n    """Sort a list using Python's built-in Timsort.\n    \n    Args:\n        items: List to sort\n        reverse: Sort in descending order if True\n    \n    Returns:\n        New sorted list\n    """\n    return sorted(items, reverse=reverse)\n\n# Example usage\nnumbers = [3, 1, 4, 1, 5, 9, 2, 6]\nprint(sort_list(numbers))  # [1, 1, 2, 3, 4, 5, 6, 9]\n\`\`\`\n\n*Generated by ${bestMatch.agent.name}*`;
    } else {
      response = `I've processed your request through ${bestMatch.agent.name}. The analysis is complete.`;
    }

    addMessage({
      role: 'butler',
      content: response,
      metadata: { type: 'result', agentId: bestMatch.agent.id, agentName: bestMatch.agent.name }
    });

    // Return agent to DORMANT
    await sleep(500);
    updateAgentState(bestMatch.agent.id, 'ACTIVE', 30);
    await sleep(1000);
    updateAgentState(bestMatch.agent.id, 'DORMANT', 0);

    addMessage({
      role: 'system',
      content: `💤 ${bestMatch.agent.name}: **ACTIVE** → **DORMANT**\nAgent returned to low-power state.`,
      metadata: { type: 'activation', agentId: bestMatch.agent.id }
    });

    setIsProcessing(false);
    setCurrentStep(null);
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
                      <span>⚙️</span>
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
              <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                <div className="text-xs text-blue-400 mb-1">Current Step:</div>
                <div className="text-sm font-medium text-blue-300 capitalize">
                  {currentStep.replace('_', ' ')}
                </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
