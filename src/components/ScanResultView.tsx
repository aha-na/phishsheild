import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Info,
  Download,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BarChart,
  Terminal,
} from 'lucide-react';
import { ScanResult, ShapFactor } from '../types';
import { RiskGauge } from './RiskGauge';

interface ScanResultViewProps {
  scan: ScanResult;
  onBackToScanner: () => void;
  onFeedback: (scanId: string, feedback: 'correct' | 'false_positive' | 'false_negative') => void;
}

export const ScanResultView: React.FC<ScanResultViewProps> = ({
  scan,
  onBackToScanner,
  onFeedback,
}) => {
  const [copied, setCopied] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<string | null>(
    scan.userFeedback || null
  );

  const handleCopyReport = () => {
    const reportText = `[PhishShield ML Risk Report]
URL: ${scan.url}
Class: ${scan.predictedClass}
Risk Probability: ${scan.riskScore}% (Confidence: ${scan.confidence}%)
Model: XGBoost (UCI Phishing Benchmark)

Summary:
${scan.plainLanguageAdvice}

Top Contributing Factors (SHAP XAI):
${scan.shapFactors.map((f) => `- ${f.displayName}: ${f.impact > 0 ? '+' : ''}${f.impact}% (${f.description})`).join('\n')}

Actionable Guidance:
${scan.actionableSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUserFeedback = (type: 'correct' | 'false_positive' | 'false_negative') => {
    onFeedback(scan.id, type);
    setFeedbackSubmitted(type);
  };

  const riskElevators = scan.shapFactors.filter((f) => f.isPositive);
  const riskMitigators = scan.shapFactors.filter((f) => !f.isPositive);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={onBackToScanner}
          className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to URL Scanner</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Report Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Result Banner & Risk Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Risk Gauge & Classification */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center shadow-xl">
          <RiskGauge
            score={scan.riskScore}
            predictedClass={scan.predictedClass}
            confidence={scan.confidence}
            size="lg"
          />

          <div className="mt-5 w-full pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Model:</span>
            <strong className="text-slate-200">XGBoost Classifier</strong>
          </div>
          <div className="w-full pt-2 flex items-center justify-between text-xs text-slate-400">
            <span>Scan Timestamp:</span>
            <span className="font-mono text-slate-300">
              {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Right 2 Columns: Plain-Language Advice & URL Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plain-Language Advice Card (Exact PDF Spec) */}
          <div
            className={`p-6 rounded-3xl border shadow-xl ${
              scan.predictedClass === 'High Risk'
                ? 'bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border-rose-800/70'
                : scan.predictedClass === 'Suspicious'
                ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-800/70'
                : 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-800/70'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Plain-Language Risk Synthesis:
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-3">
              {scan.plainLanguageAdvice}
            </h2>

            {/* Actionable Steps List */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Recommended Actions:
              </span>
              <ul className="space-y-1.5">
                {scan.actionableSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                    <span
                      className={`font-bold mt-0.5 shrink-0 ${
                        scan.predictedClass === 'High Risk'
                          ? 'text-rose-400'
                          : scan.predictedClass === 'Suspicious'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      •
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Parsed URL Anatomy Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
              Parsed Target URL:
            </span>
            <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs break-all text-slate-200 border border-slate-800">
              <span className="text-cyan-400 font-semibold">{scan.parsedUrl.protocol}://</span>
              {scan.parsedUrl.subdomain && (
                <span className="text-amber-400">{scan.parsedUrl.subdomain}.</span>
              )}
              <span className="text-emerald-400 font-bold">{scan.parsedUrl.domain}</span>
              {scan.parsedUrl.port && scan.parsedUrl.port !== '80' && scan.parsedUrl.port !== '443' && (
                <span className="text-rose-400">:{scan.parsedUrl.port}</span>
              )}
              <span className="text-slate-400">{scan.parsedUrl.pathname}</span>
              {scan.parsedUrl.search && (
                <span className="text-purple-400">{scan.parsedUrl.search}</span>
              )}
            </div>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-500 block">Protocol</span>
                <strong className={scan.features.isHttps ? 'text-emerald-400' : 'text-rose-400'}>
                  {scan.parsedUrl.protocol.toUpperCase()}
                </strong>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-500 block">Registered Domain</span>
                <strong className="text-slate-200 truncate block">{scan.parsedUrl.domain}</strong>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-500 block">Subdomains</span>
                <strong className="text-slate-200">
                  {scan.features.subdomainCount} level{scan.features.subdomainCount !== 1 ? 's' : ''}
                </strong>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-500 block">Host Type</span>
                <strong className={scan.features.isIpAddress ? 'text-rose-400' : 'text-slate-200'}>
                  {scan.features.isIpAddress ? 'Direct IP' : 'FQDN Domain'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SHAP / Feature Importance Explainability Waterfall (Core Requirement) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">
                SHAP Explainability Waterfall (Feature Attribution)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Shows how individual signals mathematically raised (+) or lowered (-) the predicted risk score from the baseline prior.
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            Baseline Prior: <strong className="text-slate-200">16% Base Rate</strong>
          </span>
        </div>

        {/* Feature Contribution Bars */}
        <div className="space-y-3 pt-2">
          {scan.shapFactors.map((factor, idx) => {
            const isElevator = factor.impact > 0;
            const barWidthPercent = Math.min(100, Math.abs(factor.impact) * 2.5);

            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isElevator ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                    />
                    <strong className="text-slate-200">{factor.displayName}</strong>
                    <span className="text-slate-500 text-[11px] font-mono">
                      ({factor.featureName})
                    </span>
                  </div>

                  <span
                    className={`font-mono font-bold ${
                      isElevator ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {isElevator ? `+${factor.impact}% Risk` : `${factor.impact}% Risk`}
                  </span>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden flex">
                  {isElevator ? (
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-700"
                      style={{ width: `${barWidthPercent}%` }}
                    />
                  ) : (
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${barWidthPercent}%` }}
                    />
                  )}
                </div>

                <p className="text-[11px] text-slate-400 leading-normal">
                  {factor.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* User Feedback Loop (Differentiator from Section 6) */}
      <section className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
            Differentiator: Active Learning & Feedback Loop
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">
            Was this risk prediction accurate for your inspection?
          </h4>
          <p className="text-xs text-slate-400">
            User feedback is recorded into the retraining buffer to evaluate edge-case drift.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleUserFeedback('correct')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              feedbackSubmitted === 'correct'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Accurate</span>
          </button>

          <button
            onClick={() => handleUserFeedback('false_positive')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              feedbackSubmitted === 'false_positive'
                ? 'bg-amber-950 text-amber-300 border-amber-600'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5 text-amber-400" />
            <span>False Positive</span>
          </button>

          <button
            onClick={() => handleUserFeedback('false_negative')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              feedbackSubmitted === 'false_negative'
                ? 'bg-rose-950 text-rose-300 border-rose-600'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>False Negative</span>
          </button>
        </div>
      </section>

      {/* Collapsible Technical Feature Matrix */}
      <section className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full p-4 flex items-center justify-between text-left text-xs font-semibold text-slate-300 hover:bg-slate-900/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Complete URL Feature Vector (12 Computed Signals)</span>
          </div>
          {showTechnicalDetails ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showTechnicalDetails && (
          <div className="p-4 pt-0 border-t border-slate-800/80">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs mt-3">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[11px]">URL Length</span>
                <span className="font-mono text-slate-200">{scan.features.urlLength} chars</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Dots Count</span>
                <span className="font-mono text-slate-200">{scan.features.dotsCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Subdomain Levels</span>
                <span className="font-mono text-slate-200">{scan.features.subdomainCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Hyphens in Host</span>
                <span className="font-mono text-slate-200">{scan.features.hyphenCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[11px]">RFC @ Symbol</span>
                <span className={scan.features.hasAtSymbol ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {scan.features.hasAtSymbol ? 'Present (Spoofed)' : 'None'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[11px]">IP Address Host</span>
                <span className={scan.features.isIpAddress ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {scan.features.isIpAddress ? 'True (Numerical)' : 'False'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Shannon Entropy</span>
                <span className="font-mono text-slate-200">{scan.features.domainEntropy}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Matched Tokens</span>
                <span className="font-mono text-slate-200 truncate block">
                  {scan.features.matchedTokens.length > 0
                    ? scan.features.matchedTokens.join(', ')
                    : 'None'}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
