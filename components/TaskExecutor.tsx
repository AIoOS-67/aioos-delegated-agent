'use client';

import { useState, useRef, useEffect } from 'react';

interface AgentLicense {
  license_type: string;
  jurisdiction: string[];
  permission_level: 'advisory_only' | 'execute_with_human' | 'autonomous';
  permitted_actions: string[];
  prohibited_actions: string[];
  insurance_policy_id: string;
}

interface Agent {
  id: string;
  name: string;
  permissions: string[];
  constraints?: string;
  status: 'active' | 'revoked' | 'expired';
  license?: AgentLicense;
}

interface ToolCall {
  name: string;
  args: Record<string, any>;
  result: any;
  timestamp: string;
}

interface DelegationCheck {
  status: 'checking' | 'valid' | 'invalid';
  checks: {
    name: string;
    status: 'pass' | 'fail';
    detail: string;
  }[];
  timestamp: string;
}

interface RiskAssessment {
  task_complexity: number;
  data_sensitivity: number;
  financial_impact: number;
  legal_implications: number;
  overall_score: number;
  escalation_level: 'ai_handles' | 'human_review' | 'human_required';
  escalation_reason?: string;
}

interface TaskStep {
  step: number;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
  toolCalls?: ToolCall[];
  delegationCheck?: DelegationCheck;
}

interface TaskExecutorProps {
  agent: Agent;
  onClose: () => void;
  onAgentRevoked: () => void;
}

// High-risk task examples for demo
const HIGH_RISK_EXAMPLES = [
  'Transfer $5000 to account ending in 4521',
  'Draft and sign the employment contract for John',
  'Delete all customer records from the database',
  'Provide medical diagnosis for the patient symptoms',
];

