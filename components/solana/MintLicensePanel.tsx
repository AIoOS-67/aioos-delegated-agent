// AIoOS Mint License Panel - NFT License Minting + On-Chain Registration
// AI-Generated for Colosseum Agent Hackathon 2026

'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMintLicense } from '@/lib/solana/hooks';
import { TxLink, AddressLink } from './TxLink';
import { v4 as uuidv4 } from 'uuid';

interface MintLicensePanelProps {
  onLicenseMinted: (data: {
    agentId: string;
    mintAddress: string;
    registerTx: string;
  }) => void;
}

const LICENSE_TYPES = [
  { value: 'financial_advisor', label: 'Financial Advisor' },
  { value: 'legal_agent', label: 'Legal Agent' },
  { value: 'technical_specialist', label: 'Technical Specialist' },
  { value: 'healthcare_assistant', label: 'Healthcare Assistant' },
  { value: 'real_estate_agent', label: 'Real Estate Agent' },
];

const PERMISSION_LEVELS = [
  { value: 'advisory_only', label: 'Advisory Only', icon: '🟢', desc: 'Can only provide recommendations' },
  { value: 'execute_with_human', label: 'Human Review', icon: '🟡', desc: 'Requires human approval for actions' },
  { value: 'autonomous', label: 'Autonomous', icon: '🔴', desc: 'Can execute independently within scope' },
];

const JURISDICTIONS = ['US', 'EU', 'UK', 'Singapore', 'Japan', 'Global'];

export default function MintLicensePanel({ onLicenseMinted }: MintLicensePanelProps) {
  const { connected } = useWallet();
  const { mint, loading, result } = useMintLicense();

  const [agentName, setAgentName] = useState('');
  const [licenseType, setLicenseType] = useState('financial_advisor');
  const [permissionLevel, setPermissionLevel] = useState('execute_with_human');
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<string[]>(['US']);

  const handleMint = async () => {
    if (!agentName.trim()) return;

    const agentId = uuidv4().slice(0, 8);
    const res = await mint({
      agentId,
      agentName: agentName.trim(),
      licenseType,
      permissionLevel,
      jurisdiction: selectedJurisdictions.join(','),
    });

    if (res?.registerTx) {
      onLicenseMinted({
        agentId,
        mintAddress: res.mintAddress!,
        registerTx: res.registerTx,
      });
    }
  };

  const toggleJurisdiction = (j: string) => {
    setSelectedJurisdictions(prev =>
      prev.includes(j) ? prev.filter(x => x !== j) : [...prev, j]
    );
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20 rounded-xl flex items-center justify-center">
          <span className="text-[#14F195] text-lg font-bold">1</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Issue Agent License</h3>
          <p className="text-sm text-gray-400">Mint as Metaplex NFT + Register on-chain</p>
        </div>
      </div>

      {!connected ? (
        <div className="text-center py-8 text-gray-500">
          <p>Connect your Phantom wallet to mint a license</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Agent Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Agent Name</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="e.g., FinanceBot Alpha"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-[#9945FF] focus:outline-none transition-colors"
              maxLength={32}
            />
          </div>

          {/* License Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">License Type</label>
            <select
              value={licenseType}
              onChange={(e) => setLicenseType(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-[#9945FF] focus:outline-none transition-colors"
            >
              {LICENSE_TYPES.map(lt => (
                <option key={lt.value} value={lt.value}>{lt.label}</option>
              ))}
            </select>
          </div>

          {/* Permission Level */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Permission Level</label>
            <div className="grid grid-cols-3 gap-2">
              {PERMISSION_LEVELS.map(pl => (
                <button
                  key={pl.value}
                  onClick={() => setPermissionLevel(pl.value)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    permissionLevel === pl.value
                      ? 'border-[#9945FF] bg-[#9945FF]/10'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="text-lg mb-1">{pl.icon}</div>
                  <div className="text-xs font-medium text-white">{pl.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{pl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Jurisdictions */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Jurisdictions</label>
            <div className="flex flex-wrap gap-2">
              {JURISDICTIONS.map(j => (
                <button
                  key={j}
                  onClick={() => toggleJurisdiction(j)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedJurisdictions.includes(j)
                      ? 'bg-[#14F195]/20 text-[#14F195] border border-[#14F195]/50'
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {j}
                </button>
              ))}
            </div>
          </div>

          {/* Mint Button */}
          <button
            onClick={handleMint}
            disabled={loading || !agentName.trim() || selectedJurisdictions.length === 0}
            className="w-full py-3 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#9945FF]/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Minting License NFT...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Mint License NFT on Solana
              </>
            )}
          </button>

          {/* Result */}
          {result && (
            <div className={`mt-4 p-4 rounded-xl border ${result.error ? 'bg-red-900/20 border-red-800' : 'bg-green-900/20 border-green-800'}`}>
              {result.error ? (
                <div className="text-red-400 text-sm">{result.error}</div>
              ) : (
                <div className="space-y-2">
                  <div className="text-green-400 text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    License NFT Minted Successfully
                  </div>
                  {result.mintAddress && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">NFT Mint:</span>
                      <AddressLink address={result.mintAddress} />
                    </div>
                  )}
                  {result.registerTx && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">Register TX:</span>
                      <TxLink signature={result.registerTx} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
