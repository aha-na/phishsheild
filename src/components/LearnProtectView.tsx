import React, { useState } from 'react';
import {
  GraduationCap,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  FileWarning,
  ExternalLink,
  HelpCircle,
  Flag,
  Share2,
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  scenario: string;
  url: string;
  isPhishing: boolean;
  explanation: string;
  telltaleSigns: string[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    scenario: 'SMS message: "Your Netflix subscription has expired. Update billing info to resume streaming."',
    url: 'https://netflix.com.billing-renew-service.tk/user/login',
    isPhishing: true,
    explanation: 'The actual domain is billing-renew-service.tk. "netflix.com" is merely a deceptive subdomain prefix on a free .tk registrar.',
    telltaleSigns: ['Subdomain spoofing', 'Disposable .tk TLD', 'Urgent payment lure'],
  },
  {
    id: 2,
    scenario: 'Google Workspace notification regarding shared financial spreadsheet.',
    url: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
    isPhishing: false,
    explanation: 'Legitimate Google Docs URL under the authoritative google.com domain with valid HTTPS certificate and standard spreadsheet token ID.',
    telltaleSigns: ['Authoritative google.com root domain', 'Valid HTTPS', 'Clean standard path'],
  },
  {
    id: 3,
    scenario: 'Email alert from Chase: "Suspicious login attempt detected from Russia. Verify your identity now."',
    url: 'http://192.168.1.104/chase-security-verify/login.php',
    isPhishing: true,
    explanation: 'Direct IP address host over plaintext HTTP. Real banks never host customer authentication interfaces on naked IP addresses.',
    telltaleSigns: ['Bare IP address host', 'Plaintext HTTP (no SSL)', 'Generic PHP auth path'],
  },
  {
    id: 4,
    scenario: 'PayPal confirmation link: "Claim your $50 merchant refund."',
    url: 'https://paypal.com@user-refund-portal.xyz/payout',
    isPhishing: true,
    explanation: 'Uses RFC 3986 "@" symbol spoofing. Modern browsers discard everything before "@", navigating directly to user-refund-portal.xyz.',
    telltaleSigns: ['RFC @-character deception', 'High-abuse .xyz TLD', 'Financial refund incentive'],
  },
  {
    id: 5,
    scenario: 'Software update link for open-source Python compiler.',
    url: 'https://www.python.org/downloads/release/python-3120/',
    isPhishing: false,
    explanation: 'Official Python Software Foundation domain (.org) with authentic release path and transparent open-source provenance.',
    telltaleSigns: ['Legitimate python.org domain', 'Standard non-profit TLD', 'Valid cryptographic TLS'],
  },
];

