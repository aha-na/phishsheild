import React, { useState } from 'react';
import {
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Clipboard,
  Sparkles,
  QrCode,
  FileCode2,
  Cpu,
  Layers,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { PRESET_URLS, PresetUrl } from '../utils/sampleData';
import { ScanResult } from '../types';

interface ScannerViewProps {
  onScan: (url: string) => void;
  isScanning: boolean;
  scanStage: string;
  recentScan?: ScanResult | null;
  onViewResult: () => void;
  onOpenQrModal: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  onScan,
  isScanning,
  scanStage,
  recentScan,
  onViewResult,
  onOpenQrModal,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a URL or web address to analyze.');
      return;
    }
    setErrorMsg('');
    onScan(trimmed);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputUrl(text);
        setErrorMsg('');
      }
    } catch {
      // If clipboard access is blocked, prompt fallback
      setErrorMsg('Clipboard permission not available. Please paste manually into the field.');
    }
  };

  const handleSelectPreset = (preset: PresetUrl) => {
    setInputUrl(preset.url);
    setErrorMsg('');
    onScan(preset.url);
  };

  return (
    <div className="space-y-12">
      {/* Hero & Project Framing Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>XAI Phishing URL Risk Assessment Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            PhishShield: Explainable ML Phishing URL Detection
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal">
            Analyze any suspicious link in milliseconds. Our gradient-boosted ML engine evaluates lexical, structural, and protocol signals, delivering transparent SHAP feature attributions and actionable plain-language defense guidance.
          </p>

          {/* Explicit Academic Scope / Disclaimer Banner */}
          <div className="mt-4 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-400 text-xs max-w-2xl mx-auto text-left sm:text-center">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong className="text-slate-200">ML Risk Assessment Tool:</strong> Evaluates probabilistic threat vectors from safe client-extractable URL features. Framed for transparent risk estimation rather than real-time threat intelligence.
            </span>
          </div>
        </div>

        {/* URL Input Form */}
        <div className="relative max-w-3xl mx-auto mt-8">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative flex flex-col sm:flex-row items-stretch gap-2 p-2 rounded-2xl bg-slate-950/90 border border-slate-700/80 shadow-2xl focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
              <div className="relative flex-1 flex items-center pl-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Paste URL to inspect (e.g., https://paypal.com@verify-login.xyz/update)"
                  className="w-full bg-transparent px-3 py-3 text-white placeholder-slate-500 text-sm sm:text-base font-mono focus:outline-none"
                  disabled={isScanning}
                />
                {inputUrl && (
                  <button
                    type="button"
                    onClick={() => setInputUrl('')}
                    className="p-1.5 text-slate-400 hover:text-slate-200 text-xs rounded-md mr-1"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePaste}
                  title="Paste from clipboard"
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-cyan-300 hover:bg-slate-900 rounded-lg transition-colors mr-1"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>Paste</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenQrModal}
                  title="Scan from QR code"
                  className="flex items-center justify-center p-3 sm:px-3 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 transition-colors"
                >
                  <QrCode className="w-5 h-5 text-cyan-400" />
                  <span className="hidden sm:inline-block ml-1.5 text-xs font-semibold">QR Code</span>
                </button>

                <button
                  type="submit"
                  disabled={isScanning}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>{scanStage || 'Analyzing URL...'}</span>
                    </>
                  ) : (
                    <>
                      <span>Inspect URL</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5 pl-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}
          </form>

          {/* Quick-test Presets from the Dataset & Real Attack Scenarios */}
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                Benchmark Test Presets (Click to analyze):
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Real attack patterns vs. legitimate institutional URLs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {PRESET_URLS.map((preset, index) => {
                const isHigh = preset.category === 'High Risk';
                const isSusp = preset.category === 'Suspicious';
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectPreset(preset)}
                    className="text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                          {preset.label}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isHigh
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                              : isSusp
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                          }`}
                        >
                          {preset.category}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 truncate mb-1">
                        {preset.url}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Scan Quick Preview Banner if Available */}
        {recentScan && !isScanning && (
          <div className="max-w-3xl mx-auto mt-8 p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`p-2.5 rounded-xl ${
                  recentScan.predictedClass === 'High Risk'
                    ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                    : recentScan.predictedClass === 'Suspicious'
                    ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                    : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                }`}
              >
                {recentScan.predictedClass === 'High Risk' ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : recentScan.predictedClass === 'Suspicious' ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Latest Scan:</span>
                  <span className="text-sm font-bold text-white">
                    {recentScan.predictedClass} ({recentScan.riskScore}%)
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-300 truncate max-w-md">
                  {recentScan.url}
                </p>
              </div>
            </div>

            <button
              onClick={onViewResult}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold shrink-0 transition-colors"
            >
              <span>View Full Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* Feature & Technical Architecture Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">Safe Lexical Extraction</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Extracts URL length, subdomains, @ symbols, IP host, hyphens, and token entropy safely without exposing your IP to attacker infrastructure.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">XGBoost & UCI Phishing</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Trained and cross-validated against 11,055 UCI phishing instances, outperforming Logistic Regression and Random Forest with 98.1% F1-score.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">SHAP Explainability (XAI)</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Transforms black-box classification into local waterfall feature attributions, showing exact factors that raised or lowered the risk.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">Actionable Plain Advice</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Translates technical telemetry into plain-language instructions: whether to close the page, inspect DNS records, or report to security authorities.
          </p>
        </div>
      </section>

      {/* Workflow Diagram Banner */}
      <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-cyan-400" />
          PhishShield Pipeline Architecture:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold text-cyan-400 uppercase">Step 01</span>
            <h3 className="text-xs font-bold text-slate-200 mt-1">Raw URL Ingestion</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Parse host, scheme, tokens & entropy</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold text-blue-400 uppercase">Step 02</span>
            <h3 className="text-xs font-bold text-slate-200 mt-1">Feature Extraction</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">12+ client-safe feature vector mapping</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold text-indigo-400 uppercase">Step 03</span>
            <h3 className="text-xs font-bold text-slate-200 mt-1">XGBoost Scoring</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Probabilistic classification (0-100%)</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Step 04</span>
            <h3 className="text-xs font-bold text-slate-200 mt-1">SHAP Attribution</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Transparent explainable security report</p>
          </div>
        </div>
      </section>
    </div>
  );
};
