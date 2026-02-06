'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import CreateAgentModal from '@/components/CreateAgentModal';
import AgentCard from '@/components/AgentCard';
import TaskExecutor from '@/components/TaskExecutor';

interface Agent {
  id: string;
  name: string;
  permissions: string[];
  constraints?: string;
  expires_at?: string;
  status: 'active' | 'revoked' | 'expired';
  created_at: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  isDemo?: boolean;
}

interface AuditLog {
  id: number;
  agent_id?: string;
  user_id?: string;
  action: string;
  details?: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showTaskExecutor, setShowTaskExecutor] = useState(false);
  const [activeTab, setActiveTab] = useState<'agents' | 'audit'>('agents');

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch('/api/agent');
      if (res.ok) {
        const data = await res.json();
        setAgents(data.agents);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/audit?limit=100');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user info
        const userRes = await fetch('/api/auth/me');
        if (!userRes.ok) {
          router.push('/');
          return;
        }
        const userData = await userRes.json();
        setUser(userData.user);

        // Fetch agents and audit logs
        await Promise.all([fetchAgents(), fetchAuditLogs()]);
      } catch (error) {
        console.error('Error:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, fetchAgents, fetchAuditLogs]);

  const handleReset = async () => {
    if (!confirm('Reset all demo data? This will remove all agents and audit logs.')) return;
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        setAgents([]);
        setAuditLogs([]);
        setSelectedAgent(null);
        setShowTaskExecutor(false);
      }
    } catch (error) {
      console.error('Error resetting demo:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/demo', { method: 'DELETE' });
      window.location.href = '/api/auth/logout';
    } catch {
      window.location.href = '/';
    }
  };

  const handleAgentCreated = (agent: Agent) => {
    setAgents(prev => [agent, ...prev]);
    setShowCreateModal(false);
    // Refresh audit logs to show the creation
    fetchAuditLogs();
  };

  const handleRevokeAgent = async (agentId: string): Promise<void> => {
    try {
      const res = await fetch(`/api/revoke/${agentId}`, { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        // Immediately update local state for instant UI feedback
        setAgents(prev =>
          prev.map(a =>
            a.id === agentId ? { ...a, status: 'revoked' as const } : a
          )
        );
        // If the revoked agent is currently selected, close the task executor
        if (selectedAgent?.id === agentId) {
          setShowTaskExecutor(false);
          setSelectedAgent(null);
        }
        // Refresh audit logs to show the revocation
        fetchAuditLogs();
      } else {
        // Show friendly error message instead of crashing
        const errorMsg = data.error || 'Failed to revoke agent';
        alert(errorMsg);
        // If agent is already revoked, update local state to match
        if (errorMsg.includes('already')) {
          setAgents(prev =>
            prev.map(a =>
              a.id === agentId ? { ...a, status: 'revoked' as const } : a
            )
          );
        }
      }
    } catch (error) {
      console.error('Error revoking agent:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleExecuteTask = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowTaskExecutor(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="AIoOS Logo"
                width={40}
                height={40}
              />
              <div>
                <h1 className="text-xl font-bold text-black">AIoOS Dashboard</h1>
                <p className="text-sm text-gray-700">
                  Welcome, {user?.name}
                  {user?.isDemo && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                      Demo Mode
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/demo"
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 rounded-lg flex items-center gap-1.5 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Demo Tour
              </Link>
              <Link
                href="/butler"
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-1 transition-colors text-sm"
              >
                <span>🎩</span>
                Butler
              </Link>
              <Link
                href="/licensing"
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-1 transition-colors text-sm"
              >
                <span>📜</span>
                Licensing
              </Link>
              <Link
                href="/lifecycle"
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-1 transition-colors text-sm"
              >
                <span>🔄</span>
                PTAS
              </Link>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 rounded-lg flex items-center gap-1.5 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Agent
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg flex items-center gap-1.5 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* Demo Tour Banner */}
        <Link href="/demo" className="block mb-6">
          <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 rounded-2xl p-6 text-white hover:from-gray-800 hover:via-purple-800 hover:to-blue-800 transition-all cursor-pointer border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-3xl">
                  🎬
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">Interactive Demo Tour</h2>
                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                      Hackathon
                    </span>
                  </div>
                  <p className="text-gray-300">
                    Experience all 3 patented innovations in a guided walkthrough
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-purple-300">
                <span>Start Tour</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Demo Banners */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Butler Agent Banner */}
          <Link href="/butler" className="block">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-5 text-white hover:from-purple-700 hover:to-blue-700 transition-all cursor-pointer h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                  🎩
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-base font-bold">Butler Agent</h2>
                    <span className="px-2 py-0.5 bg-white/20 text-xs rounded-full">P1</span>
                  </div>
                  <p className="text-purple-100 text-xs">
                    Agent discovery & task execution
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 text-xs text-purple-200">
                <span className="px-2 py-0.5 bg-white/10 rounded">🔍 Discovery</span>
                <span className="px-2 py-0.5 bg-white/10 rounded">🤖 5 Agents</span>
              </div>
            </div>
          </Link>

          {/* Licensing Demo Banner */}
          <Link href="/licensing" className="block">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                  📜
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-base font-bold">Licensing</h2>
                    <span className="px-2 py-0.5 bg-white/20 text-xs rounded-full">P2</span>
                  </div>
                  <p className="text-blue-100 text-xs">
                    Three-phase licensing pathway
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 text-xs text-blue-200">
                <span className="px-2 py-0.5 bg-white/10 rounded">📚 Certification</span>
                <span className="px-2 py-0.5 bg-white/10 rounded">👨‍🏫 Apprentice</span>
              </div>
            </div>
          </Link>

          {/* PTAS Demo Banner */}
          <Link href="/lifecycle" className="block">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-5 text-white hover:from-green-700 hover:to-teal-700 transition-all cursor-pointer h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                  🔄
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-base font-bold">PTAS Demo</h2>
                    <span className="px-2 py-0.5 bg-white/20 text-xs rounded-full">P3</span>
                  </div>
                  <p className="text-green-100 text-xs">
                    5-state lifecycle & scheduling
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 text-xs text-green-200">
                <span className="px-2 py-0.5 bg-white/10 rounded">⚡ Lifecycle</span>
                <span className="px-2 py-0.5 bg-white/10 rounded">💰 Billing</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'agents'
                ? 'border-black text-black'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Agents ({agents.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'audit'
                ? 'border-black text-black'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Audit Log ({auditLogs.length})
            </span>
          </button>
        </div>

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <>
            {agents.length === 0 ? (
              <div className="card text-center py-16">
                <div className="text-6xl mb-4">🤖</div>
                <h2 className="text-2xl font-semibold text-black mb-2">No Agents Yet</h2>
                <p className="text-gray-700 mb-6">
                  Create your first AI agent to get started with delegated task execution.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary"
                >
                  Create Your First Agent
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map(agent => (
                  <AgentCard
                    key={`${agent.id}-${agent.status}`}
                    agent={agent}
                    userEmail={user?.email}
                    onRevoke={handleRevokeAgent}
                    onExecute={handleExecuteTask}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Audit Log Tab */}
        {activeTab === 'audit' && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black">Activity Log</h2>
              <button
                onClick={fetchAuditLogs}
                className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            {auditLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>No activity recorded yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Timestamp</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Agent</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Action</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => {
                      const agent = agents.find(a => a.id === log.agent_id);
                      const actionColors: Record<string, string> = {
                        agent_created: 'bg-green-100 text-green-700',
                        agent_revoked: 'bg-red-100 text-red-700',
                        task_started: 'bg-blue-100 text-blue-700',
                        task_completed: 'bg-green-100 text-green-700',
                        task_failed: 'bg-red-100 text-red-700',
                        task_aborted: 'bg-yellow-100 text-yellow-700',
                        delegation_verified: 'bg-purple-100 text-purple-700',
                      };
                      const colorClass = actionColors[log.action] || 'bg-gray-100 text-gray-700';

                      return (
                        <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-3 font-mono text-xs text-gray-600">
                            {new Date(log.created_at).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </td>
                          <td className="py-2 px-3">
                            {agent ? (
                              <span className="font-medium text-gray-800">{agent.name}</span>
                            ) : log.agent_id ? (
                              <span className="font-mono text-xs text-gray-500">{log.agent_id.slice(0, 8)}...</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${colorClass}`}>
                              {log.action.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-gray-700 max-w-xs truncate" title={log.details || ''}>
                            {log.details || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Agent Modal */}
      {showCreateModal && (
        <CreateAgentModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleAgentCreated}
        />
      )}

      {/* Task Executor Modal */}
      {showTaskExecutor && selectedAgent && (
        <TaskExecutor
          agent={selectedAgent}
          onClose={() => {
            setShowTaskExecutor(false);
            setSelectedAgent(null);
          }}
          onAgentRevoked={() => {
            handleRevokeAgent(selectedAgent.id);
          }}
        />
      )}
    </div>
  );
}
