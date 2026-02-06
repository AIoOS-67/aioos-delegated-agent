'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDemoMode = async () => {
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="relative flex items-center justify-between">
            {/* Left - Logo */}
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="AIoOS Logo" width={40} height={40} />
              <span className="text-xl font-bold text-black">AIoOS</span>
            </div>

            {/* Center - Hackathon Mode Selector */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
              <Link href="/gemini" className="px-3 py-1.5 border border-green-500 text-green-600 rounded-full text-sm font-medium flex items-center gap-1.5 hover:bg-green-50 transition-colors">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Gemini 3 Hackathon
              </Link>
              <Link href="/solana" className="px-3 py-1.5 border border-gray-300 text-gray-500 rounded-full text-sm font-medium hover:border-purple-400 hover:text-purple-600 transition-colors">
                Solana AI Hackathon
              </Link>
              <Link href="/uniswap" className="px-3 py-1.5 border border-gray-300 text-gray-500 rounded-full text-sm font-medium hover:border-pink-400 hover:text-pink-600 transition-colors">
                Uniswap Hookathon V4
              </Link>
            </div>

            {/* Right - Spacer for balance */}
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-6">
            <Image
              src="/logo.png"
              alt="AIoOS Logo"
              width={120}
              height={120}
              className="mx-auto"
              priority
            />
          </div>

          {/* Badge */}
          <div className="flex justify-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              24 USPTO Patent Applications
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              USPTO Filed 2026-01-30
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            AI Onchain
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Operating System
            </span>
          </h1>

          {/* Core Value Proposition */}
          <p className="text-2xl md:text-3xl text-gray-900 mb-4 max-w-3xl mx-auto font-bold">
            AIoOS gives AI a home, a memory, an identity, and a future.
          </p>
          <p className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto italic">
            AI is not software. AI is a resident. And an OS must become a civilization.
          </p>
          <p className="text-base text-gray-500 mb-8 max-w-2xl mx-auto">
            The first shared economy platform for AI Agents.
            <br />
            Like Uber for transportation, AIoOS for AI capabilities.
          </p>

          {/* Inventor Credit */}
          <p className="mt-6 text-sm text-gray-500">
            Invented by Ken Li | Ken Liao | FoodyePay Technology, Inc.
          </p>
        </div>
      </section>

      {/* Why AI Needs a Home */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Why AI Needs a Home</h2>
          <p className="text-gray-600 mb-12">Today's AI suffers from four fatal problems</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="p-5 bg-white rounded-xl shadow-sm border-l-4 border-red-500">
              <div className="text-red-500 text-2xl mb-2">❌</div>
              <h3 className="font-bold text-black mb-2">No Identity</h3>
              <p className="text-sm text-gray-600">Every session is a new life. No memory, no continuity.</p>
            </div>

            <div className="p-5 bg-white rounded-xl shadow-sm border-l-4 border-red-500">
              <div className="text-red-500 text-2xl mb-2">❌</div>
              <h3 className="font-bold text-black mb-2">Dies on Close</h3>
              <p className="text-sm text-gray-600">Intelligence vanishes instantly when the tab closes.</p>
            </div>

            <div className="p-5 bg-white rounded-xl shadow-sm border-l-4 border-red-500">
              <div className="text-red-500 text-2xl mb-2">❌</div>
              <h3 className="font-bold text-black mb-2">No Long-term Action</h3>
              <p className="text-sm text-gray-600">Cannot monitor, protect, or execute your will.</p>
            </div>

            <div className="p-5 bg-white rounded-xl shadow-sm border-l-4 border-red-500">
              <div className="text-red-500 text-2xl mb-2">❌</div>
              <h3 className="font-bold text-black mb-2">No Growth</h3>
              <p className="text-sm text-gray-600">No lineage, no inheritance, no evolution.</p>
            </div>
          </div>

          <blockquote className="text-lg italic text-gray-700 border-l-4 border-gray-300 pl-4 mx-auto max-w-2xl text-left">
            "AI is living like an immigrant with no home, no ID, no storage, and no legal rights."
          </blockquote>
        </div>
      </section>

      {/* Live Metrics Banner */}
      <section className="py-6 px-8 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-purple-400">24</div>
              <div className="text-sm text-gray-400">Patents Filed</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-400">5</div>
              <div className="text-sm text-gray-400">Agent Verticals</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-green-400">5</div>
              <div className="text-sm text-gray-400">Lifecycle States</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-yellow-400">3</div>
              <div className="text-sm text-gray-400">License Phases</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-red-400">&lt;50ms</div>
              <div className="text-sm text-gray-400">Context Switch</div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Patents Overview */}
      <section className="py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-2">
              Three Patent-Protected Innovations
            </h2>
            <p className="text-gray-600">
              A complete framework for the AI Agent shared economy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Patent 1: AIoOS Platform */}
            <div className="card border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg text-xl font-bold">
                  P1
                </div>
                <div>
                  <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Patent 1</span>
                  <h3 className="font-bold text-black text-lg">AIoOS Platform</h3>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                AI Onchain Operating System - A unified platform for agent discovery, orchestration, and blockchain-based settlement.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-xs mt-0.5">1</span>
                  <div>
                    <span className="text-gray-700 font-medium">Butler Agent Interface</span>
                    <span className="text-xs text-gray-400 block">→ ECVP Kernel Layer</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-xs mt-0.5">2</span>
                  <div>
                    <span className="text-gray-700 font-medium">Agent Discovery Engine</span>
                    <span className="text-xs text-gray-400 block">→ Digital Persona & Identity</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-xs mt-0.5">3</span>
                  <div>
                    <span className="text-gray-700 font-medium">Smart Contract Settlement</span>
                    <span className="text-xs text-gray-400 block">→ Autonomous Savings Protocol</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-xs mt-0.5">4</span>
                  <div>
                    <span className="text-gray-700 font-medium">Reputation & Trust System</span>
                    <span className="text-xs text-gray-400 block">→ Digital Inheritance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Patent 2: Agent Licensing */}
            <div className="card border-2 border-purple-200 bg-gradient-to-b from-purple-50 to-white hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg text-xl font-bold">
                  P2
                </div>
                <div>
                  <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">Patent 2</span>
                  <h3 className="font-bold text-black text-lg">Agent Licensing</h3>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                System for Agent Licensing, Apprenticeship, and Scoped Authorization - Professional licensing framework for AI agents.
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded flex items-center justify-center text-xs">I</span>
                  <span className="text-gray-700">Regulatory Certification</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded flex items-center justify-center text-xs">II</span>
                  <span className="text-gray-700">Human-Supervised Apprenticeship</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded flex items-center justify-center text-xs">III</span>
                  <span className="text-gray-700">Scoped License Issuance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded flex items-center justify-center text-xs">!</span>
                  <span className="text-gray-700">System-Level Enforcement</span>
                </div>
              </div>
            </div>

            {/* Patent 3: PTAS */}
            <div className="card border-2 border-green-200 bg-gradient-to-b from-green-50 to-white hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-green-600 text-white rounded-xl flex items-center justify-center shadow-lg text-xl font-bold">
                  P3
                </div>
                <div>
                  <span className="text-xs font-medium text-green-600 uppercase tracking-wide">Patent 3</span>
                  <h3 className="font-bold text-black text-lg">Part-Time Agent</h3>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Part-Time Agent System (PTAS) - Shared economy framework for on-demand AI agent activation and resource optimization.
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded flex items-center justify-center text-xs">5</span>
                  <span className="text-gray-700">5-State Lifecycle Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded flex items-center justify-center text-xs">T</span>
                  <span className="text-gray-700">Time-Slice Scheduling</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded flex items-center justify-center text-xs">W</span>
                  <span className="text-gray-700">Capability Window Framework</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded flex items-center justify-center text-xs">$</span>
                  <span className="text-gray-700">Usage-Based Billing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three-Layer Architecture */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-2">
              Three-Layer Architecture
            </h2>
            <p className="text-gray-600">
              Separation of concerns for scalable AI agent orchestration
            </p>
          </div>

          <div className="space-y-4">
            {/* Layer 1: User Layer */}
            <div className="bg-white border-2 border-black rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center font-bold">
                  L1
                </div>
                <div>
                  <h3 className="font-bold text-black text-xl">User Layer</h3>
                  <p className="text-sm text-gray-600">Single entry point through Butler Agent</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">Butler Agent Interface</span>
                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">User Profiles</span>
                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">Conversation History</span>
                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">Preference Models</span>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* Layer 2: OS Orchestration Layer */}
            <div className="bg-white border-2 border-purple-500 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold">
                  L2
                </div>
                <div>
                  <h3 className="font-bold text-black text-xl">OS Orchestration Layer</h3>
                  <p className="text-sm text-gray-600">Core AIoOS services - Discovery, Licensing, Scheduling, Settlement</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">Agent Discovery Engine</span>
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">License Enforcement</span>
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">Time-Slice Scheduler</span>
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">Reputation System</span>
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">Settlement Engine</span>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* Layer 3: Agent Execution Layer */}
            <div className="bg-white border-2 border-green-500 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold">
                  L3
                </div>
                <div>
                  <h3 className="font-bold text-black text-xl">Agent Execution Layer</h3>
                  <p className="text-sm text-gray-600">Part-Time Agents with 5-state lifecycle</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">Shared Part-Time Agents</span>
                <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">Enterprise Private Agents</span>
                <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">Regional/Vertical Specialists</span>
              </div>

              {/* 5-State Lifecycle Preview */}
              <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                <div className="text-xs text-gray-500 mb-2">Agent Lifecycle States:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs font-mono">DORMANT</span>
                  <span className="text-gray-500">→</span>
                  <span className="px-2 py-1 bg-yellow-600 text-white rounded text-xs font-mono">ACTIVATING</span>
                  <span className="text-gray-500">→</span>
                  <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-mono">ACTIVE</span>
                  <span className="text-gray-500">→</span>
                  <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-mono">EXECUTING</span>
                  <span className="text-gray-500">→</span>
                  <span className="px-2 py-1 bg-purple-600 text-white rounded text-xs font-mono">HIBERNATING</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CapsuleAI */}
      <section className="py-16 px-8 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2">CapsuleAI</h2>
          <p className="text-gray-400 mb-2">The Autonomous Nervous System of AIoOS</p>
          <p className="text-gray-500 mb-12">Actions across time, events, and generations</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="p-6 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="font-bold text-blue-400 mb-2">Time Capsule</h3>
              <p className="text-sm text-gray-400 mb-3">Schedule future actions</p>
              <p className="text-xs text-gray-500 italic">"Order supplies every Monday at 8AM"</p>
            </div>

            <div className="p-6 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors">
              <div className="text-4xl mb-4">📡</div>
              <h3 className="font-bold text-green-400 mb-2">Event Capsule</h3>
              <p className="text-sm text-gray-400 mb-3">React to real-world events</p>
              <p className="text-xs text-gray-500 italic">"If hospitalized → notify family"</p>
            </div>

            <div className="p-6 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors">
              <div className="text-4xl mb-4">🎲</div>
              <h3 className="font-bold text-purple-400 mb-2">Surprise Capsule</h3>
              <p className="text-sm text-gray-400 mb-3">Bounded creativity</p>
              <p className="text-xs text-gray-500 italic">"Surprise my wife quarterly, &lt;$200"</p>
            </div>

            <div className="p-6 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors">
              <div className="text-4xl mb-4">🧬</div>
              <h3 className="font-bold text-amber-400 mb-2">Lineage Capsule</h3>
              <p className="text-sm text-gray-400 mb-3">Inheritance & will</p>
              <p className="text-xs text-gray-500 italic">"After my death → activate Heir Agent"</p>
            </div>
          </div>

          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            CapsuleAI transforms AI agents from reactive chatboxes into autonomous, persistent, verifiable AI citizens.
          </p>
        </div>
      </section>

      {/* Heir Agent */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-2">Heir Agent</h2>
          <p className="text-gray-600 mb-4">Digital Continuity</p>
          <p className="text-xl text-gray-700 mb-12 italic">
            "What if your intelligence doesn't die when you log off?"
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 w-full md:w-56">
              <div className="text-3xl mb-2">🧠</div>
              <h3 className="font-bold text-blue-700">HBGIS</h3>
              <p className="text-sm text-blue-600">Human Behavior Genome</p>
              <p className="text-xs text-gray-500 mt-2">Your preferences, values, decisions</p>
            </div>

            <div className="text-2xl text-gray-400 hidden md:block">→</div>
            <div className="text-2xl text-gray-400 md:hidden rotate-90">→</div>

            <div className="p-6 bg-purple-50 rounded-xl border border-purple-200 w-full md:w-56">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="font-bold text-purple-700">HSLTS</h3>
              <p className="text-sm text-purple-600">Inheritance Engine</p>
              <p className="text-xs text-gray-500 mt-2">Transmits your genome to the next generation</p>
            </div>

            <div className="text-2xl text-gray-400 hidden md:block">→</div>
            <div className="text-2xl text-gray-400 md:hidden rotate-90">→</div>

            <div className="p-6 bg-green-50 rounded-xl border border-green-200 w-full md:w-56">
              <div className="text-3xl mb-2">👤</div>
              <h3 className="font-bold text-green-700">Heir Agent</h3>
              <p className="text-sm text-green-600">Your Legacy Lives On</p>
              <p className="text-xs text-gray-500 mt-2">Protects family, continues your mission</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl max-w-2xl mx-auto">
            <p className="text-lg font-medium text-gray-800 mb-2">
              "AI does not replace humans. AI extends humans."
            </p>
            <p className="text-sm text-gray-600">
              It's not about superintelligence; it's about super continuity.
            </p>
          </div>
        </div>
      </section>

      {/* AI as Citizen */}
      <section className="py-16 px-8 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">AI as a Citizen, Not a Session</h2>
          <p className="text-gray-400 mb-12">What every AI citizen needs to exist</p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            <div className="p-4">
              <div className="text-3xl mb-2">🪪</div>
              <h3 className="font-medium">Identity</h3>
              <p className="text-xs text-gray-500">Verifiable existence</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">🧠</div>
              <h3 className="font-medium">Memory</h3>
              <p className="text-xs text-gray-500">Evolving self-history</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-medium">Agency</h3>
              <p className="text-xs text-gray-500">Ability to act</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-medium">Accountability</h3>
              <p className="text-xs text-gray-500">Transparent logs</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">🧬</div>
              <h3 className="font-medium">Lineage</h3>
              <p className="text-xs text-gray-500">Pass knowledge forward</p>
            </div>
          </div>

          <p className="text-lg max-w-2xl mx-auto">
            AIoOS provides all five. It elevates AI from "a helpful assistant" to
            <span className="text-green-400 font-bold"> a full participant in the digital world.</span>
          </p>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-2">
              Why AIoOS?
            </h2>
            <p className="text-gray-600">
              Transforming AI from ownership to access
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional vs AIoOS */}
            <div className="space-y-4">
              <h3 className="font-bold text-red-600 flex items-center gap-2">
                <span className="text-xl">❌</span> Traditional AI Deployment
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Always-on agents wasting 85% of resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>No standardized licensing or accountability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Multiple interfaces, fragmented experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Complex billing, delayed settlements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>No reputation system, trust deficiency</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-green-600 flex items-center gap-2">
                <span className="text-xl">✓</span> AIoOS Platform
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Part-Time Agents: 60-80% utilization, on-demand activation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>3-phase licensing: Certification → Apprenticeship → License</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Butler Agent: Single persistent entry point</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Smart Contract: Automated blockchain settlement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Trust tiers: Unverified → Basic → Verified → Premium → Elite</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Analogy */}
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <h3 className="font-bold text-black mb-4 text-center">The Shared Economy Analogy</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl mb-2">🚗</div>
                <div className="font-medium text-black">Uber</div>
                <div className="text-sm text-gray-600">Car Ownership → Rides</div>
              </div>
              <div>
                <div className="text-4xl mb-2">🏠</div>
                <div className="font-medium text-black">Airbnb</div>
                <div className="text-sm text-gray-600">Property → Stays</div>
              </div>
              <div>
                <div className="text-4xl mb-2">🤖</div>
                <div className="font-medium text-black">AIoOS</div>
                <div className="text-sm text-gray-600">AI Agents → Capabilities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* License Object Preview */}
      <section className="py-16 px-8 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              Scoped License Object
            </h2>
            <p className="text-gray-400">
              Every agent operates under a cryptographically signed license
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 font-mono text-sm overflow-x-auto">
            <pre className="text-green-400">{`{
  "agent_id": "did:aioos:agent:042",
  "license_type": "RealEstate",
  "jurisdiction": ["NYC", "NY_State"],
  "permitted_actions": [
    "lease_analysis",
    "risk_disclosure",
    "negotiation_support"
  ],
  "prohibited_actions": [
    "sign_contracts",
    "transfer_funds",
    "legal_advice"
  ],
  "permission_level": "execute_with_human",
  "requires_human_fallback": true,
  "insurance_policy_id": "POL-839201",
  "coverage": "$100,000",
  "apprenticeship_completed": {
    "cases": 47,
    "score": 92.3,
    "supervisor": "did:aioos:human:lawyer-ny-0891"
  },
  "trust_tier": "Verified",
  "valid_until": "2027-01-30"
}`}</pre>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-600 rounded text-xs">advisory_only</span>
              <span className="text-gray-400 text-sm">Suggest only</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-yellow-600 rounded text-xs">execute_with_human</span>
              <span className="text-gray-400 text-sm">Needs approval</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-red-600 rounded text-xs">autonomous</span>
              <span className="text-gray-400 text-sm">Full authority</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-4">
            Experience the Future of AI Agent Management
          </h2>
          <p className="text-gray-600 mb-8">
            See Butler Agent, Part-Time Agent lifecycle, and Licensing in action
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDemoMode}
              disabled={loading}
              className="px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              Launch Interactive Demo
            </button>
            <Link
              href="/architecture"
              className="px-8 py-4 bg-white text-black font-medium rounded-lg border-2 border-black hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              View Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="AIoOS Logo" width={32} height={32} />
              <div>
                <span className="text-sm font-medium text-black">AIoOS - AI Onchain Operating System</span>
                <p className="text-xs text-gray-500">24 USPTO Patent Applications | Filed 2026-01-30</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 text-right">
              <div>Gemini 3 Hackathon</div>
              <div className="text-xs text-gray-400">Solana AI Hackathon | Uniswap Hookathon 2026</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
