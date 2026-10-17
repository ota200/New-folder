import React, { useState } from 'react';
import {
  Code,
  Sparkles,
  Zap,
  Layers,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';

export default function App() {
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'counter'>('overview');

  const copySnippet = () => {
    navigator.clipboard.writeText('npm run dev');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">
              React + Vite Starter
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('counter')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'counter'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              State Demo
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'features'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Stack
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 flex-1 flex flex-col items-center justify-center text-center">
        {/* Logo Badges */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center shadow-lg shadow-cyan-950/40 hover:scale-105 transition-transform">
            <svg
              className="w-10 h-10 text-cyan-400 animate-spin"
              style={{ animationDuration: '12s' }}
              viewBox="-11.5 -10.23174 23 20.46348"
              fill="currentColor"
            >
              <circle cx="0" cy="0" r="2.05" />
              <g stroke="currentColor" strokeWidth="1" fill="none">
                <ellipse rx="11" ry="4.2" />
                <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                <ellipse rx="11" ry="4.2" transform="rotate(120)" />
              </g>
            </svg>
          </div>

          <span className="text-2xl font-light text-slate-600">+</span>

          <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center shadow-lg shadow-purple-950/40 hover:scale-105 transition-transform">
            <Zap className="w-9 h-9 text-purple-400" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          React <span className="text-cyan-400">19</span> + Vite Template
        </h1>

        <p className="text-slate-400 text-base max-w-xl mb-10 leading-relaxed">
          A pristine, blazing-fast starter template configured with TypeScript, Tailwind CSS, and standard React hooks.
        </p>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="w-full max-w-lg space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl text-left space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-blue-400" />
                  Quick Start
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  Ready
                </span>
              </div>

              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-xs flex items-center justify-between text-slate-300">
                <span>Edit <code className="text-cyan-400">src/App.tsx</code> to start building</span>
                <button
                  onClick={copySnippet}
                  className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                  title="Copy command"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('counter')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <span>Test State Hook</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setCount(0)}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Reset Counter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive State Counter */}
        {activeTab === 'counter' && (
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
                useState Demonstration
              </span>
              <div className="text-5xl font-mono font-bold text-white my-3">
                {count}
              </div>
              <p className="text-xs text-slate-400">
                Click below to update reactive component state.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setCount((c) => c - 1)}
                className="w-12 h-10 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-mono text-sm transition-colors cursor-pointer"
              >
                -1
              </button>
              <button
                onClick={() => setCount((c) => c + 1)}
                className="px-6 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                Increment
              </button>
              <button
                onClick={() => setCount((c) => c + 5)}
                className="px-4 h-10 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-mono text-sm transition-colors cursor-pointer"
              >
                +5
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Tech Stack Highlights */}
        {activeTab === 'features' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg text-left">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                React 19
              </div>
              <p className="text-[11px] text-slate-400">
                Modern functional architecture with React hooks and concurrent rendering.
              </p>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Vite Bundler
              </div>
              <p className="text-[11px] text-slate-400">
                Instant server start and lightning fast development builds.
              </p>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Tailwind CSS
              </div>
              <p className="text-[11px] text-slate-400">
                Utility-first styling with modern dark theme support.
              </p>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                TypeScript
              </div>
              <p className="text-[11px] text-slate-400">
                Strong static typing for safer refactoring and auto-completion.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>React.js + Vite Application Template</span>
          <div className="flex items-center gap-4">
            <a
              href="https://react.dev"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors inline-flex items-center gap-1"
            >
              React Docs
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://vite.dev"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors inline-flex items-center gap-1"
            >
              Vite Docs
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
