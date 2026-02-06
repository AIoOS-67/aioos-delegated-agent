'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function SolanaModePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="AIoOS Logo" width={40} height={40} />
              <span className="text-xl font-bold text-black">AIoOS</span>
            </Link>
            <nav className="flex items-center gap-3">
              <Link href="/" className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                Back to Home
              </Link>

              {/* Mode Selector */}
              <div className="flex items-center gap-1 ml-2 border-l border-gray-300 pl-3">
                <Link href="/gemini" className="px-2 py-1 bg-gray-100 hover:bg-green-100 text-gray-500 hover:text-green-700 rounded text-xs font-medium transition-colors">
                  Gemini 3 Hackathon
                </Link>
                <span className="px-2 py-1 bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 text-[#9945FF] rounded text-xs font-medium flex items-center gap-1 border border-[#9945FF]">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Solana AI Hackathon
                </span>
                <Link href="/uniswap" className="px-2 py-1 bg-gray-100 hover:bg-pink-100 text-gray-500 hover:text-pink-600 rounded text-xs font-medium transition-colors">
                  Uniswap Hookathon V4
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#9945FF]/10 border border-[#9945FF]/30 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#9945FF] rounded-full animate-pulse"></span>
            <span className="text-[#9945FF] font-medium text-sm">Coming Soon - Solana AI Hackathon</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black">
            AIoOS on{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195]">
              Solana
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Agent Licenses as NFTs. PTAS State Management on-chain. USDC Settlement with sub-second finality.
          </p>

          {/* Phantom Wallet Button (Placeholder) */}
          <button
            disabled
            className="px-8 py-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white font-medium rounded-2xl opacity-50 cursor-not-allowed inline-flex items-center gap-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 40 40" fill="currentColor">
              <path d="M34.8 19.6H29.1C29.1 10.5 21.7 3 12.4 3C3.3 3 -3.8 10.3 -4 19.5C-4.2 28.9 4.3 37 12.4 37H15.5C24 37 34.8 28.2 34.8 19.6Z" fill="white" stroke="currentColor" strokeWidth="2"/>
              <circle cx="9" cy="17" r="3" fill="currentColor"/>
              <circle cx="20" cy="17" r="3" fill="currentColor"/>
            </svg>
            Connect Phantom Wallet
          </button>
          <p className="mt-4 text-sm text-gray-400">Wallet integration coming soon</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-black">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195]">Solana</span>-Native Features
          </h2>
          <p className="text-gray-500 text-center mb-12">High-performance infrastructure for AI agent operations</p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* NFT Licenses */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#9945FF]/50 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195] text-2xl font-bold">NFT</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">Agent License NFTs</h3>
              <p className="text-gray-600 text-sm mb-4">
                Each AI Agent License is minted as a Metaplex NFT with on-chain metadata for permissions and expiration.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-[#14F195]">+</span>
                  Tradeable agent capabilities
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#14F195]">+</span>
                  Verifiable license history
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#14F195]">+</span>
                  Composable permissions
                </li>
              </ul>
            </div>

            {/* PTAS on Solana */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#9945FF]/50 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-[#9945FF] text-2xl font-bold">5</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">On-Chain State Machine</h3>
              <p className="text-gray-600 text-sm mb-4">
                5-state PTAS lifecycle managed by Solana programs. Atomic and verifiable state transitions.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs">
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded">DORMANT</span>
                  <span className="text-gray-400">-&gt;</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">ACTIVATING</span>
                  <span className="text-gray-400">-&gt;</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded">ACTIVE</span>
                </div>
              </div>
            </div>

            {/* USDC Settlement */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#9945FF]/50 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-[#14F195] text-2xl font-bold">$</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">USDC Settlement</h3>
              <p className="text-gray-600 text-sm mb-4">
                Pay-per-use billing with instant USDC settlement. Escrow contracts protect funds until task completion.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-[#14F195]">+</span>
                  Sub-second finality
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#14F195]">+</span>
                  ~$0.00025 per transaction
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#14F195]">+</span>
                  Escrow protection
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Program Architecture */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2 text-black">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195]">Solana</span> Program Architecture
          </h2>
          <p className="text-gray-500 text-center mb-8">Rust-based programs for AIoOS infrastructure</p>

          <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm overflow-x-auto shadow-xl">
            <pre className="text-gray-300">{`// AIoOS Solana Program Structure
`}<span className="text-[#9945FF]">pub mod</span>{` programs {
    `}<span className="text-[#9945FF]">pub mod</span>{` `}<span className="text-[#14F195]">license_nft</span>{` {
        `}<span className="text-gray-500">// Metaplex NFT minting for agent licenses</span>{`
        `}<span className="text-gray-500">// Stores: permissions, constraints, expiration</span>{`
    }

    `}<span className="text-[#9945FF]">pub mod</span>{` `}<span className="text-[#14F195]">ptas_state</span>{` {
        `}<span className="text-gray-500">// 5-state lifecycle management</span>{`
        `}<span className="text-gray-500">// States: Dormant, Activating, Active, Executing, Hibernating</span>{`
    }

    `}<span className="text-[#9945FF]">pub mod</span>{` `}<span className="text-[#14F195]">settlement</span>{` {
        `}<span className="text-gray-500">// USDC escrow and payment distribution</span>{`
        `}<span className="text-gray-500">// Usage-based billing with instant settlement</span>{`
    }

    `}<span className="text-[#9945FF]">pub mod</span>{` `}<span className="text-red-400">revocation</span>{` {
        `}<span className="text-gray-500">// Instant license revocation (ECVP)</span>{`
        `}<span className="text-gray-500">// Burns NFT, updates state, refunds escrow</span>{`
    }
}`}</pre>
          </div>
        </div>
      </section>

      {/* Why Solana */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-black">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195]">Solana</span> for AIoOS?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#14F195]/10 rounded-lg flex items-center justify-center">
                  <span className="text-[#14F195] font-bold">65k</span>
                </div>
                <div>
                  <h3 className="font-bold text-black">TPS Capacity</h3>
                  <p className="text-sm text-gray-500">Transactions per second</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Handle millions of agent state transitions and micro-payments without congestion.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#9945FF]/10 rounded-lg flex items-center justify-center">
                  <span className="text-[#9945FF] font-bold">400ms</span>
                </div>
                <div>
                  <h3 className="font-bold text-black">Block Time</h3>
                  <p className="text-sm text-gray-500">Near-instant finality</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Real-time agent activation and revocation with sub-second confirmation.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#14F195]/10 rounded-lg flex items-center justify-center">
                  <span className="text-[#14F195] font-bold">$0.00025</span>
                </div>
                <div>
                  <h3 className="font-bold text-black">Transaction Cost</h3>
                  <p className="text-sm text-gray-500">Micro-payments viable</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Pay-per-use billing economically feasible even for small tasks.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#9945FF]/10 rounded-lg flex items-center justify-center">
                  <span className="text-[#9945FF] font-bold">NFT</span>
                </div>
                <div>
                  <h3 className="font-bold text-black">Metaplex Standard</h3>
                  <p className="text-sm text-gray-500">Industry-standard NFTs</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Agent licenses as tradeable NFTs with rich on-chain metadata.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-black">Hackathon Timeline</h2>

          <div className="flex items-center justify-center gap-4 md:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 border-2 border-gray-300 rounded-full flex items-center justify-center mb-2 mx-auto">
                <span className="text-xl font-bold text-gray-700">2/6</span>
              </div>
              <div className="text-sm text-gray-500">Today</div>
            </div>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 via-[#9945FF] to-[#14F195] max-w-48"></div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-full flex items-center justify-center mb-2 mx-auto">
                <span className="text-xl font-bold text-white">2/12</span>
              </div>
              <div className="text-sm text-[#9945FF] font-medium">Deadline</div>
            </div>
          </div>

          <p className="mt-8 text-gray-600">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195] font-medium">Solana</span> AI Agent Hackathon submission deadline: February 12, 2026
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-black">
            Experience Gemini Mode Now
          </h2>
          <p className="text-gray-600 mb-8">
            While <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195] font-medium">Solana</span> integration is in development, try our fully functional Gemini-powered demo.
          </p>
          <Link
            href="/"
            className="px-8 py-4 bg-black text-white font-medium rounded-2xl hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Launch Gemini Demo
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="AIoOS Logo" width={32} height={32} />
              <div>
                <span className="text-sm font-medium text-black">AIoOS - AI Onchain Operating System</span>
                <p className="text-xs text-gray-500">24 USPTO Patent Applications | <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195]">Solana</span> AI Hackathon 2026</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Invented by Ken Li | Ken Liao | FoodyePay Technology, Inc.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
