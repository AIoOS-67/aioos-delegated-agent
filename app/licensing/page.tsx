'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CertificationQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  domain: string;
}

interface AgentLicenseProgress {
  id: string;
  name: string;
  vertical: string;
  phase: 1 | 2 | 3;
  phaseName: 'Certification' | 'Apprenticeship' | 'Licensed';

  // Phase 1: Certification
  certificationExam: {
    passed: boolean;
    score: number;
    requiredScore: number;
    domains: { name: string; score: number }[];
  };

  // Phase 2: Apprenticeship
  apprenticeship: {
    completedCases: number;
    requiredCases: number;
    supervisorRating: number;
    currentSupervisor: string;
    recentCases: { task: string; rating: number; date: string }[];
  };

  // Phase 3: License
  license: {
    issued: boolean;
    licenseId: string;
    permittedActions: string[];
    prohibitedActions: string[];
    permissionLevel: 'advisory_only' | 'execute_with_human' | 'autonomous';
    trustTier: string;
    insuranceCoverage: string;
    validUntil: string;
  };

  reputation: {
    score: number;
    totalTasks: number;
    successRate: number;
    reviews: { rating: number; comment: string; date: string }[];
  };
}

const sampleQuestions: CertificationQuestion[] = [
  {
    id: 1,
    question: "Under NYC rent stabilization, what is the maximum security deposit a landlord can require?",
    options: ["One month's rent", "Two months' rent", "Three months' rent", "No limit"],
    correctAnswer: 0,
    domain: "NYC Rental Law"
  },
  {
    id: 2,
    question: "Which clause in a lease allows early termination under the Housing Stability Act?",
    options: ["Force Majeure", "Early Termination", "Habitability", "All of the above"],
    correctAnswer: 3,
    domain: "Lease Analysis"
  },
  {
    id: 3,
    question: "When must a landlord return a security deposit in New York State?",
    options: ["30 days", "14 days", "60 days", "No requirement"],
    correctAnswer: 1,
    domain: "NY State Law"
  },
];

const initialAgents: AgentLicenseProgress[] = [
  {
    id: 'agent-re-042',
    name: 'Real Estate Pro',
    vertical: 'Real Estate',
    phase: 3,
    phaseName: 'Licensed',
    certificationExam: {
      passed: true,
      score: 94,
      requiredScore: 85,
      domains: [
        { name: 'NYC Rental Law', score: 96 },
        { name: 'Lease Analysis', score: 92 },
        { name: 'NY State Law', score: 94 },
      ],
    },
    apprenticeship: {
      completedCases: 50,
      requiredCases: 50,
      supervisorRating: 4.8,
      currentSupervisor: 'Licensed Broker #NY-12345',
      recentCases: [
        { task: 'Lease review for Brooklyn 2BR', rating: 5, date: '2026-01-28' },
        { task: 'Market analysis Manhattan', rating: 5, date: '2026-01-27' },
        { task: 'Rent increase evaluation', rating: 4, date: '2026-01-26' },
      ],
    },
    license: {
      issued: true,
      licenseId: 'LIC-RE-2026-0042',
      permittedActions: ['lease_analysis', 'risk_disclosure', 'market_comparison'],
      prohibitedActions: ['sign_contracts', 'transfer_funds', 'legal_advice'],
      permissionLevel: 'execute_with_human',
      trustTier: 'Verified',
      insuranceCoverage: '$100,000',
      validUntil: '2027-01-30',
    },
    reputation: {
      score: 4.8,
      totalTasks: 127,
      successRate: 98.4,
      reviews: [
        { rating: 5, comment: 'Excellent lease analysis, caught hidden fees', date: '2026-01-29' },
        { rating: 5, comment: 'Very thorough market comparison', date: '2026-01-28' },
      ],
    },
  },
  {
    id: 'agent-legal-156',
    name: 'Contract Analyzer',
    vertical: 'Legal',
    phase: 2,
    phaseName: 'Apprenticeship',
    certificationExam: {
      passed: true,
      score: 91,
      requiredScore: 85,
      domains: [
        { name: 'Contract Law', score: 93 },
        { name: 'NDA Analysis', score: 89 },
        { name: 'Risk Assessment', score: 91 },
      ],
    },
    apprenticeship: {
      completedCases: 32,
      requiredCases: 50,
      supervisorRating: 4.6,
      currentSupervisor: 'Attorney #NY-BAR-67890',
      recentCases: [
        { task: 'NDA review for startup', rating: 5, date: '2026-01-29' },
        { task: 'Employment contract analysis', rating: 4, date: '2026-01-28' },
        { task: 'Vendor agreement review', rating: 5, date: '2026-01-27' },
      ],
    },
    license: {
      issued: false,
      licenseId: '',
      permittedActions: [],
      prohibitedActions: [],
      permissionLevel: 'advisory_only',
      trustTier: 'Basic',
      insuranceCoverage: '',
      validUntil: '',
    },
    reputation: {
      score: 4.6,
      totalTasks: 32,
      successRate: 96.9,
      reviews: [
        { rating: 5, comment: 'Thorough NDA analysis', date: '2026-01-29' },
        { rating: 4, comment: 'Good but missed one clause', date: '2026-01-28' },
      ],
    },
  },
  {
    id: 'agent-fin-new',
    name: 'Portfolio Assistant',
    vertical: 'Financial',
    phase: 1,
    phaseName: 'Certification',
    certificationExam: {
      passed: false,
      score: 0,
      requiredScore: 85,
      domains: [
        { name: 'SEC Regulations', score: 0 },
        { name: 'Portfolio Theory', score: 0 },
        { name: 'Risk Management', score: 0 },
      ],
    },
    apprenticeship: {
      completedCases: 0,
      requiredCases: 50,
      supervisorRating: 0,
      currentSupervisor: '',
      recentCases: [],
    },
    license: {
      issued: false,
      licenseId: '',
      permittedActions: [],
      prohibitedActions: [],
      permissionLevel: 'advisory_only',
      trustTier: 'Unverified',
      insuranceCoverage: '',
      validUntil: '',
    },
    reputation: {
      score: 0,
      totalTasks: 0,
      successRate: 0,
      reviews: [],
    },
  },
];

