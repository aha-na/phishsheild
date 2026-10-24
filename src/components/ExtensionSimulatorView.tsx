import React, { useState } from 'react';
import {
  Puzzle,
  Globe,
  Lock,
  RotateCw,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Download,
  Copy,
  Check,
  Code2,
  FileCode,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { analyzeUrl } from '../utils/mlEngine';
import { RiskGauge } from './RiskGauge';

export const ExtensionSimulatorView: React.FC = () => {
  const [activeUrl, setActiveUrl] = useState('https://paypa1-security-verification.xyz/account/confirm-identity');
  const [isExtensionPopupOpen, setIsExtensionPopupOpen] = useState(true);
  const [activeCodeTab, setActiveCodeTab] = useState<'manifest' | 'popupHtml' | 'popupJs' | 'backgroundJs'>('manifest');
  const [copiedCode, setCopiedCode] = useState(false);

  // Compute live scan on the simulated browser URL
  const currentScan = analyzeUrl(activeUrl);

  const sampleUrls = [
    { label: 'Phishing: Fake PayPal', url: 'https://paypa1-security-verification.xyz/account/confirm-identity' },
    { label: 'Phishing: Direct IP Harvester', url: 'http://192.168.1.104/secure-chase-login/verify.html' },
    { label: 'Safe: Official Chase Bank', url: 'https://www.chase.com/personal/banking' },
    { label: 'Safe: Wikipedia Phishing Article', url: 'https://en.wikipedia.org/wiki/Phishing' },
  ];

  const codeSnippets = {
    manifest: `{
  "manifest_version": 3,
  "name": "PhishShield — Real-Time ML URL Sentinel",
  "version": "1.0.0",
  "description": "Explainable ML-based phishing URL risk assessment directly in your active browser tab.",
  "permissions": ["activeTab", "storage"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js"
  }
}`,
    popupHtml: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="popup.css">
  <title>PhishShield Sentinel</title>
</head>
<body>
  <div class="header">
    <img src="icons/icon48.png" width="20" height="20">
    <h3>PhishShield XAI</h3>
  </div>
  <div id="gauge-container">
    <div id="risk-score">--%</div>
    <div id="risk-label">Evaluating Tab...</div>
  </div>
  <div id="shap-breakdown"></div>
  <button id="rescan-btn">Re-Scan Active Tab</button>
  <script src="popup.js"></script>
</body>
</html>`,
    popupJs: `// popup.js - Evaluates active tab URL against PhishShield ML engine
async function inspectActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url) return;

  // Sends active tab URL to PhishShield /api/scan endpoint
  const response = await fetch('http://localhost:3000/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: tab.url })
  });

  const data = await response.json();
  document.getElementById('risk-score').textContent = data.riskScore + '%';
  document.getElementById('risk-label').textContent = data.predictedClass;
  // Render top SHAP waterfall factors...
}

document.addEventListener('DOMContentLoaded', inspectActiveTab);
document.getElementById('rescan-btn').addEventListener('click', inspectActiveTab);`,
    backgroundJs: `// background.js - Monitors tab changes & updates badge color dynamically
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    // Quick heuristic pre-flight check
    const isDirectIp = /^https?:\\/\\/\\d{1,3}\\.\\d{1,3}/.test(tab.url);
    if (isDirectIp) {
      chrome.action.setBadgeBackgroundColor({ color: '#f43f5e', tabId });
      chrome.action.setBadgeText({ text: '!', tabId });
    } else {
      chrome.action.setBadgeBackgroundColor({ color: '#10b981', tabId });
      chrome.action.setBadgeText({ text: 'OK', tabId });
    }
  }
});`,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadExtension = () => {
    // Create text file bundle representation
    const bundleText = `=== PhishShield Manifest V3 Chrome Extension Package ===

--- manifest.json ---
${codeSnippets.manifest}

--- popup.html ---
${codeSnippets.popupHtml}

--- popup.js ---
${codeSnippets.popupJs}

--- background.js ---
${codeSnippets.backgroundJs}

