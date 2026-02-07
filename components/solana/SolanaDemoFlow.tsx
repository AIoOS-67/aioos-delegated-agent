// AIoOS Solana Demo Flow - End-to-End Orchestrated Demo
// AI-Generated for Colosseum Agent Hackathon 2026
// Full demo: Create License → Mint NFT → Execute Task → Audit → Revoke

'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import MintLicensePanel from './MintLicensePanel';
import PtasStateMachine from './PtasStateMachine';
import AuditLogPanel from './AuditLogPanel';
import RevokeLicensePanel from './RevokeLicensePanel';
import { TxLink, AddressLink } from './TxLink';

interface DemoStep {
  id: number;
  label: string;
  status: 'pending' | 'active' | 'completed';
  txSig?: string;
}

export default function SolanaDemoFlow() {
  const { connected } = useWallet();
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [mintAddress, setMintAddress] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState<string>('Dormant');
  const [allTxSignatures, setAllTxSignatures] = useState<Array<{ label: string; sig: string }>>([]);

  const [steps, setSteps] = useState<DemoStep[]>([
    { id: 1, label: 'Issue License (Mint NFT)', status: 'active' },
    { id: 2, label: 'PTAS Lifecycle Management', status: 'pending' },
    { id: 3, label: 'Execute Task & Audit Log', status: 'pending' },
    { id: 4, label: 'Revoke License (ECVP)', status: 'pending' },
  ]);

  const advanceStep = useCallback((completedId: number) => {
    setSteps(prev => prev.map(step => {
      if (step.id === completedId) return { ...step, status: 'completed' as const };
      if (step.id === completedId + 1) return { ...step, status: 'active' as const };
      return step;
    }));
  }, []);

  const addTx = useCallback((label: string, sig: string) => {
    setAllTxSignatures(prev => [...prev, { label, sig }]);
  }, []);

  const handleLicenseMinted = useCallback((data: {
    agentId: string;
    mintAddress: string;
    registerTx: string;
  }) => {
    setActiveAgentId(data.agentId);
    setMintAddress(data.mintAddress);
    addTx('Register License', data.registerTx);
    advanceStep(1);
  }, [addTx, advanceStep]);

  const handleStateChange = useCallback((newState: string, txSig: string) => {
    setCurrentState(newState);
    addTx(`State → ${newState}`, txSig);
  }, [addTx]);

  const handleRevoked = useCallback((txSig: string) => {
    setCurrentState('Revoked');
    addTx('Revoke License', txSig);
    advanceStep(4);
  }, [addTx, advanceStep]);

  return (
    <div className="space-y-6">
      {/* Demo Progress Tracker */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Demo Flow Progress</h3>
          <span className="text-xs text-gray-500">
            {allTxSignatures.length} transaction{allTxSignatures.length !== 1 ? 's' : ''} on Devnet
          </span>
        </div>
        <div className="flex items-center gap-2">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 flex-1 p-2 rounded-lg transition-all ${
                step.status === 'completed' ? 'bg-green-900/20 border border-green-800' :
                step.status === 'active' ? 'bg-[#9945FF]/10 border border-[#9945FF]/50' :
                'bg-gray-800/50 border border-gray-800'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  step.status === 'completed' ? 'bg-green-600 text-white' :
                  step.status === 'active' ? 'bg-[#9945FF] text-white' :
                  'bg-gray-700 text-gray-500'
                }`}>
                  {step.status === 'completed' ? '✓' : step.id}
                </div>
                <span className={`text-xs truncate ${
                  step.status === 'completed' ? 'text-green-400' :
                  step.status === 'active' ? 'text-white' :
                  'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <svg className="w-4 h-4 text-gray-600 mx-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Active License Info */}
        {activeAgentId && (
          <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-4 text-xs">
            <span className="text-gray-500">Agent ID:</span>
            <span className="text-white font-mono">{activeAgentId}</span>
            {mintAddress && (
              <>
                <span className="text-gray-500">NFT Mint:</span>
                <AddressLink address={mintAddress} />
              </>
            )}
            <span className="text-gray-500">State:</span>
            <span className={`font-medium ${currentState === 'Revoked' ? 'text-red-400' : 'text-[#14F195]'}`}>
              {currentState}
            </span>
          </div>
        )}
      </div>

      {/* Step Panels */}
      <MintLicensePanel onLicenseMinted={handleLicenseMinted} />

      <PtasStateMachine
        agentId={activeAgentId}
        onStateChange={handleStateChange}
      />

      <AuditLogPanel agentId={activeAgentId} />

      <RevokeLicensePanel
        agentId={activeAgentId}
        currentState={currentState}
        onRevoked={handleRevoked}
      />

      {/* All Transactions Summary */}
      {allTxSignatures.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#14F195]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            All Solana Devnet Transactions ({allTxSignatures.length})
          </h3>
          <div className="space-y-2">
            {allTxSignatures.map((tx, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#9945FF]/20 text-[#9945FF] rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-300">{tx.label}</span>
                </div>
                <TxLink signature={tx.sig} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tagline */}
      <div className="text-center py-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 italic tracking-wide">
          Autonomous ≠ Unconstrained — AIoOS License System
        </p>
      </div>
    </div>
  );
}