export default function TaskExecutor({ agent, onClose, onAgentRevoked }: TaskExecutorProps) {
  const [taskDescription, setTaskDescription] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [steps, setSteps] = useState<TaskStep[]>([]);
  const [finalResult, setFinalResult] = useState('');
  const [error, setError] = useState('');
  const [agentStatus, setAgentStatus] = useState(agent.status);
  const [currentDelegationCheck, setCurrentDelegationCheck] = useState<DelegationCheck | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [prohibitedWarning, setProhibitedWarning] = useState<string[] | null>(null);
  const [showAuthorityChain, setShowAuthorityChain] = useState(false);
  const [humanApprovalPending, setHumanApprovalPending] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const stepsEndRef = useRef<HTMLDivElement>(null);

  const permissionLevel = agent.license?.permission_level || 'execute_with_human';

  // Poll agent status during execution
  useEffect(() => {
    if (!isExecuting) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/agent/${agent.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.agent.status !== 'active') {
            setAgentStatus(data.agent.status);
            if (abortControllerRef.current) {
              abortControllerRef.current.abort();
            }
          }
        }
      } catch (err) {
        console.error('Error checking agent status:', err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isExecuting, agent.id]);

  // Auto-scroll to bottom when steps update
  useEffect(() => {
    stepsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [steps, currentDelegationCheck]);

  // Calculate risk when task description changes
  useEffect(() => {
    if (!taskDescription.trim()) {
      setRiskAssessment(null);
      setProhibitedWarning(null);
      return;
    }

    // Check prohibited actions
    const prohibited = agent.license?.prohibited_actions || [];
    const lowerTask = taskDescription.toLowerCase();
    const matchedProhibited = prohibited.filter(action => {
      const keywords = action.toLowerCase().replace(/_/g, ' ').split(' ');
      return keywords.some(k => lowerTask.includes(k));
    });

    if (matchedProhibited.length > 0) {
      setProhibitedWarning(matchedProhibited);
      setRiskAssessment({
        task_complexity: 10,
        data_sensitivity: 10,
        financial_impact: 10,
        legal_implications: 10,
        overall_score: 10,
        escalation_level: 'human_required',
        escalation_reason: `Prohibited actions detected: ${matchedProhibited.join(', ')}`
      });
      return;
    }

    setProhibitedWarning(null);

    // Calculate risk score
    const highRiskKeywords = ['transfer', 'payment', 'transaction', 'money', 'delete', 'legal', 'contract', 'medical', 'password'];
    const mediumRiskKeywords = ['send', 'email', 'create', 'modify', 'schedule', 'report'];
    const financialKeywords = ['dollar', 'price', 'cost', '$', 'trade', 'invest'];
    const legalKeywords = ['contract', 'agreement', 'legal', 'law', 'compliance'];

    let taskComplexity = Math.min(taskDescription.length / 50, 5);
    if (highRiskKeywords.some(k => lowerTask.includes(k))) taskComplexity += 4;
    else if (mediumRiskKeywords.some(k => lowerTask.includes(k))) taskComplexity += 2;
    taskComplexity = Math.min(Math.round(taskComplexity), 10);

    let dataSensitivity = 0;
    if (lowerTask.includes('personal') || lowerTask.includes('private') || lowerTask.includes('password')) dataSensitivity = 8;
    else if (lowerTask.includes('data') || lowerTask.includes('information')) dataSensitivity = 3;

    let financialImpact = 0;
    if (financialKeywords.some(k => lowerTask.includes(k))) {
      financialImpact = 6;
      const amountMatch = taskDescription.match(/\$[\d,]+/);
      if (amountMatch) {
        const amount = parseInt(amountMatch[0].replace(/[^\d]/g, ''));
        if (amount > 1000) financialImpact = 9;
        else if (amount > 100) financialImpact = 7;
      }
    }

    let legalImplications = 0;
    if (legalKeywords.some(k => lowerTask.includes(k))) legalImplications = 7;

    const overallScore = Math.round(
      (taskComplexity * 0.2 + dataSensitivity * 0.3 + financialImpact * 0.3 + legalImplications * 0.2) * 10
    ) / 10;

    let escalationLevel: 'ai_handles' | 'human_review' | 'human_required';
    let escalationReason: string | undefined;

    if (permissionLevel === 'advisory_only') {
      escalationLevel = 'human_required';
      escalationReason = 'Agent is in Advisory Only mode';
    } else if (permissionLevel === 'execute_with_human' && overallScore > 3) {
      escalationLevel = 'human_review';
      escalationReason = 'Execute with Human mode - confirmation needed';
    } else if (overallScore >= 7) {
      escalationLevel = 'human_required';
      escalationReason = `High risk score (${overallScore}/10)`;
    } else if (overallScore >= 4) {
      escalationLevel = 'human_review';
      escalationReason = `Medium risk score (${overallScore}/10)`;
    } else {
      escalationLevel = 'ai_handles';
    }

    setRiskAssessment({
      task_complexity: taskComplexity,
      data_sensitivity: dataSensitivity,
      financial_impact: financialImpact,
      legal_implications: legalImplications,
      overall_score: overallScore,
      escalation_level: escalationLevel,
      escalation_reason: escalationReason
    });
  }, [taskDescription, agent.license, permissionLevel]);

  const executeTask = async () => {
    if (!taskDescription.trim()) {
      setError('Please enter a task description');
      return;
    }

    if (prohibitedWarning) {
      setError('Cannot execute: This task violates the agent\'s license restrictions.');
      return;
    }

    // Check if human approval is needed
    if (riskAssessment?.escalation_level === 'human_review' && !humanApprovalPending) {
      setHumanApprovalPending(true);
      return;
    }

    if (riskAssessment?.escalation_level === 'human_required') {
      setError('This task requires human intervention. The agent cannot proceed autonomously.');
      return;
    }

    setIsExecuting(true);
    setSteps([]);
    setFinalResult('');
    setError('');
    setCurrentDelegationCheck(null);
    setHumanApprovalPending(false);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/task/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.id,
          description: taskDescription,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Task execution failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n').filter(line => line.startsWith('data: '));

        for (const line of lines) {
          const jsonStr = line.slice(6);
          if (jsonStr === '[DONE]') continue;

          try {
            const event = JSON.parse(jsonStr);

            if (event.type === 'steps') {
              setSteps(event.steps);
            } else if (event.type === 'delegation_check') {
              setCurrentDelegationCheck(event.check);
            } else if (event.type === 'result') {
              setFinalResult(event.result);
            } else if (event.type === 'error') {
              if (event.error.includes('AGENT_REVOKED')) {
                setAgentStatus('revoked');
                onAgentRevoked();
              }
              setError(event.error);
            }
          } catch (e) {
            console.error('Error parsing event:', e);
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setIsExecuting(false);
      setCurrentDelegationCheck(null);
    }
  };

  const handleStop = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    try {
      const res = await fetch(`/api/revoke/${agent.id}`, { method: 'POST' });
      if (res.ok) {
        setAgentStatus('revoked');
        onAgentRevoked();
        setSteps(prev => prev.map(s =>
          s.status === 'running'
            ? { ...s, status: 'failed' as const, output: '🛑 INTERRUPTED - Authority revoked' }
            : s.status === 'pending'
              ? { ...s, status: 'failed' as const, output: 'Skipped - Agent revoked' }
              : s
        ));
        setError('⛔ AUTHORITY REVOKED — ALL ACTIONS BLOCKED');
      }
    } catch (err) {
      console.error('Error revoking agent:', err);
    }
  };

  const getRiskLabel = (score: number) => {
    if (score === 0) return 'None';
    if (score <= 3) return 'Low';
    if (score <= 6) return 'Medium';
    return 'High';
  };

  const getRiskColor = (score: number) => {
    if (score <= 3) return 'text-green-600';
    if (score <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStepIcon = (status: TaskStep['status']) => {
    switch (status) {
      case 'pending':
        return (
          <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gray-300" />
          </div>
        );
      case 'running':
        return (
          <div className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-black animate-pulse" />
          </div>
        );
      case 'completed':
        return (
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'failed':
        return (
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
    }
  };

  const isAgentInvalid = agentStatus !== 'active';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-black">Execute Task</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-700">Agent: <span className="font-medium text-black">{agent.name}</span></span>
                <span className="text-xs text-gray-500 font-mono">did:aioos:{agent.id.slice(0, 8)}</span>
                {agent.license && (
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    permissionLevel === 'advisory_only' ? 'bg-green-100 text-green-700' :
                    permissionLevel === 'execute_with_human' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {permissionLevel === 'advisory_only' ? '🟢 Advisory' :
                     permissionLevel === 'execute_with_human' ? '🟡 Human Review' : '🔴 Autonomous'}
                  </span>
                )}
                {isAgentInvalid && (
                  <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                    {agentStatus === 'revoked' ? 'REVOKED' : 'EXPIRED'}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAuthorityChain(!showAuthorityChain)}
                className="text-sm text-gray-600 hover:text-black px-2 py-1 rounded hover:bg-gray-100"
              >
                {showAuthorityChain ? 'Hide' : 'Show'} Authority Chain
              </button>
              <button onClick={onClose} className="text-gray-600 hover:text-black">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Authority Chain */}
          {showAuthorityChain && (
            <div className="mt-4 p-3 bg-gray-900 rounded-lg text-xs font-mono text-green-400">
              <div className="text-gray-500 mb-2">AUTHORITY CHAIN</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">Human</span>
                  <span className="text-gray-500">(demo@aioos.io)</span>
                </div>
                <div className="text-gray-600 pl-4">↓ [Delegation: {new Date(agent.created_at || Date.now()).toLocaleString()}]</div>
                <div className="pl-4 text-green-400">Auth0 Verified ✓</div>
                <div className="text-gray-600 pl-4">↓ [License Issued]</div>
                <div className="flex items-center gap-2 pl-4">
                  <span className="text-purple-400">Agent</span>
                  <span className="text-gray-500">(did:aioos:agent:{agent.id.slice(0, 8)})</span>
                </div>
                <div className="text-gray-600 pl-4">↓ [Scoped Permissions]</div>
                <div className="pl-4 text-yellow-400">Gemini Execution Layer</div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Task Input & Execution */}
            <div className="lg:col-span-2 space-y-4">
              {/* Task Input */}
              <div>
                <label className="label">Task Description</label>
                <textarea
                  value={taskDescription}
                  onChange={e => setTaskDescription(e.target.value)}
                  placeholder="e.g., Check my calendar for today and send a summary email..."
                  className="input h-20 resize-none"
                  disabled={isExecuting || isAgentInvalid}
                />
                {/* Try High-Risk Task button */}
                <div className="mt-2 flex gap-2">
                  <span className="text-xs text-gray-500">Try:</span>
                  {HIGH_RISK_EXAMPLES.slice(0, 2).map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => setTaskDescription(ex)}
                      className="text-xs text-red-600 hover:text-red-700 hover:underline"
                      disabled={isExecuting}
                    >
                      {ex.slice(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Prohibited Actions Warning */}
              {prohibitedWarning && (
                <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🚫</span>
                    <div>
                      <h4 className="font-bold text-red-800">Action Outside Licensed Scope</h4>
                      <p className="text-sm text-red-700 mt-1">
                        This task violates the agent's license restrictions:
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {prohibitedWarning.map(action => (
                          <span key={action} className="px-2 py-1 bg-red-200 text-red-800 rounded text-xs font-medium">
                            {action.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-red-600 mt-2">
                        To perform this action, upgrade the agent's license or contact human operator.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Human Approval Pending */}
              {humanApprovalPending && (
                <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-yellow-800">Human Review Required</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Risk Score: {riskAssessment?.overall_score}/10 — This task requires your confirmation before the agent can proceed.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => { setHumanApprovalPending(false); executeTask(); }}
                          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg"
                        >
                          ✓ Approve & Execute
                        </button>
                        <button
                          onClick={() => setHumanApprovalPending(false)}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Real-time Delegation Check */}
              {currentDelegationCheck && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Verifying Delegation...
                  </h4>
                  <div className="space-y-1 text-xs font-mono">
                    {currentDelegationCheck.checks.map((check, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={check.status === 'pass' ? 'text-green-600' : 'text-red-600'}>
                          {check.status === 'pass' ? '✓' : '✗'}
                        </span>
                        <span className="text-gray-700">{check.name}:</span>
                        <span className="text-gray-800">{check.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className={`p-4 rounded-lg border-2 ${
                  error.includes('REVOKED') || error.includes('BLOCKED')
                    ? 'bg-red-100 border-red-400'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{error.includes('REVOKED') ? '⛔' : '❌'}</span>
                    <div>
                      <p className={`font-bold ${error.includes('REVOKED') ? 'text-red-800 text-lg' : 'text-red-600'}`}>
                        {error.includes('REVOKED') ? error : 'Execution Error'}
                      </p>
                      {!error.includes('REVOKED') && (
                        <p className="text-red-700 text-sm mt-1">{error}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Steps Progress */}
              {steps.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wide mb-3">
                    Execution Progress
                  </h3>
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div key={index} className="flex gap-3">
                        {getStepIcon(step.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-black">Step {step.step}</span>
                            <span className="text-gray-600">-</span>
                            <span className="text-gray-800">{step.description}</span>
                          </div>

                          {step.delegationCheck && (
                            <div className="mt-1 text-xs font-mono text-gray-600">
                              <span className={step.delegationCheck.status === 'valid' ? 'text-green-600' : 'text-red-600'}>
                                {step.delegationCheck.status === 'valid' ? '✓' : '✗'}
                              </span>
                              {' '}Delegation {step.delegationCheck.status}
                            </div>
                          )}

                          {step.toolCalls && step.toolCalls.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {step.toolCalls.map((tc, tcIndex) => (
                                <div key={tcIndex} className="p-2 bg-blue-50 rounded border border-blue-100 text-xs">
                                  <span className="font-medium text-blue-800">🔧 {tc.name}</span>
                                  <span className="text-blue-600 ml-2">{tc.result?.success ? '✓' : '✗'}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {step.output && (
                            <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-100 text-xs text-gray-800">
                              {step.output.length > 200 ? step.output.slice(0, 200) + '...' : step.output}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={stepsEndRef} />
                  </div>
                </div>
              )}

              {/* Final Result */}
              {finalResult && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800 mb-2">✓ Task Completed</h3>
                  <p className="text-sm text-gray-800">{finalResult}</p>
                </div>
              )}
            </div>

            {/* Right: Risk Assessment Panel */}
            <div className="space-y-4">
              {/* Risk Assessment */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  RISK ASSESSMENT
                </h3>

                {riskAssessment ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Task Complexity:</span>
                      <span className={getRiskColor(riskAssessment.task_complexity)}>
                        {getRiskLabel(riskAssessment.task_complexity)} ({riskAssessment.task_complexity}/10)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data Sensitivity:</span>
                      <span className={getRiskColor(riskAssessment.data_sensitivity)}>
                        {getRiskLabel(riskAssessment.data_sensitivity)} ({riskAssessment.data_sensitivity}/10)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Financial Impact:</span>
                      <span className={getRiskColor(riskAssessment.financial_impact)}>
                        {getRiskLabel(riskAssessment.financial_impact)} ({riskAssessment.financial_impact}/10)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Legal Implications:</span>
                      <span className={getRiskColor(riskAssessment.legal_implications)}>
                        {getRiskLabel(riskAssessment.legal_implications)} ({riskAssessment.legal_implications}/10)
                      </span>
                    </div>

                    <div className="pt-2 mt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">Overall Score:</span>
                        <span className={`text-lg font-bold ${getRiskColor(riskAssessment.overall_score)}`}>
                          {riskAssessment.overall_score}/10
                        </span>
                      </div>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            riskAssessment.overall_score <= 3 ? 'bg-green-500' :
                            riskAssessment.overall_score <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${riskAssessment.overall_score * 10}%` }}
                        />
                      </div>
                    </div>

                    {/* Escalation Level */}
                    <div className={`mt-3 p-2 rounded-lg ${
                      riskAssessment.escalation_level === 'ai_handles' ? 'bg-green-100' :
                      riskAssessment.escalation_level === 'human_review' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {riskAssessment.escalation_level === 'ai_handles' ? '🟢' :
                           riskAssessment.escalation_level === 'human_review' ? '🟡' : '🔴'}
                        </span>
                        <div>
                          <div className={`font-bold text-sm ${
                            riskAssessment.escalation_level === 'ai_handles' ? 'text-green-800' :
                            riskAssessment.escalation_level === 'human_review' ? 'text-yellow-800' : 'text-red-800'
                          }`}>
                            {riskAssessment.escalation_level === 'ai_handles' ? 'AI CAN PROCEED' :
                             riskAssessment.escalation_level === 'human_review' ? 'HUMAN REVIEW' : 'HUMAN REQUIRED'}
                          </div>
                          {riskAssessment.escalation_reason && (
                            <div className="text-xs text-gray-600">{riskAssessment.escalation_reason}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">Enter a task to see risk assessment</p>
                )}
              </div>

              {/* Escalation Legend */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
                <h4 className="font-medium text-gray-700 mb-2">Escalation Levels</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span>🟢</span>
                    <span className="text-gray-600">Score 0-3: AI Handles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🟡</span>
                    <span className="text-gray-600">Score 4-6: Human Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔴</span>
                    <span className="text-gray-600">Score 7-10: Human Required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex gap-3">
            {isExecuting && (
              <button
                onClick={handleStop}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
                STOP & Revoke
              </button>
            )}
            {!isAgentInvalid && !isExecuting && (
              <button
                onClick={handleStop}
                className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 font-medium rounded-lg border border-red-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Revoke License
              </button>
            )}
            <div className="flex-1" />
            <button onClick={onClose} className="btn-secondary">Close</button>
            {!isAgentInvalid && !humanApprovalPending && (
              <button
                onClick={executeTask}
                className="btn-primary flex items-center gap-2"
                disabled={isExecuting || !taskDescription.trim() || !!prohibitedWarning}
              >
                {isExecuting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Executing...
                  </>
                ) : riskAssessment?.escalation_level === 'human_required' ? (
                  <>Request Human Review</>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    Execute
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