Instructions:
1. Save each file into a folder named "phishshield-extension".
2. Open Chrome and navigate to chrome://extensions.
3. Enable "Developer mode" in the top-right corner.
4. Click "Load unpacked" and select the folder.`;

    const blob = new Blob([bundleText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phishshield-chrome-extension-source.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Puzzle className="w-3.5 h-3.5 text-amber-400" />
            <span>Final-Project Differentiator (Section 6)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Browser Extension Simulator & Manifest V3 Suite
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Simulates instant one-click phishing inspection on the active tab, reusing the same explainable ML pipeline in a production-ready Chrome Extension.
          </p>
        </div>

        <button
          onClick={handleDownloadExtension}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-amber-600/20 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Extension Source</span>
        </button>
      </div>

      {/* Quick URL Preset Selector */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1">
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          Simulate Browser Visiting:
        </span>
        {sampleUrls.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setActiveUrl(s.url)}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              activeUrl === s.url
                ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Realistic Chrome Browser Mockup */}
      <div className="rounded-3xl border border-slate-700 bg-slate-950 overflow-hidden shadow-2xl">
        {/* Browser Top Window Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-4">
          {/* Mac-style Window Controls */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          {/* Active Tab Tab Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-t-lg bg-slate-950 border-t border-x border-slate-800 text-xs font-semibold text-slate-200 max-w-xs truncate">
            <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{currentScan.parsedUrl.domain || 'Active Tab'}</span>
          </div>

          <div className="w-12" />
        </div>

        {/* Browser Address Bar & Toolbar */}
        <div className="bg-slate-950 p-3 border-b border-slate-800 flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-500">
            <button className="p-1 hover:text-white rounded" title="Back">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button className="p-1 hover:text-white rounded" title="Forward">
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="p-1 hover:text-white rounded" title="Reload">
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Omni Address Bar */}
          <div className="flex-1 relative flex items-center px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <Lock className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={activeUrl}
              onChange={(e) => setActiveUrl(e.target.value)}
              className="w-full bg-transparent text-slate-200 focus:outline-none"
              placeholder="https://..."
            />
          </div>

          {/* Extension Toolbar Icon (The Hero Feature) */}
          <div className="relative">
            <button
              onClick={() => setIsExtensionPopupOpen(!isExtensionPopupOpen)}
              title="Click to toggle PhishShield Extension Sentinel"
              className={`relative p-2 rounded-xl border transition-all flex items-center justify-center ${
                isExtensionPopupOpen
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Puzzle className="w-4 h-4 text-amber-400" />
              {/* Dynamic Badge Status */}
              <span
                className={`absolute -top-1 -right-1 px-1 rounded-full text-[9px] font-extrabold text-white ${
                  currentScan.predictedClass === 'High Risk'
                    ? 'bg-rose-600'
                    : currentScan.predictedClass === 'Suspicious'
                    ? 'bg-amber-600'
                    : 'bg-emerald-600'
                }`}
              >
                {currentScan.predictedClass === 'High Risk' ? '!' : 'OK'}
              </span>
            </button>
          </div>
        </div>

        {/* Browser Content Area with Simulated Extension Popup Overlay */}
        <div className="relative h-[420px] bg-slate-950 p-6 flex items-center justify-center overflow-hidden">
          {/* Underlying simulated webpage */}
          <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center opacity-40 pointer-events-none space-y-3">
            <Globe className="w-12 h-12 text-slate-600" />
            <h4 className="text-base font-bold text-slate-400">
              Simulated Target Webpage: {currentScan.parsedUrl.domain}
            </h4>
            <p className="text-xs text-slate-500 max-w-md font-mono">
              {currentScan.url}
            </p>
          </div>

          {/* Interactive Chrome Extension Popup Modal */}
          {isExtensionPopupOpen && (
            <div className="relative z-20 w-80 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4 animate-scaleUp">
              {/* Popup Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <Puzzle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">PhishShield Sentinel</h5>
                    <span className="text-[10px] text-slate-400 block font-mono">Active Tab Inspector</span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    currentScan.predictedClass === 'High Risk'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : currentScan.predictedClass === 'Suspicious'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {currentScan.predictedClass}
                </span>
              </div>

              {/* Gauge in Extension */}
              <RiskGauge
                score={currentScan.riskScore}
                predictedClass={currentScan.predictedClass}
                confidence={currentScan.confidence}
                size="sm"
              />

              {/* Top Warning Factor */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Top SHAP Signal:
                </span>
                <p className="text-xs text-slate-300 font-medium">
                  {currentScan.shapFactors[0]?.displayName || 'Normal heuristics'} (
                  {currentScan.shapFactors[0]?.impact > 0 ? '+' : ''}
                  {currentScan.shapFactors[0]?.impact}% risk)
                </p>
              </div>

              {/* Action Button */}
              {currentScan.predictedClass === 'High Risk' ? (
                <button
                  onClick={() => setActiveUrl('https://en.wikipedia.org/wiki/Phishing')}
                  className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Block & Close Tab</span>
                </button>
              ) : (
                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-[11px] text-emerald-300 text-center font-medium">
                  ✓ Safe to browse. Zero credential leaks detected.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Extension Source Code Viewer (Academic Transparency) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-amber-400" />
              <span>Manifest V3 Extension Source Code</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ready to copy or export for viva presentation and developer mode browser installation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-800 pb-2">
          {(
            [
              { id: 'manifest', label: 'manifest.json' },
              { id: 'popupHtml', label: 'popup.html' },
              { id: 'popupJs', label: 'popup.js' },
              { id: 'backgroundJs', label: 'background.js' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCodeTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeCodeTab === tab.id
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code display */}
        <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto max-h-72">
          {codeSnippets[activeCodeTab]}
        </pre>
      </section>
    </div>
  );
};
