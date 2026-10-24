import React from 'react';
import { ShieldCheck, Database, Layers, Sparkles } from 'lucide-react';
import { ActiveTab } from './Header';

interface FooterProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Project Summary */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">PhishShield</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              An Explainable ML-Based Phishing URL Detection and Cybersecurity Awareness Platform.
              Engineered with gradient boosting (XGBoost), SHAP explainability, and multi-vector threat analytics.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-cyan-500" /> UCI Phishing Dataset Benchmark
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-500" /> XGBoost Champion (98.1% F1)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> SHAP Feature Attribution
              </span>
            </div>
          </div>

          {/* Quick Platform Navigation */}
          <div>
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider block mb-3">
              Platform Views
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('scanner')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  URL Scanner & Presets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('history')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Audit History & Export
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('analytics')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Threat Analytics & Trends
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('model-insights')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Model Benchmark & Viva Defense
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('learn')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Phishing Academy & Quiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('extension')}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  Browser Extension Simulator
                </button>
              </li>
            </ul>
          </div>

          {/* Academic Viva & Architecture Notes */}
          <div>
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider block mb-3">
              Technical Decision
            </span>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Safely extracts purely client-side computable features (dots, hyphens, @ symbol, IP format, entropy, token keywords) to prevent metadata leak or browser exploits.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-200 block mb-0.5">Viva Ready:</strong>
              Includes complete 2x2 confusion matrices, ROC AUC curves, and FAQ defense arguments.
            </div>
          </div>
        </div>

        {/* Scope Disclaimer & Copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p className="text-center sm:text-left max-w-2xl text-[11px]">
            <strong>Disclaimer:</strong> PhishShield is an ML-based risk-assessment and cybersecurity awareness platform. It evaluates probabilistic risk scores and explains warning signals. It does not promise real-time internet-wide threat intelligence or 100% detection.
          </p>
          <span className="text-[11px] font-mono text-slate-400">
            PhishShield XAI v1.4 • 2026
          </span>
        </div>
      </div>
    </footer>
  );
};
