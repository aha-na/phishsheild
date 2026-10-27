import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  History,
  BarChart3,
  BrainCircuit,
  GraduationCap,
  Puzzle,
  Layers,
} from 'lucide-react';

export type ActiveTab =
  | 'scanner'
  | 'result'
  | 'history'
  | 'analytics'
  | 'model-insights'
  | 'learn'
  | 'extension';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  hasActiveResult: boolean;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasActiveResult,
  historyCount,
}) => {
  const navItems = [
    { id: 'scanner', label: 'Scanner', icon: Search },
    ...(hasActiveResult ? [{ id: 'result', label: 'Scan Result', icon: ShieldAlert }] : []),
    { id: 'history', label: 'History', icon: History, badge: historyCount },
    { id: 'analytics', label: 'Threat Analytics', icon: BarChart3 },
    { id: 'model-insights', label: 'Model Insights', icon: BrainCircuit },
    { id: 'learn', label: 'Learn & Protect', icon: GraduationCap },
    { id: 'extension', label: 'Browser Extension', icon: Puzzle, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Statement Title */}
          <div
            onClick={() => setActiveTab('scanner')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  PhishShield
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Explainable Phishing URL Risk Assessment & Awareness
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  } ${item.highlight && !isActive ? 'text-cyan-400 border border-cyan-900/50' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[11px] font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action & Model Tag */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-400">Dataset:</span>
              <span className="font-semibold text-slate-200">PhiUSIIL (99.0% F1)</span>
            </div>

            <button
              onClick={() => setActiveTab('scanner')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold shadow-md shadow-cyan-600/20 active:scale-95 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Scan URL</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-slate-900">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="px-1 text-[10px] rounded-full bg-slate-800 text-slate-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
