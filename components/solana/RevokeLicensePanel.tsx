// AIoOS Revoke License Panel - Emergency Capability Verification Protocol
// AI-Generated for Colosseum Agent Hackathon 2026
// ECVP: Immediate on-chain license revocation (terminal state)

'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRevokeLicense } from '@/lib/solana/hooks';
import { TxLink } from './TxLink';

interface RevokeLicensePanelProps {
  agentId: string | null;
  currentState: string;
  onRevoked?: (txSig: string) => void;
}

export default function RevokeLicensePanel({ agentId, currentState, onRevoked }: RevokeLicensePanelProps) {
  const { connected } = useWallet();
  const { revoke, loading } = useRevokeLicense();
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<{ signature?: string; error?: string } | null>(null);

  const handleRevoke = useCallback(async () => {
    if (!agentId) return;

    const res = await revoke(agentId);
    if (res.success) {
      setResult({ signature: res.signature });
      onRevoked?.(res.signature);
    } else {
      setResult({ error: res.error });
    }
    setShowConfirm(false);
  }, [agentId, revoke, onRevoked]);

  const isRevoked = currentState === 'Revoked' || result?.signature;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-red-900/20 rounded-xl flex items-center justify-center">
          <span className="text-red-400 text-lg font-bold">4</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Revoke License</h3>
          <p className="text-sm text-gray-400">ECVP Emergency Kill Switch — Terminal State</p>
        </div>
      </div>

      {!agentId ? (
        <div className="text-center py-8 text-gray-500">
          <p>Mint a license first to test revocation</p>
        </div>
      ) : isRevoked ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-900/20 border border-red-800">
            <div className="flex items-center gap-2 text-red-400 font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              License Revoked — Terminal State
            </div>
            <p className="text-red-400/70 text-sm mt-2">
              This license has been permanently revoked. The agent can no longer execute tasks.
              This action is irreversible and recorded on-chain.
            </p>
          </div>
          {result?.signature && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Revocation TX:</span>
              <TxLink signature={result.signature} />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-800 border border-gray-700">
            <p className="text-gray-300 text-sm">
              Revoking a license sets it to the <strong className="text-red-400">Revoked</strong> terminal state.
              This is <strong className="text-red-400">irreversible</strong>. The agent will immediately stop all operations.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <span>Current state:</span>
              <span className="text-white font-medium">{currentState}</span>
              <span>→</span>
              <span className="text-red-400 font-medium">Revoked</span>
            </div>
          </div>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={!connected}
              className="w-full py-3 bg-red-600/20 border border-red-600 text-red-400 font-semibold rounded-xl hover:bg-red-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🚫 Revoke License (ECVP)
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-red-400 text-sm font-medium text-center">
                Are you sure? This cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevoke}
                  disabled={loading}
                  className="py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Revoking...
                    </>
                  ) : (
                    'Confirm Revoke'
                  )}
                </button>
              </div>
            </div>
          )}

          {result?.error && (
            <div className="p-3 rounded-lg bg-red-900/20 border border-red-800 text-red-400 text-sm">
              {result.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
