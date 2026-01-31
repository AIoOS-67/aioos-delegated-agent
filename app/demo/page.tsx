'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface DemoStep {
  id: number;
  title: string;
  patent: string;
  patentNum: number;
  description: string;
  features: string[];
  demoLink: string;
  icon: string;
  color: string;
}

const demoSteps: DemoStep[] = [
  {
    id: 1,
    title: 'Butler Agent Interface',
    patent: 'AIoOS Platform',
    patentNum: 1,
    description: 'Experience the single entry point to the AI agent ecosystem. The Butler Agent interprets your requests, discovers qualified agents, and orchestrates task execution.',
    features: [
      'Natural language task interpretation',
      'Agent Discovery Engine with fitness scoring',
      'License verification before execution',
      'Real-time agent pool monitoring',
    ],
    demoLink: '/butler',
    icon: '🎩',
    color: 'purple',
  },
  {
    id: 2,
    title: 'Three-Phase Licensing',
    patent: 'Agent Licensing System',
    patentNum: 2,
    description: 'Watch agents progress through the certification, apprenticeship, and licensing pathway. Take the exam, simulate apprenticeship cases, and witness the license issuance ceremony.',
    features: [
      'Interactive certification exam',
      'Apprenticeship progress tracking',
      'Supervisor rating system',
      'License issuance ceremony animation',
    ],
    demoLink: '/licensing',
    icon: '📜',
    color: 'blue',
  },
  {
    id: 3,
    title: 'Part-Time Agent System',
    patent: 'PTAS',
    patentNum: 3,
    description: 'Visualize the 5-state lifecycle, time-slice scheduling, and capability windows. See how agents activate on-demand and return to dormant states to minimize costs.',
    features: [
      '5-state lifecycle visualization',
      'CPU/Memory resource meters',
      'Capability window countdown',
      'Usage-based billing tracker',
    ],
    demoLink: '/lifecycle',
    icon: '🔄',
    color: 'green',
  },
];

const patentSummaries = [
  {
    num: 1,
    title: 'AIoOS Platform',
    icon: '🌐',
    components: ['Butler Agent (100)', 'Discovery Engine (200)', 'Settlement Layer (300)'],
    innovation: 'Single persistent Butler Agent as universal entry point with intelligent agent discovery and smart contract settlement',
  },
  {
    num: 2,
    title: 'Agent Licensing',
    icon: '📜',
    components: ['Certification (I)', 'Apprenticeship (II)', 'Scoped License (III)'],
    innovation: 'Three-phase pathway ensuring agent competency with human-supervised apprenticeship and system-level enforcement',
  },
  {
    num: 3,
    title: 'Part-Time Agent (PTAS)',
    icon: '⏱️',
    components: ['5-State Lifecycle', 'Time-Slice Scheduling', 'Capability Windows'],
    innovation: 'Shared economy model for AI agents with on-demand activation, resource optimization, and usage-based billing',
  },
];