export const LearnProtectView: React.FC = () => {
  // Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const activeQ = QUIZ_QUESTIONS[currentQuestionIdx];

  const handleAnswer = (answer: boolean) => {
    setUserAnswers((prev) => ({ ...prev, [activeQ.id]: answer }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setUserAnswers({});
    setCurrentQuestionIdx(0);
    setShowExplanation(false);
    setQuizFinished(false);
  };

  // Calculate score
  const score = Object.entries(userAnswers).filter(
    ([id, ans]) => ans === QUIZ_QUESTIONS.find((q) => q.id === Number(id))?.isPhishing
  ).length;

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cybersecurity Awareness & Red Flag Defense</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Learn & Protect: Phishing Techniques Academy
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Understand how cybercriminals engineer deceptive links, explore visual attack anatomy, and test your instincts in the interactive Phish Spotter challenge.
        </p>
      </div>

      {/* Visual Anatomy of a Deceptive URL */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            <span>Interactive URL Anatomy: How Attackers Deceive the Human Eye</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Examining a weaponized credential harvesting URL broken down by component.
          </p>
        </div>

        {/* Annotated URL Display */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center font-mono text-sm sm:text-lg break-all p-3 rounded-xl bg-slate-900 border border-slate-800/80 gap-1">
            <span className="text-rose-400 px-1 py-0.5 rounded bg-rose-950/60 font-bold">http://</span>
            <span className="text-amber-400 px-1 py-0.5 rounded bg-amber-950/60">chase.com.account-update.</span>
            <span className="text-rose-400 px-1 py-0.5 rounded bg-rose-950/60 font-bold underline">fraud-security.top</span>
            <span className="text-purple-400 px-1 py-0.5 rounded bg-purple-950/60">:8080</span>
            <span className="text-slate-300 px-1 py-0.5 rounded bg-slate-800/60">/verify/login.php</span>
            <span className="text-cyan-400 px-1 py-0.5 rounded bg-cyan-950/60">?token=9283</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-rose-900/40">
              <span className="text-rose-400 font-bold block mb-1">1. Plaintext Protocol (http://)</span>
              <p className="text-slate-400">
                Lacks cryptographic TLS encryption. Legitimate financial institutions never authenticate over unencrypted HTTP.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-amber-900/40">
              <span className="text-amber-400 font-bold block mb-1">2. Subdomain Camouflage</span>
              <p className="text-slate-400">
                Attackers place &ldquo;chase.com&rdquo; at the front of subdomains. On small mobile screens, the actual registered domain is pushed out of view.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-rose-900/40">
              <span className="text-rose-400 font-bold block mb-1">3. The True Root Domain (.top)</span>
              <p className="text-slate-400">
                The only domain receiving traffic is <code>fraud-security.top</code>. The <code>.top</code> extension is notorious for cheap disposable registrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Attack Vectors Grid */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileWarning className="w-5 h-5 text-amber-400" />
          <span>Top Phishing Vectors & Attack Archetypes</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Vector 01</span>
            <h4 className="text-base font-bold text-white">Typosquatting & Combosquatting</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Attackers register domains with minor visual typographical variations (e.g., <code>paypa1.com</code> or <code>chase-security-portal.com</code>) hoping victims glance without scrutinizing the spelling.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Vector 02</span>
            <h4 className="text-base font-bold text-white">Homoglyph / IDN Attacks</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Utilizing non-ASCII Unicode characters that look identical to standard Latin letters (e.g., Cyrillic &ldquo;а&rdquo; encoded in Punycode as <code>xn--...</code>), bypassing visual human inspection.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Vector 03</span>
            <h4 className="text-base font-bold text-white">RFC 3986 &ldquo;@&rdquo; Masking</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              URLs in the format <code>https://trusted-brand.com@evil-destination.com</code>. In RFC 3986, the portion before the &ldquo;@&rdquo; represents obsolete username authentication and is discarded by modern web browsers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Vector 04</span>
            <h4 className="text-base font-bold text-white">Reverse Proxy (Evilginx 2FA Bypass)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Phishing toolkits that act as man-in-the-middle proxies between the victim and legitimate server, intercepting session cookies and bypassing SMS / TOTP two-factor authentication in real time.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Vector 05</span>
            <h4 className="text-base font-bold text-white">QR Code &ldquo;Quishing&rdquo;</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Embedding malicious URLs into physical or email QR codes. Because emails do not contain clickable text, legacy email gateways fail to inspect the payload, forcing victims to scan with personal phones.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Vector 06</span>
            <h4 className="text-base font-bold text-white">Cloudflare Worker & SaaS Hosting Abuse</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hosting phishing forms on legitimate shared cloud hosts (e.g., <code>*.workers.dev</code>, <code>firebaseapp.com</code>, or <code>web.app</code>) to inherit reputable SSL certificates and clean IP reputation.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Quiz: "Spot the Phish" Challenge */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              Interactive Knowledge Check
            </span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <span>Spot the Phish Challenge</span>
            </h3>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300">
            Question {currentQuestionIdx + 1} of {QUIZ_QUESTIONS.length}
          </span>
        </div>

        {!quizFinished ? (
          <div className="space-y-6">
            {/* Scenario Card */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Incoming Scenario:
              </span>
              <p className="text-sm sm:text-base font-medium text-slate-200">
                {activeQ.scenario}
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 break-all">
                {activeQ.url}
              </div>
            </div>

            {/* Answer Buttons */}
            {!showExplanation ? (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => handleAnswer(true)}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/50 font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Flag as Phishing Attack</span>
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verify as Safe / Legitimate</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div
                  className={`p-4 rounded-2xl border ${
                    userAnswers[activeQ.id] === activeQ.isPhishing
                      ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm mb-1">
                    {userAnswers[activeQ.id] === activeQ.isPhishing ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Correct! Nice detective work.</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Incorrect. Look closer at the domain root.</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    {activeQ.explanation}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-400">Telltale Signals:</span>
                    {activeQ.telltaleSigns.map((sign, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-[11px]"
                      >
                        {sign}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors"
                  >
                    {currentQuestionIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Scenario' : 'View Results'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center space-y-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="w-16 h-16 rounded-full bg-cyan-950 border border-cyan-800 mx-auto flex items-center justify-center text-cyan-400">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">Quiz Completed!</h4>
            <p className="text-sm text-slate-300">
              You correctly identified <strong>{score}</strong> out of{' '}
              <strong>{QUIZ_QUESTIONS.length}</strong> scenarios (
              {Math.round((score / QUIZ_QUESTIONS.length) * 100)}% accuracy).
            </p>
            <button
              onClick={handleRestartQuiz}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </section>

      {/* Official Incident Reporting Guidance Directory */}
      <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Flag className="w-4 h-4 text-rose-400" />
          <span>Where to Report Confirmed Phishing Links</span>
        </h3>
        <p className="text-xs text-slate-400">
          If you encounter malicious infrastructure targeting credentials or payment cards, submit the URL to public security watchdogs:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <a
            href="https://safebrowsing.google.com/safebrowsing/report_phish/"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-600 transition-all group flex flex-col justify-between"
          >
            <div>
              <span className="font-bold text-slate-200 group-hover:text-cyan-300 flex items-center justify-between">
                <span>Google Safe Browsing</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Blocks malicious sites across Chrome, Firefox, and Safari for billions of web users.
              </p>
            </div>
          </a>

          <a
            href="https://apwg.org/reportphishing/"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-600 transition-all group flex flex-col justify-between"
          >
            <div>
              <span className="font-bold text-slate-200 group-hover:text-cyan-300 flex items-center justify-between">
                <span>Anti-Phishing Working Group (APWG)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Global consortium sharing phishing telemetry directly with law enforcement and registrars.
              </p>
            </div>
          </a>

          <a
            href="https://www.cisa.gov/report"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-600 transition-all group flex flex-col justify-between"
          >
            <div>
              <span className="font-bold text-slate-200 group-hover:text-cyan-300 flex items-center justify-between">
                <span>CISA Incident Reporting</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                U.S. Cybersecurity and Infrastructure Security Agency national threat reporting portal.
              </p>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
};
