'use client';

import { useState, useEffect } from 'react';

interface AgentLicense {
  license_type: string;
  jurisdiction: string[];
  permission_level: 'advisory_only' | 'execute_with_human' | 'autonomous';
  permitted_actions: string[];
  prohibited_actions: string[];
  insurance_policy_id: string;
}

interface AgentReputation {
  tasks_completed: number;
  success_rate: number;
  avg_response_time: number;
  user_rating: number;
  trust_score: number;
}

interface Agent {
  id: string;
  name: string;
  permissions: string[];
  constraints?: string;
  expires_at?: string;
  status: 'active' | 'revoked' | 'expired';
  created_at: string;
  license?: AgentLicense;
  reputation?: AgentReputation;
}

interface AgentCardProps {
  agent: Agent;
  userEmail?: string;
  onRevoke: (agentId: string) => Promise<void>;
  onExecute: (agent: Agent) => void;
}

const PERMISSION_LABELS: Record<string, string> = {
  text_generation: 'Text',
  code_generation: 'Code',
  data_analysis: 'Data',
  translation: 'Translation',
  summarization: 'Summary',
};

const PERMISSION_LEVEL_CONFIG = {
  advisory_only: { emoji: '🟢', label: 'Advisory Only', color: 'green' },
  execute_with_human: { emoji: '🟡', label: 'Execute + Human', color: 'yellow' },
  autonomous: { emoji: '🔴', label: 'Autonomous', color: 'red' },
};