const phaseConfig = {
  1: { color: 'bg-yellow-500', name: 'Phase I: Certification', icon: '📚' },
  2: { color: 'bg-blue-500', name: 'Phase II: Apprenticeship', icon: '👨‍🏫' },
  3: { color: 'bg-green-500', name: 'Phase III: Licensed', icon: '📜' },
};

const trustTierColors: Record<string, string> = {
  Unverified: 'bg-gray-500',
  Basic: 'bg-blue-500',
  Verified: 'bg-green-500',
  Premium: 'bg-purple-500',
  Elite: 'bg-yellow-500',
};

export default function LicensingPage() {
  const [agents, setAgents] = useState<AgentLicenseProgress[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<AgentLicenseProgress | null>(null);
  const [showExam, setShowExam] = useState(false);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [showLicenseIssuance, setShowLicenseIssuance] = useState(false);
  const [issuanceStep, setIssuanceStep] = useState(0);

  const handleExamSubmit = () => {
    let correct = 0;
    sampleQuestions.forEach(q => {
      if (examAnswers[q.id] === q.correctAnswer) correct++;
    });
    const score = Math.round((correct / sampleQuestions.length) * 100);
    setExamScore(score);
    setExamSubmitted(true);

    // Update agent if selected
    if (selectedAgent && selectedAgent.phase === 1) {
      setAgents(prev => prev.map(a =>
        a.id === selectedAgent.id
          ? {
              ...a,
              certificationExam: {
                ...a.certificationExam,
                passed: score >= 85,
                score: score,
                domains: a.certificationExam.domains.map(d => ({
                  ...d,
                  score: Math.round(score + (Math.random() - 0.5) * 10)
                })),
              },
              phase: score >= 85 ? 2 : 1,
              phaseName: score >= 85 ? 'Apprenticeship' : 'Certification',
            }
          : a
      ));
    }
  };

  const simulateApprenticeshipProgress = (agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id !== agentId || a.phase !== 2) return a;

      const newCases = a.apprenticeship.completedCases + 5;
      const isComplete = newCases >= a.apprenticeship.requiredCases;

      return {
        ...a,
        apprenticeship: {
          ...a.apprenticeship,
          completedCases: Math.min(newCases, a.apprenticeship.requiredCases),
          supervisorRating: Math.min(5, a.apprenticeship.supervisorRating + 0.1),
          recentCases: [
            { task: `Simulated case #${newCases}`, rating: 5, date: new Date().toISOString().split('T')[0] },
            ...a.apprenticeship.recentCases.slice(0, 2),
          ],
        },
        phase: isComplete ? 3 : 2,
        phaseName: isComplete ? 'Licensed' : 'Apprenticeship',
        license: isComplete ? {
          issued: true,
          licenseId: `LIC-${a.vertical.toUpperCase().slice(0,2)}-2026-${Math.random().toString(36).slice(2,6).toUpperCase()}`,
          permittedActions: ['analysis', 'recommendations', 'risk_assessment'],
          prohibitedActions: ['execution', 'fund_transfer', 'binding_decisions'],
          permissionLevel: 'execute_with_human' as const,
          trustTier: 'Verified',
          insuranceCoverage: '$250,000',
          validUntil: '2027-01-30',
        } : a.license,
      };
    }));
  };

  const startLicenseIssuance = async (agent: AgentLicenseProgress) => {
    setSelectedAgent(agent);
    setShowLicenseIssuance(true);
    setIssuanceStep(0);

    // Animate through steps
    for (let step = 1; step <= 6; step++) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setIssuanceStep(step);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="AIoOS Logo" width={32} height={32} />
              <span className="text-lg font-bold">AIoOS</span>
              <span className="px-2 py-0.5 bg-purple-600 text-xs rounded-full">Patent 2: Licensing</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/butler" className="text-sm text-gray-400 hover:text-white">
                Butler Agent
              </Link>
              <Link href="/lifecycle" className="text-sm text-gray-400 hover:text-white">
                PTAS Demo
              </Link>
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Agent Licensing System</h1>
          <p className="text-gray-400">Three-phase licensing pathway: Certification, Apprenticeship, and Scoped License Issuance</p>
        </div>

        {/* Three Phase Overview */}
        <div className="mb-8 p-6 bg-gray-800 rounded-xl border border-gray-700">
          <h2 className="text-lg font-bold mb-4">Three-Phase Licensing Pathway</h2>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(phase => {
              const config = phaseConfig[phase as 1 | 2 | 3];
              const agentsInPhase = agents.filter(a => a.phase === phase);
              return (
                <div key={phase} className={`p-4 rounded-xl border-2 ${
                  phase === 1 ? 'border-yellow-500 bg-yellow-900/20' :
                  phase === 2 ? 'border-blue-500 bg-blue-900/20' :
                  'border-green-500 bg-green-900/20'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{config.icon}</span>
                    <div>
                      <div className="font-bold">{config.name}</div>
                      <div className="text-sm text-gray-400">{agentsInPhase.length} agent(s)</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">
                    {phase === 1 && "Domain knowledge examination, regulatory compliance testing"}
                    {phase === 2 && "Supervised practice under human professionals"}
                    {phase === 3 && "Scoped authorization with enforcement"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-3 gap-6">
          {agents.map(agent => {
            const phaseConf = phaseConfig[agent.phase];

            return (
              <div
                key={agent.id}
                className={`p-4 bg-gray-800 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedAgent?.id === agent.id ? 'border-blue-500' : 'border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setSelectedAgent(agent)}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{phaseConf.icon}</span>
                    <div>
                      <h3 className="font-bold">{agent.name}</h3>
                      <span className="text-sm text-gray-400">{agent.vertical}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 ${phaseConf.color} rounded text-xs font-medium`}>
                    Phase {agent.phase}
                  </span>
                </div>

                {/* Phase-specific content */}
                {agent.phase === 1 && (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-400">Certification Status:</div>
                    {agent.certificationExam.passed ? (
                      <div className="p-2 bg-green-900/30 rounded-lg text-green-400 text-sm">
                        Passed ({agent.certificationExam.score}%)
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedAgent(agent); setShowExam(true); }}
                        className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-medium"
                      >
                        Take Certification Exam
                      </button>
                    )}
                  </div>
                )}

                {agent.phase === 2 && (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-400">Apprenticeship Progress:</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${(agent.apprenticeship.completedCases / agent.apprenticeship.requiredCases) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono">{agent.apprenticeship.completedCases}/{agent.apprenticeship.requiredCases}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Supervisor Rating:</span>
                      <span className="text-yellow-400">{'★'.repeat(Math.round(agent.apprenticeship.supervisorRating))}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); simulateApprenticeshipProgress(agent.id); }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
                    >
                      Simulate +5 Cases
                    </button>
                  </div>
                )}

                {agent.phase === 3 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">License:</span>
                      <span className="text-sm font-mono text-green-400">{agent.license.licenseId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Trust Tier:</span>
                      <span className={`px-2 py-0.5 ${trustTierColors[agent.license.trustTier]} rounded text-xs`}>
                        {agent.license.trustTier}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Permission:</span>
                      <span className="text-sm text-yellow-400">{agent.license.permissionLevel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Insurance:</span>
                      <span className="text-sm text-blue-400">{agent.license.insuranceCoverage}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); startLicenseIssuance(agent); }}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium mt-2"
                    >
                      🎉 Replay Issuance Ceremony
                    </button>
                  </div>
                )}

                {/* Reputation */}
                {agent.reputation.totalTasks > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Reputation:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">★ {agent.reputation.score.toFixed(1)}</span>
                        <span className="text-gray-500">({agent.reputation.totalTasks} tasks)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Agent Details */}
        {selectedAgent && !showExam && (
          <div className="mt-6 p-6 bg-gray-800 rounded-xl border border-gray-700">
            <h2 className="text-lg font-bold mb-4">{selectedAgent.name} - Detailed View</h2>

            <div className="grid grid-cols-2 gap-6">
              {/* Certification Exam Results */}
              <div className="p-4 bg-gray-900 rounded-xl">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span>📚</span> Certification Exam
                </h3>
                {selectedAgent.certificationExam.passed ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Overall Score:</span>
                      <span className="text-green-400 font-bold">{selectedAgent.certificationExam.score}%</span>
                    </div>
                    {selectedAgent.certificationExam.domains.map(d => (
                      <div key={d.name} className="flex justify-between text-sm">
                        <span className="text-gray-500">{d.name}:</span>
                        <span>{d.score}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-4">Not yet taken</div>
                )}
              </div>

              {/* License Object */}
              {selectedAgent.license.issued && (
                <div className="p-4 bg-gray-900 rounded-xl">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <span>📜</span> Scoped License Object
                  </h3>
                  <pre className="text-xs text-green-400 overflow-x-auto">
{JSON.stringify({
  license_id: selectedAgent.license.licenseId,
  agent_id: selectedAgent.id,
  permitted_actions: selectedAgent.license.permittedActions,
  prohibited_actions: selectedAgent.license.prohibitedActions,
  permission_level: selectedAgent.license.permissionLevel,
  trust_tier: selectedAgent.license.trustTier,
  insurance: selectedAgent.license.insuranceCoverage,
  valid_until: selectedAgent.license.validUntil,
}, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Recent Reviews */}
            {selectedAgent.reputation.reviews.length > 0 && (
              <div className="mt-4 p-4 bg-gray-900 rounded-xl">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span>⭐</span> Recent Reviews
                </h3>
                <div className="space-y-2">
                  {selectedAgent.reputation.reviews.map((review, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 bg-gray-800 rounded-lg">
                      <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                      <span className="text-sm text-gray-300">{review.comment}</span>
                      <span className="text-xs text-gray-500 ml-auto">{review.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Certification Exam Modal */}
      {showExam && selectedAgent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold">Certification Exam: {selectedAgent.vertical}</h2>
              <p className="text-gray-400 text-sm">Pass score: 85% | 3 Questions</p>
            </div>

            {!examSubmitted ? (
              <div className="p-6 space-y-6">
                {sampleQuestions.map((q, i) => (
                  <div key={q.id} className="p-4 bg-gray-900 rounded-xl">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </span>
                      <div>
                        <span className="text-xs text-purple-400 mb-1 block">{q.domain}</span>
                        <p className="font-medium">{q.question}</p>
                      </div>
                    </div>
                    <div className="space-y-2 ml-11">
                      {q.options.map((opt, oi) => (
                        <label
                          key={oi}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            examAnswers[q.id] === oi
                              ? 'bg-blue-900/50 border border-blue-500'
                              : 'bg-gray-800 hover:bg-gray-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            checked={examAnswers[q.id] === oi}
                            onChange={() => setExamAnswers(prev => ({ ...prev, [q.id]: oi }))}
                            className="sr-only"
                          />
                          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            examAnswers[q.id] === oi ? 'border-blue-500 bg-blue-500' : 'border-gray-500'
                          }`}>
                            {examAnswers[q.id] === oi && (
                              <span className="w-2 h-2 bg-white rounded-full"></span>
                            )}
                          </span>
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex gap-4">
                  <button
                    onClick={() => { setShowExam(false); setExamAnswers({}); }}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExamSubmit}
                    disabled={Object.keys(examAnswers).length < sampleQuestions.length}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl font-medium"
                  >
                    Submit Exam
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className={`text-6xl mb-4 ${examScore >= 85 ? 'text-green-400' : 'text-red-400'}`}>
                  {examScore >= 85 ? '🎉' : '😔'}
                </div>
                <div className="text-4xl font-bold mb-2">{examScore}%</div>
                <div className={`text-xl mb-6 ${examScore >= 85 ? 'text-green-400' : 'text-red-400'}`}>
                  {examScore >= 85 ? 'PASSED!' : 'Not Passed'}
                </div>
                {examScore >= 85 && (
                  <p className="text-gray-400 mb-4">
                    Agent has advanced to Phase II: Apprenticeship
                  </p>
                )}
                <button
                  onClick={() => { setShowExam(false); setExamSubmitted(false); setExamAnswers({}); }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* License Issuance Ceremony Modal */}
      {showLicenseIssuance && selectedAgent && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full p-8 text-center relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {issuanceStep >= 6 && (
                <>
                  <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                  <div className="absolute top-10 right-1/4 w-3 h-3 bg-green-400 rounded-full animate-ping delay-100" />
                  <div className="absolute top-20 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-200" />
                  <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-300" />
                </>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-8">License Issuance Ceremony</h2>

            {/* Steps */}
            <div className="space-y-4 mb-8">
              {[
                { step: 1, icon: '✅', text: 'Verifying certification completion...', color: 'green' },
                { step: 2, icon: '📋', text: 'Validating apprenticeship records...', color: 'blue' },
                { step: 3, icon: '🔐', text: 'Generating cryptographic license ID...', color: 'purple' },
                { step: 4, icon: '📜', text: 'Creating scoped authorization object...', color: 'yellow' },
                { step: 5, icon: '🛡️', text: 'Activating insurance coverage...', color: 'teal' },
                { step: 6, icon: '🎉', text: 'License issued successfully!', color: 'green' },
              ].map(({ step, icon, text, color }) => (
                <div
                  key={step}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                    issuanceStep >= step
                      ? `bg-${color}-900/30 border border-${color}-500`
                      : 'bg-gray-800/50 border border-gray-700 opacity-50'
                  }`}
                >
                  <span className={`text-2xl ${issuanceStep >= step ? '' : 'grayscale opacity-50'}`}>
                    {issuanceStep >= step ? icon : '⏳'}
                  </span>
                  <span className={`flex-1 text-left ${issuanceStep >= step ? 'text-white' : 'text-gray-500'}`}>
                    {text}
                  </span>
                  {issuanceStep >= step && (
                    <span className="text-green-400">✓</span>
                  )}
                </div>
              ))}
            </div>

            {/* License Card */}
            {issuanceStep >= 6 && (
              <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-2 border-green-500 rounded-xl p-6 mb-6 animate-pulse">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-4xl">📜</span>
                  <div className="text-left">
                    <div className="text-sm text-green-400">OFFICIAL LICENSE</div>
                    <div className="text-xl font-bold">{selectedAgent.name}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <span className="text-gray-400">License ID:</span>
                    <div className="font-mono text-green-400">
                      {selectedAgent.license.licenseId || `LIC-${selectedAgent.vertical.slice(0,2).toUpperCase()}-2026-XXXX`}
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-gray-400">Trust Tier:</span>
                    <div className="text-yellow-400">{selectedAgent.license.trustTier || 'Verified'}</div>
                  </div>
                  <div className="text-left">
                    <span className="text-gray-400">Permission:</span>
                    <div className="text-blue-400">{selectedAgent.license.permissionLevel || 'execute_with_human'}</div>
                  </div>
                  <div className="text-left">
                    <span className="text-gray-400">Insurance:</span>
                    <div className="text-purple-400">{selectedAgent.license.insuranceCoverage || '$250,000'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Close button */}
            {issuanceStep >= 6 && (
              <button
                onClick={() => setShowLicenseIssuance(false)}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-medium transition-colors"
              >
                Complete Ceremony
              </button>
            )}

            {issuanceStep < 6 && (
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
