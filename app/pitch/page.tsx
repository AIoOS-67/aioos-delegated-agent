'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    type: 'title',
    title: 'AIoOS',
    subtitle: 'AI Agent Scheduling & Settlement Operating System',
    tagline: 'The First Shared Economy Platform for AI Agents',
    badges: ['3 USPTO Patent Applications Filed', '2026-01-30'],
    patentNotice: 'Patent-Pending Technologies: USPTO 63/971,567 • 63/971,570 • 63/971,575',
  },
  {
    id: 2,
    type: 'problem',
    title: 'The Problem',
    points: [
      {
        icon: '😰',
        title: 'Trust Crisis',
        description: 'How do you trust AI advice in legal, financial, or medical domains?',
      },
      {
        icon: '💸',
        title: 'Cost Inefficiency',
        description: 'Running dedicated AI agents 24/7 is expensive and wasteful',
      },
      {
        icon: '🔒',
        title: 'No Accountability',
        description: 'AI systems lack licensing, insurance, or professional oversight',
      },
      {
        icon: '🏝️',
        title: 'Fragmented Access',
        description: 'Users must navigate multiple AI tools with no unified interface',
      },
    ],
  },
  {
    id: 3,
    type: 'solution',
    title: 'Our Solution: AIoOS',
    analogy: {
      title: 'The Uber Model for AI',
      comparisons: [
        { industry: 'Transportation', before: 'Own a car', after: 'Uber', icon: '🚗' },
        { industry: 'Accommodation', before: 'Own property', after: 'Airbnb', icon: '🏠' },
        { industry: 'AI Capabilities', before: 'Own AI agents', after: 'AIoOS', icon: '🤖' },
      ],
    },
  },
  {
    id: 4,
    type: 'patents',
    title: '3 USPTO Patent Applications',
    patents: [
      {
        num: 1,
        name: 'PTAS',
        fullName: 'Part-Time Agent System',
        icon: '⏱️',
        color: 'green',
        usptoNum: '63/971,567',
        features: ['5-State Lifecycle', 'Time-Slice Scheduling', 'Capability Windows'],
        innovation: 'Shared economy resource optimization',
        demo: '/lifecycle',
      },
      {
        num: 2,
        name: 'AIoOS Platform',
        fullName: 'AI Agent Scheduling & Settlement OS',
        icon: '🌐',
        color: 'purple',
        usptoNum: '63/971,570',
        features: ['Butler Agent Interface', 'Discovery Engine', 'Smart Contract Settlement'],
        innovation: 'Single entry point with intelligent agent matching',
        demo: '/butler',
      },
      {
        num: 3,
        name: 'Agent Licensing',
        fullName: 'Licensing, Apprenticeship & Authorization',
        icon: '📜',
        color: 'blue',
        usptoNum: '63/971,575',
        features: ['Certification Exam', 'Supervised Apprenticeship', 'Scoped Authorization'],
        innovation: 'Professional licensing for AI agents',
        demo: '/licensing',
      },
    ],
  },
  {
    id: 5,
    type: 'architecture',
    title: 'Three-Layer Architecture',
    layers: [
      {
        name: 'User Layer (L1)',
        color: 'blue',
        components: ['Consumer Apps', 'Enterprise Dashboards', 'API Access'],
      },
      {
        name: 'OS Orchestration (L2)',
        color: 'purple',
        components: ['Butler Agent', 'Discovery Engine', 'License Registry', 'Settlement'],
      },
      {
        name: 'Agent Execution (L3)',
        color: 'green',
        components: ['Agent Pool', 'PTAS Scheduler', 'Capability Windows', 'Billing'],
      },
    ],
  },
  {
    id: 6,
    type: 'demo',
    title: 'Live Demo',
    demos: [
      { name: 'Butler Agent', path: '/butler', icon: '🎩', desc: 'Chat with AI orchestrator' },
      { name: 'Licensing', path: '/licensing', icon: '📜', desc: 'Watch agent certification' },
      { name: 'PTAS', path: '/lifecycle', icon: '🔄', desc: 'See 5-state lifecycle' },
    ],
  },
  {
    id: 7,
    type: 'market',
    title: 'Market Opportunity',
    stats: [
      { value: '$407B', label: 'AI Market by 2027', source: 'Gartner' },
      { value: '85%', label: 'Enterprises adopting AI agents', source: 'McKinsey' },
      { value: '10x', label: 'Growth in AI agent tools', source: '2025-2026' },
    ],
    verticals: ['Legal', 'Financial', 'Real Estate', 'Healthcare', 'Enterprise'],
  },
  {
    id: 8,
    type: 'team',
    title: 'Team',
    members: [
      {
        name: 'Ken Liao',
        role: 'Inventor & Founder',
        company: 'FoodyePay Technology, Inc.',
      },
    ],
    achievements: [
      '3 Provisional Patents Filed',
      'Full Working Demo Built',
      'USPTO Filing: 2026-01-30',
    ],
  },
  {
    id: 9,
    type: 'cta',
    title: 'Try AIoOS Today',
    subtitle: 'Experience the future of AI agent orchestration',
    buttons: [
      { label: 'Launch Demo', path: '/demo', primary: true },
      { label: 'View Architecture', path: '/architecture', primary: false },
    ],
  },
];