export default function AgentCard({ agent, userEmail, onRevoke, onExecute }: AgentCardProps) {
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [countdown, setCountdown] = useState<string>('');
  const [showLicense, setShowLicense] = useState(false);

  const isActive = agent.status === 'active';

  // Real-time countdown timer
  useEffect(() => {
    if (!agent.expires_at || agent.status !== 'active') {
      setCountdown('');
      return;
    }

    const updateCountdown = () => {
      const expiry = new Date(agent.expires_at!);
      const now = new Date();
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown('Expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setCountdown(`${days}d ${hours % 24}h`);
      } else if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setCountdown(`${minutes}m ${seconds}s`);
      } else {
        setCountdown(`${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [agent.expires_at, agent.status]);

  const handleRevoke = async () => {
    setIsRevoking(true);
    await onRevoke(agent.id);
    // Always reset local state - parent will update agent status
    setIsRevoking(false);
    setShowRevokeConfirm(false);
  };

  const getStatusBadge = () => {
    switch (agent.status) {
      case 'active':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Active
          </span>
        );
      case 'revoked':
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
            Revoked
          </span>
        );
      case 'expired':
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
            Expired
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getExpiryText = () => {
    if (!agent.expires_at) return 'Never expires';
    const expiry = new Date(agent.expires_at);
    const now = new Date();
    if (expiry < now) return 'Expired';

    const diff = expiry.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `Expires in ${days}d`;
    }
    if (hours > 0) {
      return `Expires in ${hours}h ${minutes}m`;
    }
    return `Expires in ${minutes}m`;
  };

  const permLevel = agent.license?.permission_level || 'execute_with_human';
  const levelConfig = PERMISSION_LEVEL_CONFIG[permLevel];

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <span className="text-yellow-500">
        {'★'.repeat(fullStars)}
        {hasHalf && '½'}
        {'☆'.repeat(5 - fullStars - (hasHalf ? 1 : 0))}
      </span>
    );
  };

  return (
    <div className={`card relative overflow-hidden ${!isActive ? 'opacity-60' : ''}`}>
      {/* Status indicator line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isActive
            ? 'bg-green-500'
            : agent.status === 'revoked'
              ? 'bg-red-500'
              : 'bg-yellow-500'
        }`}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-3 pt-2">
        <div>
          <h3 className="text-lg font-semibold text-black">{agent.name}</h3>
          <p className="text-xs text-gray-600">{formatDate(agent.created_at)}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {getStatusBadge()}
          {agent.license && (
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              levelConfig.color === 'green' ? 'bg-green-100 text-green-700' :
              levelConfig.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {levelConfig.emoji} {levelConfig.label}
            </span>
          )}
        </div>
      </div>

      {/* Agent Identity (DID) */}
      <div className="mb-3 p-2 bg-gray-900 rounded-lg font-mono text-xs">
        <div className="flex items-center gap-2 text-green-400">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <span>did:aioos:agent:{agent.id.slice(0, 8)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 mt-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Delegated by: {userEmail || 'Unknown'}</span>
        </div>
      </div>

      {/* License Info (Collapsible) */}
      {agent.license && (
        <div className="mb-3">
          <button
            onClick={() => setShowLicense(!showLicense)}
            className="w-full flex items-center justify-between p-2 bg-blue-50 rounded-lg text-sm hover:bg-blue-100 transition-colors"
          >
            <span className="flex items-center gap-2 font-medium text-blue-800">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              {agent.license.license_type}
            </span>
            <svg className={`w-4 h-4 text-blue-600 transition-transform ${showLicense ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showLicense && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs space-y-2">
              <div>
                <span className="text-gray-500">Jurisdiction:</span>
                <span className="ml-2 text-gray-800">{agent.license.jurisdiction.join(', ')}</span>
              </div>
              <div>
                <span className="text-gray-500">Insurance:</span>
                <span className="ml-2 font-mono text-gray-800">{agent.license.insurance_policy_id}</span>
              </div>
              <div>
                <span className="text-gray-500">Permitted:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {agent.license.permitted_actions.map(a => (
                    <span key={a} className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                      {a.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Prohibited:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {agent.license.prohibited_actions.map(a => (
                    <span key={a} className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                      {a.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reputation Metrics */}
      {agent.reputation && (
        <div className="mb-3 p-2 bg-purple-50 rounded-lg">
          <div className="text-xs font-medium text-purple-800 mb-2 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            REPUTATION
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Tasks:</span>
              <span className="font-medium text-gray-800">{agent.reputation.tasks_completed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success:</span>
              <span className="font-medium text-gray-800">{agent.reputation.success_rate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Time:</span>
              <span className="font-medium text-gray-800">{agent.reputation.avg_response_time}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rating:</span>
              <span className="font-medium">{renderStars(agent.reputation.user_rating)}</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Trust Score</span>
              <span className="text-sm font-bold text-purple-700">{agent.reputation.trust_score}/100</span>
            </div>
            <div className="mt-1 h-2 bg-purple-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all"
                style={{ width: `${agent.reputation.trust_score}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Expiry with countdown */}
      <div className="mb-3">
        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">License Validity</p>
        {agent.expires_at && isActive && countdown && countdown !== 'Expired' ? (
          <div className="flex items-center gap-2">
            <span className={`font-mono text-sm font-medium ${
              countdown.includes('s') && !countdown.includes('h') && !countdown.includes('d')
                ? 'text-red-600 animate-pulse'
                : countdown.includes('m') && !countdown.includes('h') && !countdown.includes('d')
                  ? 'text-yellow-600'
                  : 'text-gray-800'
            }`}>
              {countdown}
            </span>
            <svg className="w-4 h-4 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        ) : (
          <p className="text-sm text-gray-800">{getExpiryText()}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        {isActive ? (
          <>
            <button
              onClick={() => onExecute(agent)}
              className="flex-1 px-3 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Execute
            </button>

            {showRevokeConfirm ? (
              <div className="flex gap-1">
                <button
                  onClick={handleRevoke}
                  disabled={isRevoking}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                >
                  {isRevoking ? (
                    <>
                      <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      ...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
                <button
                  onClick={() => setShowRevokeConfirm(false)}
                  disabled={isRevoking}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowRevokeConfirm(true)}
                className="px-3 py-2 bg-white hover:bg-gray-50 text-red-600 text-sm font-medium rounded-lg transition-colors border border-red-200 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Revoke
              </button>
            )}
          </>
        ) : (
          <div className="flex-1 px-3 py-2 bg-gray-50 text-gray-800 text-sm font-medium rounded-lg text-center">
            {agent.status === 'revoked' ? (
              <span className="flex items-center justify-center gap-1.5 text-red-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                LICENSE REVOKED
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5 text-yellow-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                LICENSE EXPIRED
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
