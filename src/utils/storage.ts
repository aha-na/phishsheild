import { ScanResult } from '../types';
import { getInitialSeedScans } from './sampleData';

const STORAGE_KEY = 'phishshield_scan_history_v1';
const FEEDBACK_KEY = 'phishshield_retrain_queue_v1';

export function loadScanHistory(): ScanResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSeedScans();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialSeedScans();
  }
}

export function saveScan(scan: ScanResult): ScanResult[] {
  try {
    const current = loadScanHistory();
    // Prepend new scan, deduplicate by id
    const updated = [scan, ...current.filter((item) => item.id !== scan.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [scan];
  }
}

export function updateScanFeedback(
  scanId: string,
  feedback: 'correct' | 'false_positive' | 'false_negative',
  notes?: string
): ScanResult[] {
  const current = loadScanHistory();
  const updated = current.map((item) => {
    if (item.id === scanId) {
      return {
        ...item,
        userFeedback: feedback,
        feedbackNotes: notes || item.feedbackNotes,
      };
    }
    return item;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Also append to retraining queue
    const targetScan = updated.find((s) => s.id === scanId);
    if (targetScan) {
      const queueRaw = localStorage.getItem(FEEDBACK_KEY);
      const queue = queueRaw ? JSON.parse(queueRaw) : [];
      queue.push({
        scanId,
        url: targetScan.url,
        features: targetScan.features,
        predictedClass: targetScan.predictedClass,
        userFeedback: feedback,
        timestamp: Date.now(),
      });
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(queue));
    }
  } catch (err) {
    console.error('Storage feedback error:', err);
  }

  return updated;
}

export function deleteScan(scanId: string): ScanResult[] {
  const current = loadScanHistory();
  const updated = current.filter((item) => item.id !== scanId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error deleting scan:', err);
  }
  return updated;
}

export function clearHistory(): ScanResult[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing history:', err);
  }
  return [];
}

export function exportHistoryCsv(scans: ScanResult[]): void {
  const headers = ['Timestamp', 'URL', 'Domain', 'PredictedClass', 'RiskScore', 'Confidence', 'TopFactor', 'UserFeedback'];
  const rows = scans.map((s) => [
    new Date(s.timestamp).toISOString(),
    `"${s.url.replace(/"/g, '""')}"`,
    `"${s.domain}"`,
    s.predictedClass,
    s.riskScore,
    `${s.confidence}%`,
    `"${s.shapFactors[0]?.displayName || 'N/A'}"`,
    s.userFeedback || 'unreviewed',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `phishshield-scans-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportHistoryJson(scans: ScanResult[]): void {
  const jsonContent = JSON.stringify(scans, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `phishshield-scans-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
