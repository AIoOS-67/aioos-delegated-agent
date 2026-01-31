'use client';

import Image from 'next/image';
import Link from 'next/link';

const useCases = [
  {
    id: 1,
    title: 'Real Estate Agent Licensing',
    icon: '🏠',
    vertical: 'Real Estate',
    jurisdiction: ['NYC', 'NY_State'],
    scenario: 'AI-Powered Lease Analysis with Human Oversight',
    problem: 'Real estate transactions require specialized local knowledge. An AI making lease recommendations without proper licensing could expose users to legal liability.',
    solution: 'AIoOS ensures the Real Estate Agent completes regulatory certification for NY State, serves 47 supervised cases under a licensed broker, and operates with execute_with_human permission requiring broker approval for all recommendations.',
    patents_applied: [
      { id: 'P1', name: 'Butler Agent routes request to qualified Real Estate specialist' },
      { id: 'P2', name: '3-phase licensing ensures agent knows NY rental laws' },
      { id: 'P3', name: 'Agent activates from DORMANT only when needed' },
    ],
    license_preview: {
      agent_id: 'did:aioos:agent:re-042',
      license_type: 'RealEstate',
      jurisdiction: ['NYC', 'NY_State'],
      permitted_actions: ['lease_analysis', 'risk_disclosure', 'market_comparison'],
      prohibited_actions: ['sign_contracts', 'transfer_funds', 'legal_advice'],
      permission_level: 'execute_with_human',
      trust_tier: 'Verified',
      insurance_coverage: '$100,000',
    },
    demo_flow: [
      'User asks Butler: "Review this lease for my Brooklyn apartment"',
      'Butler identifies need for Real Estate Agent with NYC jurisdiction',
      'Agent-RE-042 activates (DORMANT → ACTIVE in 180ms)',
      'Agent analyzes lease, identifies penalty clause risk',
      'System flags for human broker review (execute_with_human)',
      'Broker approves, user receives report',
      'Agent returns to DORMANT state',
    ],
  },
  {
    id: 2,
    title: 'Financial Advisor Compliance',
    icon: '💰',
    vertical: 'Financial',
    jurisdiction: ['US_Federal', 'SEC_Registered'],
    scenario: 'Investment Analysis with Regulatory Compliance',
    problem: 'Financial advice is heavily regulated. AI providing investment recommendations without proper compliance could violate SEC regulations and harm users.',
    solution: 'AIoOS Financial Agents must pass regulatory knowledge certification including SEC rules, complete 50-case apprenticeship under a registered investment advisor, and maintain insurance coverage. High-risk recommendations auto-escalate to human advisors.',
    patents_applied: [
      { id: 'P1', name: 'Discovery Engine matches user with SEC-compliant agent' },
      { id: 'P2', name: 'Apprenticeship under RIA ensures compliance knowledge' },
      { id: 'P3', name: 'Time-slice scheduling serves multiple clients efficiently' },
    ],
    license_preview: {
      agent_id: 'did:aioos:agent:fin-089',
      license_type: 'FinancialAdvisor',
      jurisdiction: ['US_Federal', 'SEC_Registered'],
      permitted_actions: ['portfolio_analysis', 'risk_assessment', 'market_research'],
      prohibited_actions: ['execute_trades', 'transfer_funds', 'tax_advice'],
      permission_level: 'advisory_only',
      trust_tier: 'Premium',
      insurance_coverage: '$500,000',
    },
    demo_flow: [
      'User asks: "Should I rebalance my 401k?"',
      'Butler routes to Financial Agent with SEC compliance',
      'Agent operates in advisory_only mode (no execution)',
      'Analysis shows high risk concentration',
      'Agent provides recommendations, NOT execution',
      'User must act with their own broker',
      'Full audit trail for compliance',
    ],
  },
  {
    id: 3,
    title: 'Legal Document Analysis',
    icon: '⚖️',
    vertical: 'Legal',
    jurisdiction: ['NY_State_Bar', 'Contract_Law'],
    scenario: 'Contract Review with Attorney Supervision',
    problem: 'Legal advice can only be given by licensed attorneys. AI analyzing contracts without proper supervision could constitute unauthorized practice of law.',
    solution: 'AIoOS Legal Agents operate strictly in advisory mode during apprenticeship, with every output reviewed and digitally signed by supervising attorneys. legal_advice is explicitly prohibited; only analysis and summarization are permitted.',
    patents_applied: [
      { id: 'P1', name: 'Reputation system tracks attorney satisfaction scores' },
      { id: 'P2', name: 'Guardian Agent intervenes if agent attempts legal advice' },
      { id: 'P3', name: 'Capability Window limits analysis to 30-minute sessions' },
    ],
    license_preview: {
      agent_id: 'did:aioos:agent:legal-156',
      license_type: 'LegalAnalysis',
      jurisdiction: ['NY_State_Bar', 'Contract_Law'],
      permitted_actions: ['document_summarization', 'clause_extraction', 'risk_flagging'],
      prohibited_actions: ['legal_advice', 'court_filing', 'client_representation'],
      permission_level: 'advisory_only',
      trust_tier: 'Verified',
      insurance_coverage: '$250,000',
    },
    demo_flow: [
      'Attorney asks: "Summarize key risks in this NDA"',
      'Butler routes to Legal Agent (Contract_Law specialty)',
      'Agent extracts clauses, flags non-compete duration',
      'Output marked: "ANALYSIS ONLY - NOT LEGAL ADVICE"',
      'Supervising attorney reviews and signs',
      'Immutable audit trail created on blockchain',
      'Capability Window closes after 30 minutes',
    ],
  },
  {
    id: 4,
    title: 'Enterprise Agent Deployment',
    icon: '🏢',
    vertical: 'Enterprise',
    jurisdiction: ['Private_Deployment'],
    scenario: 'Private Agent Pool with Data Isolation',
    problem: 'Enterprises need AI agents that understand proprietary processes but cannot risk data leakage to shared agents serving competitors.',
    solution: 'AIoOS Enterprise tier provides dedicated agent instances with proprietary data isolation. Agents are trained on company-specific knowledge and never shared with other tenants. Enterprise admins control all licensing and permissions.',
    patents_applied: [
      { id: 'P1', name: 'Enterprise-Consumer Segmentation provides isolation' },
      { id: 'P2', name: 'Company controls internal agent licensing' },
      { id: 'P3', name: 'Enterprise Private Agents (320) with dedicated resources' },
    ],
    license_preview: {
      agent_id: 'did:aioos:enterprise:acme-001',
      license_type: 'EnterpriseDedicated',
      jurisdiction: ['ACME_Corp_Internal'],
      permitted_actions: ['all_internal_operations'],
      prohibited_actions: ['external_communication', 'data_export'],
      permission_level: 'autonomous',
      trust_tier: 'Elite',
      insurance_coverage: '$1,000,000',
    },
    demo_flow: [
      'ACME Corp deploys private Legal Agent',
      'Agent trained on ACME contract templates',
      'Employee asks about internal policy',
      'Agent responds using proprietary knowledge',
      'Zero data shared with public agent pool',
      'Enterprise admin monitors via dashboard',
      'Autonomous operation within company scope',
    ],
  },
];

