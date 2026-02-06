'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function GeminiModePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLaunchDemo = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/demo', { method: 'POST' });
      if (res.ok) {
        router.push('/butler');
      }
    } catch (error) {
      console.error('Demo mode error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="relative flex items-center justify-between">
            {/* Left - Logo + Back */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo.png" alt="AIoOS Logo" width={40} height={40} />
                <span className="text-xl font-bold text-black">AIoOS</span>
              </Link>
              <Link href="/" className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors">
                Back to Home
              </Link>
            </div>

            {/* Center - Current Hackathon */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <span className="px-4 py-2 border-2 border-green-500 text-green-600 rounded-full text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Gemini 3 Hackathon
              </span>
            </div>

            {/* Right - Key Actions */}
            <div className="flex items-center gap-3">
              <Link href="/pitch" className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-full text-sm font-medium transition-colors">
                Pitch Deck
              </Link>
              <Link href="/demo" className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-medium transition-colors">
                Demo Tour
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4285F4]/10 border border-[#4285F4]/30 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#4285F4] rounded-full animate-pulse"></span>
            <span className="text-[#4285F4] font-medium text-sm">Gemini 3 Hackathon</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black">
            AIoOS on{' '}
            <span className="text-[#4285F4]">Gemini</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered task execution with human-controllable delegation and instant revocability.
          </p>

          {/* Launch Demo Button */}
          <button
            onClick={handleLaunchDemo}
            disabled={loading}
            className="px-8 py-4 bg-[#4285F4] text-white font-medium rounded-2xl hover:bg-[#3367D6] transition-colors inline-flex items-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            Launch Demo
          </button>
          <p className="mt-4 text-sm text-gray-400">Powered by Gemini 2.0 Flash API</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-black">
            <span className="text-[#4285F4]">Gemini</span>-Powered Features
          </h2>
          <p className="text-gray-500 text-center mb-12">Three core capabilities demonstrating AIoOS architecture</p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Butler Agent */}
            <Link href="/butler" className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#4285F4]/50 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-[#4285F4]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#4285F4]/20 transition-colors">
                <svg className="w-7 h-7 text-[#4285F4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black group-hover:text-[#4285F4] transition-colors">Butler Agent</h3>
              <p className="text-gray-600 text-sm mb-4">
                Natural language task orchestration. Single entry point for all AI agent interactions.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-[#4285F4]">+</span>
                  Intent recognition
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4285F4]">+</span>
                  Agent discovery & dispatch
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4285F4]">+</span>
                  Context preservation
                </li>
              </ul>
            </Link>

            {/* Contract Analyzer */}
            <Link href="/butler" className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#4285F4]/50 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-[#4285F4]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#4285F4]/20 transition-colors">
                <svg className="w-7 h-7 text-[#4285F4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black group-hover:text-[#4285F4] transition-colors">Contract Analyzer</h3>
              <p className="text-gray-600 text-sm mb-4">
                Legal document analysis with risk scoring. ECVP-protected execution with human oversight.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-[#4285F4]">+</span>
                  Risk assessment (0-10)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4285F4]">+</span>
                  Human escalation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4285F4]">+</span>
                  Instant revocation
                </li>
              </ul>
            </Link>

            {/* Multi-Agent */}
            <Link href="/lifecycle" className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#4285F4]/50 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-[#4285F4]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#4285F4]/20 transition-colors">
                <svg className="w-7 h-7 text-[#4285F4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black group-hover:text-[#4285F4] transition-colors">PTAS Lifecycle</h3>
              <p className="text-gray-600 text-sm mb-4">
                Part-Time Agent System with 5-state lifecycle. Shared economy for AI capabilities.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-[#4285F4]">+</span>
                  5-state management
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4285F4]">+</span>
                  Resource optimization
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4285F4]">+</span>
                  Usage-based billing
                </li>
              </ul>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Innovation */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2 text-black">
            Core Innovation: <span className="text-[#4285F4]">ECVP</span>
          </h2>
          <p className="text-gray-500 text-center mb-8">Emergency Credential Validation Protocol</p>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-black mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-sm font-bold">!</span>
                  The Problem
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Traditional AI systems lack real-time control. Once an agent is authorized, there's no way to instantly revoke its permissions during execution.
                </p>
                <p className="text-gray-600 text-sm font-medium">
                  "AI can act for you — but what happens when you want it to stop?"
                </p>
              </div>
              <div>
                <h3 className="font-bold text-black mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-sm font-bold">✓</span>
                  The Solution
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  ECVP provides instant revocation with &lt;50ms response time. Every agent action validates credentials in real-time.
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#4285F4]/10 text-[#4285F4] rounded-lg text-sm font-medium">Revoke</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-medium">Agent Stops</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-xs text-gray-500">&lt;50ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Flow */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-black">
            Try the Demo
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#4285F4] text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
              <h4 className="font-medium text-black mb-1">Launch Demo</h4>
              <p className="text-xs text-gray-500">No login required</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#4285F4] text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
              <h4 className="font-medium text-black mb-1">Ask Butler</h4>
              <p className="text-xs text-gray-500">"Analyze this contract"</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#4285F4] text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
              <h4 className="font-medium text-black mb-1">Watch PTAS</h4>
              <p className="text-xs text-gray-500">DORMANT → ACTIVE</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">4</div>
              <h4 className="font-medium text-black mb-1">Try Revoke</h4>
              <p className="text-xs text-gray-500">Instant stop</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleLaunchDemo}
              disabled={loading}
              className="px-8 py-4 bg-[#4285F4] text-white font-medium rounded-2xl hover:bg-[#3367D6] transition-colors inline-flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              Launch Interactive Demo
            </button>
          </div>
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
                <p className="text-xs text-gray-500">24 USPTO Patent Applications | <span className="text-[#4285F4]">Gemini</span> API Competition 2025</p>
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