export default function PitchPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'f') {
        setIsFullscreen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const slide = slides[currentSlide];

  const renderSlide = () => {
    switch (slide.type) {
      case 'title':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Image src="/logo.png" alt="AIoOS Logo" width={120} height={120} className="mb-6" />
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {slide.title}
            </h1>
            <p className="text-2xl text-gray-300 mb-4">{slide.subtitle}</p>
            <p className="text-xl text-purple-400 mb-6">{slide.tagline}</p>
            <div className="flex gap-3 mb-6">
              {slide.badges?.map((badge, i) => (
                <span key={i} className="px-4 py-2 bg-gray-800 rounded-full text-sm">
                  {badge}
                </span>
              ))}
            </div>
            {slide.patentNotice && (
              <div className="px-6 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <p className="text-yellow-400 text-sm font-mono">{slide.patentNotice}</p>
              </div>
            )}
          </div>
        );

      case 'problem':
        return (
          <div className="h-full flex flex-col">
            <h2 className="text-4xl font-bold mb-8 text-red-400">{slide.title}</h2>
            <div className="grid grid-cols-2 gap-6 flex-1">
              {slide.points?.map((point, i) => (
                <div key={i} className="p-6 bg-red-900/20 border border-red-500/30 rounded-2xl">
                  <span className="text-4xl block mb-3">{point.icon}</span>
                  <h3 className="text-xl font-bold mb-2">{point.title}</h3>
                  <p className="text-gray-400">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'solution':
        return (
          <div className="h-full flex flex-col">
            <h2 className="text-4xl font-bold mb-4 text-green-400">{slide.title}</h2>
            <p className="text-2xl text-gray-300 mb-8">{slide.analogy?.title}</p>
            <div className="grid grid-cols-3 gap-6 flex-1">
              {slide.analogy?.comparisons.map((comp, i) => (
                <div key={i} className="p-6 bg-gray-800 rounded-2xl text-center">
                  <span className="text-5xl block mb-4">{comp.icon}</span>
                  <h3 className="text-lg font-bold text-gray-400 mb-4">{comp.industry}</h3>
                  <div className="space-y-2">
                    <div className="text-red-400 line-through">{comp.before}</div>
                    <div className="text-2xl">↓</div>
                    <div className="text-green-400 text-xl font-bold">{comp.after}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'patents':
        return (
          <div className="h-full flex flex-col">
            <h2 className="text-4xl font-bold mb-2">{slide.title}</h2>
            <p className="text-gray-400 mb-6">Filed with USPTO on January 30, 2026</p>
            <div className="grid grid-cols-3 gap-6 flex-1">
              {slide.patents?.map((patent: any) => (
                <div
                  key={patent.num}
                  className={`p-5 rounded-2xl border-2 flex flex-col ${
                    patent.color === 'purple' ? 'border-purple-500 bg-purple-900/20' :
                    patent.color === 'blue' ? 'border-blue-500 bg-blue-900/20' :
                    'border-green-500 bg-green-900/20'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{patent.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold">{patent.name}</h3>
                      <div className="text-xs text-gray-400">{patent.fullName}</div>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-lg mb-3 text-center">
                    <span className="text-yellow-400 font-mono text-sm">USPTO {patent.usptoNum}</span>
                  </div>
                  <ul className="space-y-1.5 mb-3 flex-1">
                    {patent.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-400 italic mb-3">{patent.innovation}</p>
                  <Link
                    href={patent.demo}
                    className={`text-center py-2 rounded-lg text-sm font-medium ${
                      patent.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                      patent.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                      'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    View Demo →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        );

      case 'architecture':
        return (
          <div className="h-full flex flex-col">
            <h2 className="text-4xl font-bold mb-8">{slide.title}</h2>
            <div className="flex-1 flex flex-col gap-4">
              {slide.layers?.map((layer, i) => (
                <div
                  key={i}
                  className={`flex-1 p-6 rounded-2xl border-2 ${
                    layer.color === 'blue' ? 'border-blue-500 bg-blue-900/20' :
                    layer.color === 'purple' ? 'border-purple-500 bg-purple-900/20' :
                    'border-green-500 bg-green-900/20'
                  }`}
                >
                  <h3 className="text-xl font-bold mb-3">{layer.name}</h3>
                  <div className="flex gap-4">
                    {layer.components.map((comp, j) => (
                      <span key={j} className="px-4 py-2 bg-gray-800 rounded-lg text-sm">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'demo':
        return (
          <div className="h-full flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold mb-8">{slide.title}</h2>
            <div className="grid grid-cols-3 gap-8">
              {slide.demos?.map((demo) => (
                <Link
                  key={demo.path}
                  href={demo.path}
                  className="p-8 bg-gray-800 hover:bg-gray-700 rounded-2xl text-center transition-colors"
                >
                  <span className="text-6xl block mb-4">{demo.icon}</span>
                  <h3 className="text-xl font-bold mb-2">{demo.name}</h3>
                  <p className="text-gray-400 text-sm">{demo.desc}</p>
                </Link>
              ))}
            </div>
            <p className="mt-8 text-gray-500">Click to launch demo in new tab</p>
          </div>
        );

      case 'market':
        return (
          <div className="h-full flex flex-col">
            <h2 className="text-4xl font-bold mb-8">{slide.title}</h2>
            <div className="grid grid-cols-3 gap-6 mb-8">
              {slide.stats?.map((stat, i) => (
                <div key={i} className="p-6 bg-gray-800 rounded-2xl text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">{stat.value}</div>
                  <div className="text-gray-300">{stat.label}</div>
                  <div className="text-sm text-gray-500">{stat.source}</div>
                </div>
              ))}
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="flex gap-4">
                {slide.verticals?.map((v, i) => (
                  <span key={i} className="px-6 py-3 bg-purple-900/30 border border-purple-500/30 rounded-xl">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="h-full flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold mb-8">{slide.title}</h2>
            <div className="mb-8">
              {slide.members?.map((member, i) => (
                <div key={i} className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                    👨‍💻
                  </div>
                  <h3 className="text-2xl font-bold">{member.name}</h3>
                  <p className="text-gray-400">{member.role}</p>
                  <p className="text-purple-400">{member.company}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              {slide.achievements?.map((a, i) => (
                <span key={i} className="px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-lg text-sm text-green-400">
                  ✓ {a}
                </span>
              ))}
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {slide.title}
            </h2>
            <p className="text-xl text-gray-400 mb-8">{slide.subtitle}</p>
            <div className="flex gap-4">
              {slide.buttons?.map((btn, i) => (
                <Link
                  key={i}
                  href={btn.path}
                  className={`px-8 py-4 rounded-xl font-medium text-lg transition-colors ${
                    btn.primary
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-900 text-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header (hidden in fullscreen) */}
      {!isFullscreen && (
        <header className="border-b border-gray-700 bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo.png" alt="AIoOS Logo" width={32} height={32} />
                <span className="text-lg font-bold">AIoOS</span>
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                  Pitch Deck
                </span>
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">
                  Press <kbd className="px-2 py-1 bg-gray-700 rounded">F</kbd> for fullscreen |{' '}
                  <kbd className="px-2 py-1 bg-gray-700 rounded">←</kbd>{' '}
                  <kbd className="px-2 py-1 bg-gray-700 rounded">→</kbd> to navigate
                </span>
                <Link href="/demo" className="text-sm text-purple-400 hover:text-purple-300">
                  Back to Demo
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Slide Content */}
      <div className={`${isFullscreen ? 'h-screen' : 'h-[calc(100vh-120px)]'} p-8`}>
        <div className="max-w-5xl mx-auto h-full">
          {renderSlide()}
        </div>
      </div>

      {/* Navigation */}
      <div className={`${isFullscreen ? 'fixed bottom-0 left-0 right-0' : ''} border-t border-gray-700 bg-gray-800 px-4 py-3`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            ← Previous
          </button>

          {/* Slide indicators */}
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === i ? 'bg-purple-500 scale-125' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {currentSlide + 1} / {slides.length}
            </span>
            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
