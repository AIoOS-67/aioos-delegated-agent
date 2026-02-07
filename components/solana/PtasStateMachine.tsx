// AIoOS PTAS State Machine - Interactive On-Chain Lifecycle
// AI-Generated for Colosseum Agent Hackathon 2026
// Patent 3: Part-Time Agent System 5-state lifecycle on Solana

'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useUpdatePtasState, useLicenseAccount } from '@/lib/solana/hooks';
import { TxLink } from './TxLink';
import type { PtasState } from '@/lib/solana/constants';

interface PtasStateMachineProps {
  agentId: string | null;
  onStateChange?: (newState: string, txSig: string) => void;
}

const STATE_CONFIG: Record<string, { color: string; bg: string; border: string; icon: string; desc: string }> = {
  Dormant: { color: 'text-gray-400', bg: 'bg-gray-800', border: 'border-gray-600', icon: '💤', desc: 'Low-power idle' },
  Activating: { color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-600', icon: '⚡', desc: 'Warming up' },
  Active: { color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-600', icon: '✅', desc: 'Ready to execute' },
  Executing: { color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-600', icon: '🔄', desc: 'Processing task' },
  Hibernating: { color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-600', icon: '🌙', desc: 'Extended sleep' },
  Revoked: { color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-600', icon: '🚫', desc: 'Terminated' },
};

// Valid transitions for the UI buttons
const TRANSITIONS: Record<string, PtasState[]> = {
  Dormant: ['Activating'],
  Activating: ['Active'],
  Active: ['Executing', 'Hibernating'],
  Executing: ['Active'],
  Hibernating: ['Activating'],
  Revoked: [],
};

export default function PtasStateMachine({ agentId, onStateChange }: PtasStateMachineProps) {
  const { connected } = useWallet();
  const { updateState, loading } = useUpdatePtasState();
  const { data: licenseData, refetch } = useLicenseAccount(agentId);
  const [txHistory, setTxHistory] = useState<Array<{ from: string; to: string; sig: string }>>([]);

  // Determine current state from on-chain data or default to Dormant
  const currentState = licenseData
    ? Object.keys(licenseData.ptasState || {})[0] || 'Dormant'
    : 'Dormant';

  const config = STATE_CONFIG[currentState] || STATE_CONFIG.Dormant;
  const availableTransitions = TRANSITIONS[currentState] || [];

  const handleTransition = useCallback(async (newState: PtasState) => {
    if (!agentId) return;

    const result = await updateState(agentId, newState);
    if (result.success) {
      setTxHistory(prev => [...prev, { from: currentState, to: newState, sig: result.signature }]);
      onStateChange?.(newState, result.signature);
      // Refetch on-chain data after state change
      setTimeout(() => refetch(), 1500);
    }
  }, [agentId, updateState, currentState, onStateChange, refetch]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20 rounded-xl flex items-center justify-center">
          <span className="text-[#14F195] text-lg font-bold">2</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">PTAS Lifecycle</h3>
          <p className="text-sm text-gray-400">On-chain state machine transitions</p>
        </div>
      </div>

      {!agentId ? (
        <div className="text-center py-8 text-gray-500">
          <p>Mint a license first to manage PTAS state</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Current State Display */}
          <div className={`p-4 rounded-xl border ${config.border} ${config.bg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <div className={`text-lg font-bold ${config.color}`}>{currentState}</div>
                  <div className="text-xs text-gray-400">{config.desc}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 font-mono">Agent: {agentId}</div>
            </div>
          </div>

          {/* State Diagram (visual) */}
          <div className="grid grid-cols-6 gap-1">
            {Object.entries(STATE_CONFIG).map(([state, cfg]) => (
              <div
                key={state}
                className={`p-2 rounded-lg text-center transition-all ${
                  state === currentState
                    ? `${cfg.bg} ${cfg.border} border-2 scale-105`
                    : 'bg-gray-800/50 border border-gray-800 opacity-50'
                }`}
              >
                <div className="text-lg">{cfg.icon}</div>
                <div className={`text-xs font-medium ${state === currentState ? cfg.color : 'text-gray-500'}`}>
                  {state}
                </div>
              </div>
            ))}
          </div>

          {/* Transition Buttons */}
          {availableTransitions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Available Transitions</label>
              <div className="flex gap-2">
                {availableTransitions.map(nextState => {
                  const nextConfig = STATE_CONFIG[nextState];
                  return (
                    <button
                      key={nextState}
                      onClick={() => handleTransition(nextState)}
                      disabled={loading || !connected}
                      className={`flex-1 py-3 rounded-xl border font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] ${nextConfig.border} ${nextConfig.bg} ${nextConfig.color}`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Transitioning...
                        </span>
                      ) : (
                        <>
                          {nextConfig.icon} {currentState} → {nextState}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentState === 'Revoked' && (
            <div className="text-center py-4 text-red-400 text-sm">
              License has been revoked. No further transitions possible.
            </div>
          )}

          {/* Transaction History */}
          {txHistory.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">State Transition History</label>
              <div className="space-y-1.5">
                {txHistory.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-gray-800/50 rounded-lg px-3 py-2">
                    <span className="text-gray-400">
                      {STATE_CONFIG[tx.from]?.icon} {tx.from} → {STATE_CONFIG[tx.to]?.icon} {tx.to}
                    </span>
                    <TxLink signature={tx.sig} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
