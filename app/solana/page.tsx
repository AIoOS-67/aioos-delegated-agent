// AIoOS Solana Demo Page - Full Interactive Blockchain Integration
// AI-Generated for Colosseum Agent Hackathon 2026
// Autonomous ≠ Unconstrained — AIoOS License System

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import WalletButton from '@/components/solana/WalletButton';
import SolanaDemoFlow from '@/components/solana/SolanaDemoFlow';

export default function SolanaModePage() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!connected || !publicKey) {
      setBalance(null);
      return;
    }
    let cancelled = false;
    connection.getBalance(publicKey).then(lamports => {
      if (!cancelled) setBalance(lamports / LAMPORTS_PER_SOL);
    }).catch(() => {
      if (!cancelled) setBalance(null);
    });
    return () => { cancelled = true; };
  }, [connected, publicKey, connection]);

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="AIoOS Logo" width={40} height={40} />
              <span className="text-xl font-bold text-white">AIoOS</span>
            </Link>
            <nav className="flex items-center gap-3">
              <Link href="/" className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors">
                Back to Home
              </Link>

              {/* Mode Selector */}
              <div className="flex items-center gap-1 ml-2 border-l border-gray-700 pl-3">
                <Link href="/gemini" className="px-2 py-1 bg-gray-800 hover:bg-green-900/30 text-gray-500 hover:text-green-400 rounded text-xs font-medium transition-colors">
                  Gemini 3 Hackathon
                </Link>
                <span className="px-2 py-1 bg-gradient-to-r from-[#9945FF]/20 to-[#14F195]/20 text-[#14F195] rounded text-xs font-medium flex items-center gap-1 border border-[#9945FF]/50">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Solana AI Hackathon
                </span>
                <Link href="/uniswap" className="px-2 py-1 bg-gray-800 hover:bg-pink-900/30 text-gray-500 hover:text-pink-400 rounded text-xs font-medium transition-colors">
                  Uniswap Hookathon V4
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-8 bg-gradient-to-b from-[#9945FF]/5 to-black">
        <div className="max-w-4xl mx-auto text-center">
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#14F195]/10 border border-[#14F195]/30 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#14F195] rounded-full animate-pulse"></span>
            <span className="text-[#14F195] font-medium text-sm">Live on Solana Devnet</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            AIoOS on{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195]">
              Solana
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Agent Licenses as Metaplex NFTs. PTAS State Machine on-chain. On-chain audit trail. All on Solana Devnet.
          </p>

          {/* Wallet Connect */}
          <div className="flex flex-col items-center gap-4">
            <WalletButton />
            {connected && publicKey && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="w-2 h-2 bg-[#14F195] rounded-full"></span>
                  Connected: <span className="font-mono text-white">{publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}</span>
                  <span className="text-xs text-gray-600 ml-2">(Devnet)</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl">
                  <span className="text-sm text-gray-400">Balance:</span>
                  <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195]">
                    {balance !== null ? `${balance.toFixed(4)} SOL` : '...'}
                  </span>
                </div>
              </div>
            )}
            {!connected && (
              <p className="text-sm text-gray-500">
                Install <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-[#9945FF] hover:underline">Phantom</a> and switch to Devnet (Settings &gt; Developer Settings &gt; Devnet)
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid (condensed) */}
      <section className="py-8 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: 'NFT', label: 'License NFTs', desc: 'Metaplex standard', color: 'from-[#9945FF] to-[#14F195]' },
              { icon: '5', label: 'PTAS States', desc: 'On-chain lifecycle', color: 'from-[#9945FF] to-[#14F195]' },
              { icon: '📝', label: 'Audit Trail', desc: 'On-chain logging', color: 'from-[#9945FF] to-[#14F195]' },
              { icon: '🚫', label: 'ECVP Revoke', desc: 'Kill switch', color: 'from-red-500 to-red-700' },
            ].map((feature, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <div className={`w-10 h-10 mx-auto bg-gradient-to-br ${feature.color} bg-opacity-10 rounded-lg flex items-center justify-center mb-2`}>
                  <span className="text-white text-sm font-bold">{feature.icon}</span>
                </div>
                <div className="text-sm font-medium text-white">{feature.label}</div>
                <div className="text-xs text-gray-500">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Demo Flow */}
      <section className="py-8 px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Interactive Demo
            </h2>
            <p className="text-gray-400 text-sm">
              Mint a license NFT, manage PTAS lifecycle, execute tasks with audit logging, and revoke — all on Solana Devnet
            </p>
          </div>

          <SolanaDemoFlow />
        </div>
      </section>

      {/* Program Architecture */}
      <section className="py-12 px-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195]">Anchor</span> Program Architecture
          </h2>

          <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm overflow-x-auto border border-gray-800">
            <pre className="text-gray-300">{`// AIoOS License Program (Anchor/Rust) - Deployed to Devnet
// AI-Generated for Colosseum Agent Hackathon 2026

`}<span className="text-[#9945FF]">use</span>{` anchor_lang::prelude::*;

`}<span className="text-gray-500">/// PTAS 5-State Lifecycle (Patent 3)</span>{`
`}<span className="text-[#9945FF]">pub enum</span>{` `}<span className="text-[#14F195]">PtasState</span>{` {
    Dormant, Activating, Active, Executing, Hibernating, Revoked
}

`}<span className="text-gray-500">/// Instructions:</span>{`
`}<span className="text-[#9945FF]">pub fn</span>{` `}<span className="text-[#14F195]">register_license</span>{`(agent_id, nft_mint, license_type, ...) -> Result<()>
`}<span className="text-[#9945FF]">pub fn</span>{` `}<span className="text-[#14F195]">update_ptas_state</span>{`(new_state: PtasState) -> Result<()>
`}<span className="text-[#9945FF]">pub fn</span>{` `}<span className="text-red-400">revoke_license</span>{`() -> Result<()>  `}<span className="text-gray-500">// ECVP kill switch</span>{`
`}<span className="text-[#9945FF]">pub fn</span>{` `}<span className="text-[#14F195]">log_action</span>{`(action, details) -> Result<()>

`}<span className="text-gray-500">/// PDA Accounts:</span>{`
`}<span className="text-gray-500">/// - ProgramConfig:  seeds=[b"config"]</span>{`
`}<span className="text-gray-500">/// - LicenseAccount: seeds=[b"license", agent_id]</span>{`
`}<span className="text-gray-500">/// - AuditEntry:     seeds=[b"audit", license, index]</span>{`
`}</pre>
          </div>
        </div>
      </section>

      {/* Why Solana (condensed) */}
      <section className="py-12 px-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195]">Solana</span> for AIoOS?
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { stat: '65k', label: 'TPS', desc: 'Agent state transitions at scale' },
              { stat: '400ms', label: 'Block Time', desc: 'Near-instant finality' },
              { stat: '$0.00025', label: 'Per Tx', desc: 'Micro-payments viable' },
              { stat: 'Metaplex', label: 'NFT Standard', desc: 'Industry-standard licenses' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195]">
                  {item.stat}
                </div>
                <div className="text-sm font-medium text-white">{item.label}</div>
                <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="AIoOS Logo" width={32} height={32} />
              <div>
                <span className="text-sm font-medium text-white">AIoOS - AI Onchain Operating System</span>
                <p className="text-xs text-gray-500">24 USPTO Patent Applications | <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195]">Solana</span> AI Hackathon 2026</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 italic tracking-wide">Autonomous ≠ Unconstrained — AIoOS License System</p>
              <p className="text-xs text-gray-600 mt-1">Invented by Ken Li | Ken Liao | FoodyePay Technology, Inc.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
