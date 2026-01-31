'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Agent with full PTAS properties
interface PTASAgent {
  id: string;
  name: string;
  vertical: string;
  state: 'DORMANT' | 'ACTIVATING' | 'ACTIVE' | 'EXECUTING' | 'HIBERNATING';
  resources: {
    cpu: number;
    memory: number;
    contextLoaded: boolean;
  };
  capabilityWindow: {
    state: 'RESERVED' | 'OPEN' | 'PAUSED' | 'EXHAUSTED' | 'CLOSED';
    timeRemaining: number; // seconds
    totalTime: number;
  };
  billing: {
    activeSeconds: number;
    cost: number;
    tier: 'Basic' | 'Standard' | 'Premium';
  };
  taskQueue: string[];
  currentTask: string | null;
}

const initialAgents: PTASAgent[] = [
  {
    id: 'agent-re-042',
    name: 'Real Estate Pro',
    vertical: 'Real Estate',
    state: 'DORMANT',
    resources: { cpu: 0, memory: 5, contextLoaded: false },
    capabilityWindow: { state: 'CLOSED', timeRemaining: 0, totalTime: 1800 },
    billing: { activeSeconds: 0, cost: 0, tier: 'Standard' },
    taskQueue: [],
    currentTask: null,
  },
  {
    id: 'agent-legal-156',
    name: 'Contract Analyzer',
    vertical: 'Legal',
    state: 'DORMANT',
    resources: { cpu: 0, memory: 5, contextLoaded: false },
    capabilityWindow: { state: 'CLOSED', timeRemaining: 0, totalTime: 1800 },
    billing: { activeSeconds: 0, cost: 0, tier: 'Premium' },
    taskQueue: [],
    currentTask: null,
  },
  {
    id: 'agent-fin-089',
    name: 'Financial Advisor',
    vertical: 'Financial',
    state: 'DORMANT',
    resources: { cpu: 0, memory: 5, contextLoaded: false },
    capabilityWindow: { state: 'CLOSED', timeRemaining: 0, totalTime: 1800 },
    billing: { activeSeconds: 0, cost: 0, tier: 'Premium' },
    taskQueue: [],
    currentTask: null,
  },
  {
    id: 'agent-tech-201',
    name: 'Code Assistant',
    vertical: 'Technical',
    state: 'ACTIVE',
    resources: { cpu: 35, memory: 45, contextLoaded: true },
    capabilityWindow: { state: 'OPEN', timeRemaining: 1200, totalTime: 1800 },
    billing: { activeSeconds: 423, cost: 0.42, tier: 'Standard' },
    taskQueue: ['Debug API endpoint', 'Write unit tests'],
    currentTask: 'Review pull request',
  },
  {
    id: 'agent-health-077',
    name: 'Health Advisor',
    vertical: 'Healthcare',
    state: 'HIBERNATING',
    resources: { cpu: 0, memory: 2, contextLoaded: false },
    capabilityWindow: { state: 'CLOSED', timeRemaining: 0, totalTime: 1800 },
    billing: { activeSeconds: 156, cost: 0.08, tier: 'Basic' },
    taskQueue: [],
    currentTask: null,
  },
];

const stateConfig = {
  DORMANT: {
    color: 'bg-gray-500',
    textColor: 'text-gray-300',
    borderColor: 'border-gray-500',
    icon: '💤',
    resourceUsage: '<5%',
    description: 'Minimal footprint, context unloaded'
  },
  ACTIVATING: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-300',
    borderColor: 'border-yellow-500',
    icon: '⚡',
    resourceUsage: '100-500ms',
    description: 'Loading context, allocating resources'
  },
  ACTIVE: {
    color: 'bg-green-500',
    textColor: 'text-green-300',
    borderColor: 'border-green-500',
    icon: '🟢',
    resourceUsage: '100%',
    description: 'Ready to accept tasks'
  },
  EXECUTING: {
    color: 'bg-blue-500',
    textColor: 'text-blue-300',
    borderColor: 'border-blue-500',
    icon: '🔄',
    resourceUsage: 'Task-bound',
    description: 'Processing task, full resources'
  },
  HIBERNATING: {
    color: 'bg-purple-500',
    textColor: 'text-purple-300',
    borderColor: 'border-purple-500',
    icon: '🧊',
    resourceUsage: '~0%',
    description: 'Deep sleep, instant wake on demand'
  },
};

const windowStateConfig = {
  RESERVED: { color: 'bg-yellow-600', icon: '📋' },
  OPEN: { color: 'bg-green-600', icon: '🟢' },
  PAUSED: { color: 'bg-orange-600', icon: '⏸️' },
  EXHAUSTED: { color: 'bg-red-600', icon: '⚠️' },
  CLOSED: { color: 'bg-gray-600', icon: '🔒' },
};

