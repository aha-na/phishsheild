import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Trash2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react';
import { RiskLevel, ScanResult } from '../types';
import { exportHistoryCsv, exportHistoryJson } from '../utils/storage';

interface HistoryViewProps {
  scans: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
  onDeleteScan: (id: string) => void;
  onClearHistory: () => void;
  onNavigateToScanner: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  scans,
  onSelectScan,
  onDeleteScan,
  onClearHistory,
  onNavigateToScanner,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'All' | RiskLevel>('All');
  const [sortField, setSortField] = useState<'date' | 'risk'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredScans = useMemo(() => {
    return scans
      .filter((scan) => {
        const matchesQuery =
          scan.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scan.domain.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRisk =
          selectedRiskFilter === 'All' || scan.predictedClass === selectedRiskFilter;
        return matchesQuery && matchesRisk;
      })
      .sort((a, b) => {
        if (sortField === 'date') {
          return sortOrder === 'desc' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp;
        } else {
          return sortOrder === 'desc' ? b.riskScore - a.riskScore : a.riskScore - b.riskScore;
        }
      });
  }, [scans, searchQuery, selectedRiskFilter, sortField, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Scan History & Audit Log
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Searchable repository of earlier scanned URLs, risk scores, and feedback reviews.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportHistoryCsv(scans)}
            disabled={scans.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 disabled:opacity-50 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => exportHistoryJson(scans)}
            disabled={scans.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 disabled:opacity-50 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>

          {scans.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all scan history?')) {
                  onClearHistory();
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/40 border border-rose-900/60 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by URL, domain, or token..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Risk Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['All', 'High Risk', 'Suspicious', 'Safe'] as const).map((filter) => {
            const isActive = selectedRiskFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedRiskFilter(filter)}
                className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isActive
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as 'date' | 'risk')}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="date">Sort by Date</option>
            <option value="risk">Sort by Risk Score</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title="Toggle sort direction"
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scans Table */}
      {filteredScans.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <AlertTriangle className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">No Scans Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {scans.length === 0
              ? 'Your scan history is empty. Analyze a URL to populate your risk audit history.'
              : 'No scanned URLs matched your current search or risk filters.'}
          </p>
          <button
            onClick={onNavigateToScanner}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Scan New URL</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Risk Class</th>
                <th className="py-3.5 px-4">Target URL / Domain</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Top Warning Signal</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Timestamp</th>
                <th className="py-3.5 px-4 text-center">Feedback</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredScans.map((scan) => {
                const isHigh = scan.predictedClass === 'High Risk';
                const isSusp = scan.predictedClass === 'Suspicious';
                const topFactor = scan.shapFactors.find((f) => f.isPositive) || scan.shapFactors[0];

                return (
                  <tr
                    key={scan.id}
                    className="hover:bg-slate-900/50 transition-colors group"
                  >
                    {/* Class & Score Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] border ${
                            isHigh
                              ? 'bg-rose-950/80 text-rose-300 border-rose-800/80'
                              : isSusp
                              ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                          }`}
                        >
                          {isHigh ? (
                            <ShieldAlert className="w-3 h-3" />
                          ) : isSusp ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : (
                            <ShieldCheck className="w-3 h-3" />
                          )}
                          <span>{scan.predictedClass}</span>
                        </span>
                        <span className="font-mono text-slate-400 font-semibold">
                          {scan.riskScore}%
                        </span>
                      </div>
                    </td>

                    {/* URL & Domain */}
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-200 truncate">{scan.domain}</span>
                        <span className="font-mono text-slate-400 text-[11px] truncate">
                          {scan.url}
                        </span>
                      </div>
                    </td>

                    {/* Top Signal */}
                    <td className="py-3.5 px-4 hidden sm:table-cell text-slate-300">
                      {topFactor ? (
                        <span className="text-slate-300 flex items-center gap-1.5 truncate max-w-xs">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              topFactor.isPositive ? 'bg-rose-400' : 'bg-emerald-400'
                            }`}
                          />
                          <span className="truncate">{topFactor.displayName}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">Normal heuristics</span>
                      )}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 hidden md:table-cell whitespace-nowrap text-slate-400">
                      {new Date(scan.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      <span className="text-slate-500">
                        {new Date(scan.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>

                    {/* User Feedback Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {scan.userFeedback ? (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            scan.userFeedback === 'correct'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : scan.userFeedback === 'false_positive'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {scan.userFeedback.replace('_', ' ')}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-600">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectScan(scan)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/80 text-cyan-300 hover:text-cyan-200 border border-slate-700 hover:border-cyan-600 font-semibold transition-colors flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => onDeleteScan(scan.id)}
                          title="Delete from history"
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