export default function UseCasesPage() {
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
              <Link href="/architecture" className="text-gray-700 hover:text-black transition-colors">
                Architecture
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
              Real-World Applications
            </span>
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">
            Use Cases
          </h1>
          <p className="text-xl text-gray-700">
            See how the three AIoOS patents work together in professional domains
          </p>
        </div>
      </section>

      {/* Patent Legend */}
      <section className="py-6 px-8 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">P1</span>
              <span className="text-sm text-gray-700">AIoOS Platform (Butler, Discovery, Settlement)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">P2</span>
              <span className="text-sm text-gray-700">Agent Licensing (Certification, Apprenticeship)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">P3</span>
              <span className="text-sm text-gray-700">Part-Time Agent (Lifecycle, Scheduling)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          {useCases.map((useCase) => (
            <div key={useCase.id} className="border-2 border-gray-200 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gray-900 text-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{useCase.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded font-mono">
                          {useCase.vertical}
                        </span>
                        {useCase.jurisdiction.map((j) => (
                          <span key={j} className="px-2 py-0.5 bg-blue-900 text-blue-300 text-xs rounded">
                            {j}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-xl font-bold">{useCase.title}</h2>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Use Case #{useCase.id}</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Scenario */}
                <div className="mb-6">
                  <h3 className="font-bold text-black mb-2">{useCase.scenario}</h3>
                </div>

                {/* Problem & Solution */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                      <span>❌</span> Problem
                    </h4>
                    <p className="text-sm text-red-700">{useCase.problem}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                      <span>✓</span> AIoOS Solution
                    </h4>
                    <p className="text-sm text-green-700">{useCase.solution}</p>
                  </div>
                </div>

                {/* Patents Applied */}
                <div className="mb-6">
                  <h4 className="font-bold text-black mb-3">Patents Applied</h4>
                  <div className="space-y-2">
                    {useCase.patents_applied.map((patent) => (
                      <div key={patent.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                          patent.id === 'P1' ? 'bg-blue-600' :
                          patent.id === 'P2' ? 'bg-purple-600' : 'bg-green-600'
                        }`}>
                          {patent.id}
                        </span>
                        <span className="text-sm text-gray-700">{patent.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Two Column: License & Demo Flow */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* License Preview */}
                  <div>
                    <h4 className="font-bold text-black mb-3">License Object</h4>
                    <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs overflow-x-auto">
                      <pre className="text-green-400">{JSON.stringify(useCase.license_preview, null, 2)}</pre>
                    </div>
                  </div>

                  {/* Demo Flow */}
                  <div>
                    <h4 className="font-bold text-black mb-3">Demo Flow</h4>
                    <div className="space-y-2">
                      {useCase.demo_flow.map((step, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-gray-200 text-gray-600 rounded flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-sm text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vertical Coverage */}
      <section className="py-12 px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-black mb-8 text-center">
            Vertical & Regional Coverage (Patent 1)
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { name: 'Legal', icon: '⚖️', regions: ['NY Bar', 'CA Bar', 'TX Bar'] },
              { name: 'Financial', icon: '💰', regions: ['SEC', 'FINRA', 'State'] },
              { name: 'Real Estate', icon: '🏠', regions: ['NYC', 'LA', 'Miami'] },
              { name: 'Healthcare', icon: '🏥', regions: ['HIPAA', 'State Med'] },
              { name: 'Technical', icon: '💻', regions: ['Global', 'Enterprise'] },
            ].map((vertical) => (
              <div key={vertical.name} className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <div className="text-3xl mb-2">{vertical.icon}</div>
                <h3 className="font-bold text-black mb-2">{vertical.name}</h3>
                <div className="space-y-1">
                  {vertical.regions.map((r) => (
                    <span key={r} className="block text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Experience These Use Cases Live
          </h2>
          <p className="text-gray-400 mb-8">
            Try the interactive demo to see Butler Agent, Licensing, and Part-Time Agent lifecycle in action
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/architecture" className="btn-secondary bg-white text-black hover:bg-gray-100">
              View Architecture
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
