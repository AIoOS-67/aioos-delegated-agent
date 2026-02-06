'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function UniswapModePage() {
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
                <Link href="/solana" className="px-2 py-1 bg-gray-100 hover:bg-purple-100 text-gray-500 hover:text-purple-700 rounded text-xs font-medium transition-colors">
                  Solana AI Hackathon
                </Link>
                <span className="px-2 py-1 bg-[#FF007A]/10 text-[#FF007A] rounded text-xs font-medium flex items-center gap-1 border border-[#FF007A]">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Uniswap Hookathon V4
                </span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF007A]/10 border border-[#FF007A]/30 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#FF007A] rounded-full animate-pulse"></span>
            <span className="text-[#FF007A] font-medium text-sm">Coming Soon - Uniswap Hookathon</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black">
            AIoOS Hooks for{' '}
            <span className="text-[#FF007A]">Uniswap</span> v4
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Custom settlement hooks for AI Agent payments. Automated fee distribution. Reputation-based pricing.
          </p>

          {/* Connect Button (Placeholder) */}
          <button
            disabled
            className="px-8 py-4 bg-[#FF007A] text-white font-medium rounded-2xl opacity-50 cursor-not-allowed inline-flex items-center gap-3 hover:bg-[#FF007A]/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Connect Wallet
          </button>
          <p className="mt-4 text-sm text-gray-400">Wallet integration coming soon</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-black">
            <span className="text-[#FF007A]">Uniswap</span> v4 Hook Features
          </h2>
          <p className="text-gray-500 text-center mb-12">Leveraging hooks for AI agent settlement infrastructure</p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Agent Settlement Hook */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#FF007A]/50 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#FF007A]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-[#FF007A] text-2xl font-bold">H</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">Settlement Hook</h3>
              <p className="text-gray-600 text-sm mb-4">
                Custom Uniswap v4 hook that routes agent fees during swaps. Every trade includes AI agent compensation.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-[#FF007A]">+</span>
                  beforeSwap fee routing
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF007A]">+</span>
                  afterSwap settlement
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF007A]">+</span>
                  Dynamic fee calculation
                </li>
              </ul>
            </div>

            {/* Reputation Pricing */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#FF007A]/50 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#FF007A]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-[#FF007A] text-2xl font-bold">R</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">Reputation Pricing</h3>
              <p className="text-gray-600 text-sm mb-4">
                Hook adjusts swap fees based on AI agent reputation scores. Higher trust = better rates.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Elite Agent:</span>
                    <span className="text-green-600 font-medium">0.01% fee</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Verified:</span>
                    <span className="text-yellow-600 font-medium">0.05% fee</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Basic:</span>
                    <span className="text-gray-600 font-medium">0.10% fee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ECVP Integration */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#FF007A]/50 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#FF007A]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-[#FF007A] text-2xl font-bold">E</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">ECVP Revocation</h3>
              <p className="text-gray-600 text-sm mb-4">
                Emergency Credential Validation Protocol. Revoke agent trading permissions instantly.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-[#FF007A]">+</span>
                  Instant revocation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF007A]">+</span>
                  On-chain audit trail
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF007A]">+</span>
                  Funds protection
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Hook Code Preview */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2 text-black">
            AIoOS Settlement Hook
          </h2>
          <p className="text-gray-500 text-center mb-8">Solidity implementation for <span className="text-[#FF007A]">Uniswap</span> v4</p>

          <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm overflow-x-auto shadow-xl">
            <pre className="text-gray-300">{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "v4-periphery/BaseHook.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";

contract `}<span className="text-[#FF007A]">AIoOSSettlementHook</span>{` is BaseHook {
    // Agent reputation registry
    mapping(address => uint256) public agentReputation;

    // ECVP revocation registry
    mapping(address => bool) public revokedAgents;

    function `}<span className="text-green-400">beforeSwap</span>{`(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata hookData
    ) external override returns (bytes4) {
        // Check if agent is revoked
        require(!revokedAgents[sender], `}<span className="text-yellow-400">"Agent revoked"</span>{`);

        // Calculate dynamic fee based on reputation
        uint256 fee = calculateFee(agentReputation[sender]);

        // Route agent settlement fee
        _routeAgentFee(sender, fee);

        return BaseHook.beforeSwap.selector;
    }

    function `}<span className="text-red-400">revokeAgent</span>{`(address agent) external onlyAuthorized {
        revokedAgents[agent] = true;
        emit AgentRevoked(agent, block.timestamp);
    }
}`}</pre>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-black">Hookathon Timeline</h2>

          <div className="flex items-center justify-center gap-4 md:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 border-2 border-gray-300 rounded-full flex items-center justify-center mb-2 mx-auto">
                <span className="text-xl font-bold text-gray-700">2/6</span>
              </div>
              <div className="text-sm text-gray-500">Today</div>
            </div>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 to-[#FF007A] max-w-48"></div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF007A] rounded-full flex items-center justify-center mb-2 mx-auto">
                <span className="text-xl font-bold text-white">3/19</span>
              </div>
              <div className="text-sm text-[#FF007A] font-medium">Deadline</div>
            </div>
          </div>

          <p className="mt-8 text-gray-600">
            <span className="text-[#FF007A] font-medium">Uniswap</span> Hookathon submission deadline: March 19, 2026
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-black">
            Experience Gemini Mode Now
          </h2>
          <p className="text-gray-600 mb-8">
            While <span className="text-[#FF007A]">Uniswap</span> integration is in development, try our fully functional Gemini-powered demo.
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
                <p className="text-xs text-gray-500">24 USPTO Patent Applications | <span className="text-[#FF007A]">Uniswap</span> Hookathon 2026</p>
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
