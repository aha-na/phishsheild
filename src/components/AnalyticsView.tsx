import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  PieChart as PieIcon,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { ScanResult } from '../types';

interface AnalyticsViewProps {
  scans: ScanResult[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ scans }) => {
  // Aggregate Metrics
  const stats = useMemo(() => {
    const total = scans.length;
    if (total === 0) {
      return { total: 0, highRisk: 0, suspicious: 0, safe: 0, highRiskPct: 0, avgRiskScore: 0 };
    }

    const highRisk = scans.filter((s) => s.predictedClass === 'High Risk').length;
    const suspicious = scans.filter((s) => s.predictedClass === 'Suspicious').length;
    const safe = scans.filter((s) => s.predictedClass === 'Safe').length;
    const sumRisk = scans.reduce((acc, s) => acc + s.riskScore, 0);

    return {
      total,
      highRisk,
      suspicious,
      safe,
      highRiskPct: Number(((highRisk / total) * 100).toFixed(1)),
      suspiciousPct: Number(((suspicious / total) * 100).toFixed(1)),
      safePct: Number(((safe / total) * 100).toFixed(1)),
      avgRiskScore: Math.round(sumRisk / total),
    };
  }, [scans]);

  // Distribution Pie Data
  const distributionData = [
    { name: 'High Risk', value: stats.highRisk, color: '#f43f5e' },
    { name: 'Suspicious', value: stats.suspicious, color: '#f59e0b' },
    { name: 'Safe', value: stats.safe, color: '#10b981' },
  ];

  // Most Frequent Phishing Signals Detected
  const topSignalsData = useMemo(() => {
    const frequencyMap: Record<string, number> = {};
    scans.forEach((scan) => {
      scan.shapFactors.forEach((factor) => {
        if (factor.isPositive) {
          frequencyMap[factor.displayName] = (frequencyMap[factor.displayName] || 0) + 1;
        }
      });
    });

    return Object.entries(frequencyMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: stats.total > 0 ? Math.round((count / stats.total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [scans, stats.total]);

  // Chronological 7-Day Trend Data
  const trendData = useMemo(() => {
    const daysMap: Record<string, { date: string; highRisk: number; suspicious: number; safe: number }> = {};
    const now = Date.now();

    // Initialize past 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 24 * 3600 * 1000);
      const dateKey = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      daysMap[dateKey] = { date: dateKey, highRisk: 0, suspicious: 0, safe: 0 };
    }

    scans.forEach((scan) => {
      const scanDate = new Date(scan.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
      if (daysMap[scanDate]) {
        if (scan.predictedClass === 'High Risk') daysMap[scanDate].highRisk += 1;
        else if (scan.predictedClass === 'Suspicious') daysMap[scanDate].suspicious += 1;
        else daysMap[scanDate].safe += 1;
      }
    });

    return Object.values(daysMap);
  }, [scans]);

  // TLD Distribution
  const tldData = useMemo(() => {
    const tldMap: Record<string, { total: number; highRisk: number }> = {};
    scans.forEach((scan) => {
      const tld = scan.parsedUrl.tld || 'other';
      if (!tldMap[tld]) tldMap[tld] = { total: 0, highRisk: 0 };
      tldMap[tld].total += 1;
      if (scan.predictedClass === 'High Risk') tldMap[tld].highRisk += 1;
    });

    return Object.entries(tldMap)
      .map(([tld, counts]) => ({
        tld: `.${tld}`,
        total: counts.total,
        highRisk: counts.highRisk,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [scans]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Real-Time Phishing Threat Intelligence</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Threat Analytics & Signal Trends
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Aggregated scan metrics, attack vector distribution, and top suspicious patterns computed across inspected URLs.
        </p>
      </div>

      {/* Aggregate KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Scanned URLs
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{stats.total}</span>
            <span className="text-xs text-slate-500 font-mono">100% telemetry</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-900/40 space-y-1">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            High Risk Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400">{stats.highRiskPct}%</span>
            <span className="text-xs text-rose-300/70 font-mono">{stats.highRisk} scans</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-900/40 space-y-1">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Suspicious Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">{stats.suspiciousPct}%</span>
            <span className="text-xs text-amber-300/70 font-mono">{stats.suspicious} scans</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-900/40 space-y-1">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Safe / Verified Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">{stats.safePct}%</span>
            <span className="text-xs text-emerald-300/70 font-mono">{stats.safe} scans</span>
          </div>
        </div>
      </div>

      {/* Chart Row 1: Trend over time + Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Scan Volume & Risk Class Trends (Past 7 Days)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Stacked scan volume highlighting malicious vs safe URL velocity.
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSusp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="highRisk" name="High Risk" stroke="#f43f5e" fillOpacity={1} fill="url(#colorHigh)" />
                <Area type="monotone" dataKey="suspicious" name="Suspicious" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSusp)" />
                <Area type="monotone" dataKey="safe" name="Safe" stroke="#10b981" fillOpacity={1} fill="url(#colorSafe)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Doughnut */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <span>Risk Classification Ratio</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown of total evaluated samples.
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center text-xs">
            <div>
              <span className="text-[10px] text-rose-400 font-bold block">HIGH RISK</span>
              <strong className="text-slate-200">{stats.highRisk}</strong>
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-bold block">SUSPICIOUS</span>
              <strong className="text-slate-200">{stats.suspicious}</strong>
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 font-bold block">SAFE</span>
              <strong className="text-slate-200">{stats.safe}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Row 2: Top Detected Phishing Signals & TLD Risk Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Common Phishing Signals Bar Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Most Frequent Phishing Signals Detected</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Warning features most frequently triggering risk elevations in user scans.
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSignalsData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={10}
                  width={140}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} occurrences`, 'Frequency']}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Level Domain (TLD) Threat Matrix */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Top-Level Domain (TLD) Threat Profile</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison of scanned extensions and proportion of malicious activity.
            </p>
          </div>

          <div className="space-y-3">
            {tldData.map((t, idx) => {
              const riskPercentage = Math.round((t.highRisk / t.total) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-200">{t.tld}</span>
                    <span className="text-slate-400">
                      {t.highRisk} / {t.total} malicious (
                      <strong className={riskPercentage > 50 ? 'text-rose-400' : 'text-emerald-400'}>
                        {riskPercentage}%
                      </strong>
                      )
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden flex">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all"
                      style={{ width: `${riskPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            💡 <strong>Security Note:</strong> High-abuse disposable TLDs like <code>.xyz</code>, <code>.top</code>, and <code>.tk</code> are favored by automated phishing kits due to negligible registration fees and lax registrar identity validation.
          </div>
        </div>
      </div>
    </div>
  );
};