export default function DemoPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [showPatentDetails, setShowPatentDetails] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="AIoOS Logo" width={32} height={32} />
              <span className="text-lg font-bold">AIoOS</span>
              <span className="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-blue-600 text-xs rounded-full">
                Interactive Demo
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/pitch" className="text-sm text-yellow-400 hover:text-yellow-300">
                Pitch Deck
              </Link>
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
                Dashboard
              </Link>
              <Link href="/architecture" className="text-sm text-gray-400 hover:text-white">
                Architecture
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-500 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex justify-center gap-2 mb-4">
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-medium rounded-full border border-yellow-500/30">
              Hackathon Demo
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full border border-blue-500/30">
              3 Provisional Patents
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AIoOS: AI Agent Operating System
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            The first shared economy platform for AI Agents. Experience all three patented innovations in this interactive demo.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/butler"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <span>🎩</span> Start with Butler Agent
            </Link>
            <button
              onClick={() => setShowPatentDetails(!showPatentDetails)}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors"
            >
              {showPatentDetails ? 'Hide' : 'View'} Patent Summary
            </button>
          </div>
        </div>
      </section>

      {/* Patent Summary Cards (Collapsible) */}
      {showPatentDetails && (
        <section className="py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4">
              {patentSummaries.map((patent) => (
                <div key={patent.num} className="p-5 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{patent.icon}</span>
                    <div>
                      <span className="text-xs text-gray-400">Patent {patent.num}</span>
                      <h3 className="font-bold">{patent.title}</h3>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    {patent.components.map((comp, i) => (
                      <div key={i} className="text-sm text-gray-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        {comp}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">{patent.innovation}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Demo Steps */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Interactive Demo Walkthrough</h2>

          {/* Step Navigation */}
          <div className="flex justify-center gap-4 mb-8">
            {demoSteps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  activeStep === i
                    ? `bg-${step.color}-600 text-white`
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span>{step.icon}</span>
                <span className="hidden sm:inline">Patent {step.patentNum}</span>
              </button>
            ))}
          </div>

          {/* Active Step Card */}
          {demoSteps.map((step, i) => (
            <div
              key={step.id}
              className={`transition-all duration-300 ${
                activeStep === i ? 'opacity-100' : 'hidden opacity-0'
              }`}
            >
              <div className={`p-8 rounded-2xl border-2 bg-gradient-to-br from-gray-800 to-gray-900 ${
                step.color === 'purple' ? 'border-purple-500' :
                step.color === 'blue' ? 'border-blue-500' : 'border-green-500'
              }`}>
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left: Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-5xl">{step.icon}</span>
                      <div>
                        <span className={`text-sm ${
                          step.color === 'purple' ? 'text-purple-400' :
                          step.color === 'blue' ? 'text-blue-400' : 'text-green-400'
                        }`}>Patent {step.patentNum}: {step.patent}</span>
                        <h3 className="text-2xl font-bold">{step.title}</h3>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-6">{step.description}</p>

                    <div className="space-y-2 mb-6">
                      {step.features.map((feature, fi) => (
                        <div key={fi} className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            step.color === 'purple' ? 'bg-purple-600' :
                            step.color === 'blue' ? 'bg-blue-600' : 'bg-green-600'
                          }`}>✓</span>
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={step.demoLink}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                        step.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                        step.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                        'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      Launch Demo
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>

                  {/* Right: Preview */}
                  <div className="flex-1">
                    <div className={`aspect-video rounded-xl border overflow-hidden ${
                      step.color === 'purple' ? 'border-purple-500/30 bg-purple-900/20' :
                      step.color === 'blue' ? 'border-blue-500/30 bg-blue-900/20' :
                      'border-green-500/30 bg-green-900/20'
                    }`}>
                      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                        <span className="text-6xl mb-4">{step.icon}</span>
                        <p className="text-gray-400 text-sm">
                          Click "Launch Demo" to experience the interactive {step.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {demoSteps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeStep === i
                    ? `${step.color === 'purple' ? 'bg-purple-500' :
                        step.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'} scale-125`
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-6">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/butler" className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-center transition-colors">
              <span className="text-2xl block mb-2">🎩</span>
              <span className="text-sm">Butler Agent</span>
            </Link>
            <Link href="/licensing" className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-center transition-colors">
              <span className="text-2xl block mb-2">📜</span>
              <span className="text-sm">Licensing</span>
            </Link>
            <Link href="/lifecycle" className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-center transition-colors">
              <span className="text-2xl block mb-2">🔄</span>
              <span className="text-sm">PTAS Demo</span>
            </Link>
            <Link href="/architecture" className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-center transition-colors">
              <span className="text-2xl block mb-2">🏗️</span>
              <span className="text-sm">Architecture</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800 text-center">
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-400 mb-2">AIoOS - AI Onchain Operating System</p>
          <p className="text-sm text-gray-600">
            USPTO Patent Applications: 63/971,567 • 63/971,570 • 63/971,575 | Filed 2026-01-30 | Invented by Ken Liao, FoodyePay Technology, Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
