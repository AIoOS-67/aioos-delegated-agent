'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="AIoOS Logo" width={40} height={40} />
              <span className="text-xl font-bold text-black">AIoOS</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/use-cases" className="text-gray-700 hover:text-black transition-colors">
                Use Cases
              </Link>
              <Link href="/dashboard" className="btn-primary">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              Patent 1: AIoOS
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
              Patent 2: Licensing
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              Patent 3: PTAS
            </span>
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">
            System Architecture
          </h1>
          <p className="text-xl text-gray-700">
            Three-layer architecture integrating three patent-protected innovations
          </p>
        </div>
      </section>

      {/* Main Architecture Diagram */}
      <section className="py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-black mb-8 text-center">AIoOS Three-Layer Architecture</h2>

          <div className="space-y-6">
            {/* Layer 1: User Layer */}
            <div className="border-2 border-black rounded-xl overflow-hidden">
              <div className="bg-black text-white px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center font-bold">L1</span>
                  <div>
                    <h3 className="font-bold text-lg">User Layer (100)</h3>
                    <p className="text-gray-300 text-sm">Patent 1: Butler Agent Interface</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-2xl mb-2">🎩</div>
                    <h4 className="font-bold text-black">Butler Agent</h4>
                    <p className="text-xs text-gray-600 mt-1">Single persistent entry point. Interprets intent, decomposes tasks, synthesizes results.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-2xl mb-2">👤</div>
                    <h4 className="font-bold text-black">User Profiles (110)</h4>
                    <p className="text-xs text-gray-600 mt-1">Identity, preferences, authorization credentials.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-2xl mb-2">💬</div>
                    <h4 className="font-bold text-black">Conversation History (120)</h4>
                    <p className="text-xs text-gray-600 mt-1">Persistent context across sessions.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-2xl mb-2">⚙️</div>
                    <h4 className="font-bold text-black">Preference Models (130)</h4>
                    <p className="text-xs text-gray-600 mt-1">Learned user patterns and communication style.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-xs text-gray-500 mt-1">Request Routing</span>
              </div>
            </div>

            {/* Layer 2: OS Orchestration Layer */}
            <div className="border-2 border-purple-500 rounded-xl overflow-hidden">
              <div className="bg-purple-600 text-white px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-white text-purple-600 rounded-lg flex items-center justify-center font-bold">L2</span>
                  <div>
                    <h3 className="font-bold text-lg">OS Orchestration Layer (200)</h3>
                    <p className="text-purple-200 text-sm">Patents 1, 2, 3: Core AIoOS Services</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-purple-50">
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <div className="text-2xl mb-2">🔍</div>
                    <h4 className="font-bold text-black text-sm">Discovery Engine (210)</h4>
                    <p className="text-xs text-gray-600 mt-1">Capability indexing, semantic matching, fitness scoring.</p>
                    <span className="mt-2 inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">P1</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <div className="text-2xl mb-2">📜</div>
                    <h4 className="font-bold text-black text-sm">License Enforcement (400)</h4>
                    <p className="text-xs text-gray-600 mt-1">Action interception, validation, authorization.</p>
                    <span className="mt-2 inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">P2</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <div className="text-2xl mb-2">⏱️</div>
                    <h4 className="font-bold text-black text-sm">Time-Slice Scheduler (230)</h4>
                    <p className="text-xs text-gray-600 mt-1">Temporal multiplexing, context switching, fairness.</p>
                    <span className="mt-2 inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">P3</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <div className="text-2xl mb-2">⭐</div>
                    <h4 className="font-bold text-black text-sm">Reputation System (240)</h4>
                    <p className="text-xs text-gray-600 mt-1">Trust tiers, performance metrics, incident tracking.</p>
                    <span className="mt-2 inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">P1</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <div className="text-2xl mb-2">💰</div>
                    <h4 className="font-bold text-black text-sm">Settlement Engine (250)</h4>
                    <p className="text-xs text-gray-600 mt-1">Smart contracts, blockchain settlement, billing.</p>
                    <span className="mt-2 inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">P1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-xs text-gray-500 mt-1">Agent Dispatch</span>
              </div>
            </div>

            {/* Layer 3: Agent Execution Layer */}
            <div className="border-2 border-green-500 rounded-xl overflow-hidden">
              <div className="bg-green-600 text-white px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-white text-green-600 rounded-lg flex items-center justify-center font-bold">L3</span>
                  <div>
                    <h3 className="font-bold text-lg">Agent Execution Layer (300)</h3>
                    <p className="text-green-200 text-sm">Patent 3: Part-Time Agent System (PTAS)</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-green-50">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <div className="text-2xl mb-2">🤖</div>
                    <h4 className="font-bold text-black">Shared Part-Time Agents (310)</h4>
                    <p className="text-xs text-gray-600 mt-1">Multi-tenant agents serving users through time-slice scheduling.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <div className="text-2xl mb-2">🏢</div>
                    <h4 className="font-bold text-black">Enterprise Private Agents (320)</h4>
                    <p className="text-xs text-gray-600 mt-1">Dedicated agents with proprietary data isolation.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <div className="text-2xl mb-2">🌍</div>
                    <h4 className="font-bold text-black">Regional/Vertical Specialists (330)</h4>
                    <p className="text-xs text-gray-600 mt-1">Jurisdiction-specific expertise (Legal, Financial, Real Estate).</p>
                  </div>
                </div>

                {/* 5-State Lifecycle */}
                <div className="bg-gray-900 rounded-xl p-6">
                  <h4 className="text-white font-bold mb-4">5-State Agent Lifecycle (Patent 3)</h4>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-700 rounded-xl flex flex-col items-center justify-center mb-2">
                        <span className="text-2xl">💤</span>
                        <span className="text-xs text-gray-300 mt-1">&lt;5%</span>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">DORMANT</span>
                    </div>
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-yellow-600 rounded-xl flex flex-col items-center justify-center mb-2">
                        <span className="text-2xl">⚡</span>
                        <span className="text-xs text-yellow-200 mt-1">100-500ms</span>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">ACTIVATING</span>
                    </div>
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-600 rounded-xl flex flex-col items-center justify-center mb-2">
                        <span className="text-2xl">🟢</span>
                        <span className="text-xs text-green-200 mt-1">100%</span>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">ACTIVE</span>
                    </div>
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-600 rounded-xl flex flex-col items-center justify-center mb-2">
                        <span className="text-2xl">🔄</span>
                        <span className="text-xs text-blue-200 mt-1">Task</span>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">EXECUTING</span>
                    </div>
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-purple-600 rounded-xl flex flex-col items-center justify-center mb-2">
                        <span className="text-2xl">🧊</span>
                        <span className="text-xs text-purple-200 mt-1">~0%</span>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">HIBERNATING</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patent 2: Three-Phase Licensing */}
      <section className="py-12 px-8 bg-purple-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
              Patent 2
            </span>
            <h2 className="text-2xl font-bold text-black mt-4">Three-Phase Agent Licensing Pathway</h2>
            <p className="text-gray-600 mt-2">Professional licensing framework analogous to human professional certification</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Phase I */}
            <div className="bg-white rounded-xl border-2 border-purple-200 overflow-hidden">
              <div className="bg-purple-600 text-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-white text-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">I</span>
                  <h3 className="font-bold">Regulatory Certification</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span className="text-gray-700">Scenario-based legal reasoning tests</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span className="text-gray-700">Contradiction detection tasks</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span className="text-gray-700">Risk classification exercises</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span className="text-gray-700">Jurisdiction-specific assessment</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <div className="text-xs text-purple-600 font-medium">Output:</div>
                  <div className="text-sm text-purple-800 font-mono">Regulatory Readiness Credential</div>
                </div>
              </div>
            </div>

            {/* Phase II */}
            <div className="bg-white rounded-xl border-2 border-purple-200 overflow-hidden">
              <div className="bg-purple-600 text-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-white text-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">II</span>
                  <h3 className="font-bold">Human-Supervised Apprenticeship</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span className="text-gray-700">Paired with licensed human professionals</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span className="text-gray-700">Advisory mode only (no execution)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span className="text-gray-700">Every output reviewed & signed</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span className="text-gray-700">Immutable audit trail</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <div className="text-xs text-purple-600 font-medium">Requirements:</div>
                  <div className="text-sm text-purple-800">10-50 cases, &gt;85% score, 0 violations</div>
                </div>
              </div>
            </div>

            {/* Phase III */}
            <div className="bg-white rounded-xl border-2 border-purple-200 overflow-hidden">
              <div className="bg-purple-600 text-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-white text-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">III</span>
                  <h3 className="font-bold">Scoped License Issuance</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span className="text-gray-700">Jurisdiction boundaries defined</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span className="text-gray-700">Permitted/prohibited actions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span className="text-gray-700">Permission level assigned</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span className="text-gray-700">Insurance policy linked</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <div className="text-xs text-purple-600 font-medium">Permission Levels:</div>
                  <div className="flex gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">advisory</span>
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">execute+human</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">autonomous</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* License Object & Enforcement */}
      <section className="py-12 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* License Object */}
            <div>
              <h3 className="text-xl font-bold text-black mb-4">Scoped License Object (Patent 2)</h3>
              <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs overflow-x-auto">
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
  "trust_tier": "Verified",
  "valid_until": "2027-01-30"
}`}</pre>
              </div>
            </div>

            {/* Enforcement Flow */}
            <div>
              <h3 className="text-xl font-bold text-black mb-4">System-Level Enforcement (Patent 2)</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">1</span>
                  <div>
                    <div className="font-medium text-black">Action Interception (410)</div>
                    <div className="text-xs text-gray-600">All agent requests pass through enforcement layer</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">2</span>
                  <div>
                    <div className="font-medium text-black">License Validation (420)</div>
                    <div className="text-xs text-gray-600">Verify license scope, jurisdiction, insurance status</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center font-bold text-sm">3</span>
                  <div>
                    <div className="font-medium text-black">Authorization Decision (430)</div>
                    <div className="text-xs text-gray-600">Allow, block, or escalate to human</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-bold text-sm">!</span>
                  <div>
                    <div className="font-medium text-red-800">Emergency Override (440)</div>
                    <div className="text-xs text-red-600">Guardian agents intervene on dangerous behavior</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patent 3: PTAS Details */}
      <section className="py-12 px-8 bg-green-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              Patent 3
            </span>
            <h2 className="text-2xl font-bold text-black mt-4">Part-Time Agent System (PTAS)</h2>
            <p className="text-gray-600 mt-2">Shared economy framework for on-demand AI agent activation</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Time-Slice Scheduling */}
            <div className="bg-white rounded-xl p-6 border border-green-200">
              <h3 className="font-bold text-black mb-4 flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                Time-Slice Scheduling Engine
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-800 text-sm">Time Slices</div>
                  <div className="text-xs text-green-700 mt-1">
                    Short (100ms-1s): Simple queries<br/>
                    Medium (1s-10s): Standard tasks<br/>
                    Long (10s-60s): Complex operations
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-800 text-sm">Context Switching</div>
                  <div className="text-xs text-green-700 mt-1">
                    &lt;50ms between users with full security isolation
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-800 text-sm">Priority Scheduling</div>
                  <div className="text-xs text-green-700 mt-1">
                    Based on subscription tier, urgency, estimated time
                  </div>
                </div>
              </div>
            </div>

            {/* Capability Window */}
            <div className="bg-white rounded-xl p-6 border border-green-200">
              <h3 className="font-bold text-black mb-4 flex items-center gap-2">
                <span className="text-xl">📦</span>
                Capability Window Framework
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs">
                <pre className="text-green-400">{`{
  "capability_type": "legal_analysis",
  "duration": "30_minutes",
  "resource_limits": {
    "max_tokens": 100000,
    "max_api_calls": 50
  },
  "quality_tier": "premium",
  "window_state": "OPEN"
}`}</pre>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">RESERVED</span>
                <span className="text-gray-400">→</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">OPEN</span>
                <span className="text-gray-400">→</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">PAUSED</span>
                <span className="text-gray-400">→</span>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">EXHAUSTED</span>
              </div>
            </div>

            {/* Usage-Based Billing */}
            <div className="bg-white rounded-xl p-6 border border-green-200">
              <h3 className="font-bold text-black mb-4 flex items-center gap-2">
                <span className="text-xl">💵</span>
                Usage-Based Billing
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm text-gray-700">Per-Task</span>
                  <span className="text-xs text-green-700">Fixed cost per completed task</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm text-gray-700">Per-Minute</span>
                  <span className="text-xs text-green-700">Time-based during active use</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm text-gray-700">Subscription</span>
                  <span className="text-xs text-green-700">Monthly allocation + overage</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm text-gray-700">Hybrid</span>
                  <span className="text-xs text-green-700">Base subscription + usage</span>
                </div>
              </div>
            </div>

            {/* Quality Tiers */}
            <div className="bg-white rounded-xl p-6 border border-green-200">
              <h3 className="font-bold text-black mb-4 flex items-center gap-2">
                <span className="text-xl">🏆</span>
                Quality Tiers
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-2xl">🥉</span>
                  <div>
                    <div className="font-medium text-amber-800">Economy</div>
                    <div className="text-xs text-amber-700">Best-effort scheduling, no guarantees</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg border border-gray-300">
                  <span className="text-2xl">🥈</span>
                  <div>
                    <div className="font-medium text-gray-800">Standard</div>
                    <div className="text-xs text-gray-600">Guaranteed latency bounds</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-300">
                  <span className="text-2xl">🥇</span>
                  <div>
                    <div className="font-medium text-yellow-800">Premium</div>
                    <div className="text-xs text-yellow-700">Priority scheduling + dedicated resources</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Tiers */}
      <section className="py-12 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black">Trust Tiers (Patent 1)</h2>
            <p className="text-gray-600 mt-2">Progressive trust levels based on performance and verification</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="text-center p-4 bg-gray-100 rounded-xl border-2 border-gray-300 w-36">
              <div className="text-3xl mb-2">⚪</div>
              <div className="font-bold text-gray-700">Unverified</div>
              <div className="text-xs text-gray-500 mt-1">New agents</div>
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-300 w-36">
              <div className="text-3xl mb-2">🔵</div>
              <div className="font-bold text-blue-700">Basic</div>
              <div className="text-xs text-blue-500 mt-1">Identity verified</div>
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl border-2 border-green-300 w-36">
              <div className="text-3xl mb-2">🟢</div>
              <div className="font-bold text-green-700">Verified</div>
              <div className="text-xs text-green-500 mt-1">Apprenticeship done</div>
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl border-2 border-purple-300 w-36">
              <div className="text-3xl mb-2">🟣</div>
              <div className="font-bold text-purple-700">Premium</div>
              <div className="text-xs text-purple-500 mt-1">High performance</div>
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl border-2 border-yellow-400 w-36">
              <div className="text-3xl mb-2">⭐</div>
              <div className="font-bold text-yellow-700">Elite</div>
              <div className="text-xs text-yellow-600 mt-1">Third-party audited</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Experience the Architecture in Action
          </h2>
          <p className="text-gray-400 mb-8">
            See Butler Agent, Part-Time Agent lifecycle, and Licensing working together
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/use-cases" className="btn-secondary bg-white text-black hover:bg-gray-100">
              View Use Cases
            </Link>
            <Link href="/dashboard" className="btn-primary bg-purple-600 hover:bg-purple-700 border-purple-600">
              Launch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-8">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">
          <p>AIoOS - AI Onchain Operating System</p>
          <p className="mt-1 text-xs text-gray-500">
            USPTO Patent Applications: 63/971,567 • 63/971,570 • 63/971,575 | Filed 2026-01-30 | Invented by Ken Liao, FoodyePay Technology, Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