const tierPricing = {
  Basic: 0.0005,
  Standard: 0.001,
  Premium: 0.002,
};

export default function LifecyclePage() {
  const [agents, setAgents] = useState<PTASAgent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<PTASAgent | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [logs, setLogs] = useState<{ time: Date; message: string; type: string }[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: string = 'info') => {
    setLogs(prev => [...prev.slice(-50), { time: new Date(), message, type }]);
  };

  // Simulation tick
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        const updated = { ...agent };

        // Update active/executing agents
        if (agent.state === 'ACTIVE' || agent.state === 'EXECUTING') {
          // Decrement capability window
          if (updated.capabilityWindow.state === 'OPEN' && updated.capabilityWindow.timeRemaining > 0) {
            updated.capabilityWindow = {
              ...updated.capabilityWindow,
              timeRemaining: updated.capabilityWindow.timeRemaining - simulationSpeed,
            };

            // Update billing
            updated.billing = {
              ...updated.billing,
              activeSeconds: updated.billing.activeSeconds + simulationSpeed,
              cost: (updated.billing.activeSeconds + simulationSpeed) * tierPricing[updated.billing.tier],
            };

            // Check if window exhausted
            if (updated.capabilityWindow.timeRemaining <= 0) {
              updated.capabilityWindow.state = 'EXHAUSTED';
              addLog(`${agent.name}: Capability Window EXHAUSTED`, 'warning');
            }
          }

          // Simulate resource fluctuation
          if (agent.state === 'EXECUTING') {
            updated.resources = {
              ...updated.resources,
              cpu: Math.min(100, Math.max(60, agent.resources.cpu + (Math.random() - 0.5) * 20)),
              memory: Math.min(100, Math.max(40, agent.resources.memory + (Math.random() - 0.5) * 10)),
            };
          }
        }

        return updated;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const activateAgent = async (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent || agent.state === 'ACTIVE' || agent.state === 'EXECUTING') return;

    addLog(`${agent.name}: Starting activation sequence...`, 'info');

    // DORMANT/HIBERNATING -> ACTIVATING
    setAgents(prev => prev.map(a =>
      a.id === agentId
        ? {
            ...a,
            state: 'ACTIVATING' as const,
            resources: { cpu: 50, memory: 30, contextLoaded: false },
          }
        : a
    ));
    addLog(`${agent.name}: DORMANT → ACTIVATING`, 'transition');

    await sleep(300 / simulationSpeed);

    // Loading context
    setAgents(prev => prev.map(a =>
      a.id === agentId
        ? { ...a, resources: { cpu: 80, memory: 60, contextLoaded: false } }
        : a
    ));
    addLog(`${agent.name}: Loading context...`, 'info');

    await sleep(200 / simulationSpeed);

    // ACTIVATING -> ACTIVE
    setAgents(prev => prev.map(a =>
      a.id === agentId
        ? {
            ...a,
            state: 'ACTIVE' as const,
            resources: { cpu: 30, memory: 45, contextLoaded: true },
            capabilityWindow: { state: 'OPEN' as const, timeRemaining: 1800, totalTime: 1800 },
          }
        : a
    ));
    addLog(`${agent.name}: ACTIVATING → ACTIVE (180ms)`, 'transition');
    addLog(`${agent.name}: Capability Window OPENED (30 min)`, 'window');
  };

  const executeTask = async (agentId: string, task: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent || agent.state !== 'ACTIVE') {
      if (agent?.state === 'DORMANT' || agent?.state === 'HIBERNATING') {
        await activateAgent(agentId);
      } else {
        return;
      }
    }

    addLog(`${agent?.name || 'Agent'}: Task received - "${task}"`, 'task');

    // ACTIVE -> EXECUTING
    setAgents(prev => prev.map(a =>
      a.id === agentId
        ? {
            ...a,
            state: 'EXECUTING' as const,
            resources: { cpu: 85, memory: 70, contextLoaded: true },
            currentTask: task,
          }
        : a
    ));
    addLog(`${agent?.name || 'Agent'}: ACTIVE → EXECUTING`, 'transition');

    // Simulate task execution
    await sleep(3000 / simulationSpeed);

    // Task complete, return to ACTIVE
    setAgents(prev => prev.map(a =>
      a.id === agentId
        ? {
            ...a,
            state: 'ACTIVE' as const,
            resources: { cpu: 30, memory: 45, contextLoaded: true },
            currentTask: null,
          }
        : a
    ));
    addLog(`${agent?.name || 'Agent'}: Task completed`, 'success');
    addLog(`${agent?.name || 'Agent'}: EXECUTING → ACTIVE`, 'transition');
  };

  const hibernateAgent = async (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent || agent.state === 'DORMANT' || agent.state === 'HIBERNATING') return;

    addLog(`${agent.name}: Initiating hibernation...`, 'info');

    // Close capability window
    setAgents(prev => prev.map(a =>
      a.id === agentId
        ? {
            ...a,
            state: 'HIBERNATING' as const,
            resources: { cpu: 0, memory: 2, contextLoaded: false },
            capabilityWindow: { ...a.capabilityWindow, state: 'CLOSED' as const },
            currentTask: null,
          }
        : a
    ));
    addLog(`${agent.name}: ACTIVE → HIBERNATING`, 'transition');
    addLog(`${agent.name}: Capability Window CLOSED`, 'window');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="AIoOS Logo" width={32} height={32} />
              <span className="text-lg font-bold">AIoOS</span>
              <span className="px-2 py-0.5 bg-green-600 text-xs rounded-full">Patent 3: PTAS</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/butler" className="text-sm text-gray-400 hover:text-white">
                Butler Agent
              </Link>
              <Link href="/architecture" className="text-sm text-gray-400 hover:text-white">
                Architecture
              </Link>
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Part-Time Agent System (PTAS)</h1>
          <p className="text-gray-400">Interactive visualization of the 5-state lifecycle, time-slice scheduling, and capability windows</p>
        </div>

        {/* Simulation Controls */}
        <div className="mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isSimulating
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isSimulating ? '⏹ Stop Simulation' : '▶ Start Simulation'}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Speed:</span>
                <select
                  value={simulationSpeed}
                  onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={5}>5x</option>
                  <option value={10}>10x</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-gray-400">Active: {agents.filter(a => a.state === 'ACTIVE' || a.state === 'EXECUTING').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                <span className="text-gray-400">Dormant: {agents.filter(a => a.state === 'DORMANT').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                <span className="text-gray-400">Hibernating: {agents.filter(a => a.state === 'HIBERNATING').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5-State Lifecycle Diagram */}
        <div className="mb-6 p-6 bg-gray-800 rounded-xl border border-gray-700">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🔄</span> 5-State Lifecycle
          </h2>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {(['DORMANT', 'ACTIVATING', 'ACTIVE', 'EXECUTING', 'HIBERNATING'] as const).map((state, i) => {
              const config = stateConfig[state];
              const count = agents.filter(a => a.state === state).length;
              return (
                <div key={state} className="flex items-center gap-4">
                  <div className={`relative p-4 rounded-xl border-2 ${config.borderColor} bg-gray-900 min-w-[140px]`}>
                    <div className="text-center">
                      <div className="text-3xl mb-2">{config.icon}</div>
                      <div className={`font-bold ${config.textColor}`}>{state}</div>
                      <div className="text-xs text-gray-500 mt-1">{config.resourceUsage}</div>
                      {count > 0 && (
                        <div className={`absolute -top-2 -right-2 w-6 h-6 ${config.color} rounded-full flex items-center justify-center text-xs font-bold`}>
                          {count}
                        </div>
                      )}
                    </div>
                  </div>
                  {i < 4 && (
                    <div className="text-gray-500 text-2xl">→</div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            DORMANT → ACTIVATING: On-demand activation | ACTIVE ↔ EXECUTING: Task processing | ACTIVE → HIBERNATING: Resource conservation
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Agent Cards */}
          <div className="col-span-2 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span>🤖</span> Agent Pool ({agents.length} agents)
            </h2>

            {agents.map(agent => {
              const stateConf = stateConfig[agent.state];
              const windowConf = windowStateConfig[agent.capabilityWindow.state];

              return (
                <div
                  key={agent.id}
                  className={`p-4 bg-gray-800 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedAgent?.id === agent.id ? 'border-blue-500' : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${stateConf.color} rounded-xl flex items-center justify-center text-2xl`}>
                        {stateConf.icon}
                      </div>
                      <div>
                        <h3 className="font-bold">{agent.name}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">{agent.vertical}</span>
                          <span className={`px-2 py-0.5 ${stateConf.color} rounded text-xs`}>{agent.state}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {(agent.state === 'DORMANT' || agent.state === 'HIBERNATING') && (
                        <button
                          onClick={(e) => { e.stopPropagation(); activateAgent(agent.id); }}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                        >
                          Activate
                        </button>
                      )}
                      {agent.state === 'ACTIVE' && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); executeTask(agent.id, 'Sample task ' + Date.now()); }}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                          >
                            Execute Task
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); hibernateAgent(agent.id); }}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                          >
                            Hibernate
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Resource Meters */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">CPU</span>
                        <span className={agent.resources.cpu > 80 ? 'text-red-400' : 'text-gray-300'}>{Math.round(agent.resources.cpu)}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            agent.resources.cpu > 80 ? 'bg-red-500' :
                            agent.resources.cpu > 50 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${agent.resources.cpu}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Memory</span>
                        <span className={agent.resources.memory > 80 ? 'text-red-400' : 'text-gray-300'}>{Math.round(agent.resources.memory)}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            agent.resources.memory > 80 ? 'bg-red-500' :
                            agent.resources.memory > 50 ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${agent.resources.memory}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Capability Window & Billing */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 ${windowConf.color} rounded text-xs`}>
                          {windowConf.icon} {agent.capabilityWindow.state}
                        </span>
                        {agent.capabilityWindow.state === 'OPEN' && (
                          <span className="text-gray-400 font-mono">
                            {formatTime(Math.max(0, Math.floor(agent.capabilityWindow.timeRemaining)))}
                          </span>
                        )}
                      </div>
                      {agent.currentTask && (
                        <span className="text-blue-400 truncate max-w-[200px]">
                          🔄 {agent.currentTask}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">{agent.billing.tier}</span>
                      <span className="font-mono">${agent.billing.cost.toFixed(4)}</span>
                    </div>
                  </div>

                  {/* Capability Window Progress */}
                  {agent.capabilityWindow.state === 'OPEN' && (
                    <div className="mt-3">
                      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all duration-1000"
                          style={{
                            width: `${(agent.capabilityWindow.timeRemaining / agent.capabilityWindow.totalTime) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Time-Slice Scheduling */}
            <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span>⏱️</span> Time-Slice Scheduling
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Context Switch</span>
                  <span className="text-green-400">&lt;50ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Quantum</span>
                  <span className="text-blue-400">100ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Concurrent</span>
                  <span className="text-purple-400">1000 agents</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Scheduler</span>
                  <span className="text-yellow-400">Priority Queue</span>
                </div>
              </div>

              {/* Visual Time Slices */}
              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-2">Active Time Slices:</div>
                <div className="flex gap-1">
                  {agents.filter(a => a.state === 'ACTIVE' || a.state === 'EXECUTING').map(a => (
                    <div
                      key={a.id}
                      className={`flex-1 h-6 ${a.state === 'EXECUTING' ? 'bg-blue-500' : 'bg-green-500'} rounded flex items-center justify-center text-xs truncate px-1`}
                      title={a.name}
                    >
                      {a.name.split(' ')[0]}
                    </div>
                  ))}
                  {agents.filter(a => a.state === 'ACTIVE' || a.state === 'EXECUTING').length === 0 && (
                    <div className="flex-1 h-6 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">
                      No active agents
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Capability Window States */}
            <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span>🪟</span> Capability Window
              </h3>
              <div className="space-y-2">
                {Object.entries(windowStateConfig).map(([state, config]) => (
                  <div key={state} className="flex items-center gap-2 text-sm">
                    <span className={`w-6 h-6 ${config.color} rounded flex items-center justify-center text-xs`}>
                      {config.icon}
                    </span>
                    <span className="text-gray-300">{state}</span>
                    <span className="text-gray-500 text-xs ml-auto">
                      {agents.filter(a => a.capabilityWindow.state === state).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage-Based Billing */}
            <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span>💰</span> Usage-Based Billing
              </h3>
              <div className="space-y-3">
                {Object.entries(tierPricing).map(([tier, price]) => (
                  <div key={tier} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{tier}</span>
                    <span className="text-gray-400 font-mono">${price}/sec</span>
                  </div>
                ))}
                <div className="border-t border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Active Time</span>
                    <span className="font-mono">{agents.reduce((sum, a) => sum + a.billing.activeSeconds, 0)}s</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-400">Total Cost</span>
                    <span className="font-mono text-green-400">${agents.reduce((sum, a) => sum + a.billing.cost, 0).toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Log */}
            <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span>📋</span> Event Log
              </h3>
              <div className="h-48 overflow-y-auto space-y-1 text-xs font-mono">
                {logs.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">
                    Start simulation to see events
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className={`py-1 ${
                      log.type === 'transition' ? 'text-yellow-400' :
                      log.type === 'success' ? 'text-green-400' :
                      log.type === 'warning' ? 'text-red-400' :
                      log.type === 'window' ? 'text-purple-400' :
                      log.type === 'task' ? 'text-blue-400' :
                      'text-gray-400'
                    }`}>
                      <span className="text-gray-600">{log.time.toLocaleTimeString()}</span> {log.message}
                    </div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
