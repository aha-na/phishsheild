import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { Footer } from './components/Footer';
import { ScannerView } from './components/ScannerView';
import { ScanResultView } from './components/ScanResultView';
import { HistoryView } from './components/HistoryView';
import { AnalyticsView } from './components/AnalyticsView';
import { ModelInsightsView } from './components/ModelInsightsView';
import { LearnProtectView } from './components/LearnProtectView';
import { ExtensionSimulatorView } from './components/ExtensionSimulatorView';
import { QrScannerModal } from './components/QrScannerModal';
import { ScanResult } from './types';
import { analyzeUrl } from './utils/mlEngine';
import {
  clearHistory,
  deleteScan,
  loadScanHistory,
  saveScan,
  updateScanFeedback,
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('scanner');
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Load history from persistence on mount
  useEffect(() => {
    const loaded = loadScanHistory();
    setScans(loaded);
    if (loaded.length > 0 && !currentScan) {
      setCurrentScan(loaded[0]);
    }
  }, []);

  const executeScan = (rawUrl: string) => {
    setIsScanning(true);
    setScanStage('Extracting lexical tokens...');

    setTimeout(() => {
      setScanStage('Computing Shannon entropy & structural vector...');
      setTimeout(() => {
        setScanStage('Evaluating XGBoost ensemble trees...');
        setTimeout(() => {
          setScanStage('Synthesizing SHAP explainability matrix...');
          setTimeout(() => {
            const result = analyzeUrl(rawUrl);
            const updated = saveScan(result);
            setScans(updated);
            setCurrentScan(result);
            setIsScanning(false);
            setScanStage('');
            setActiveTab('result');
          }, 250);
        }, 250);
      }, 250);
    }, 250);
  };

  const handleFeedback = (
    scanId: string,
    type: 'correct' | 'false_positive' | 'false_negative'
  ) => {
    const updated = updateScanFeedback(scanId, type);
    setScans(updated);
    if (currentScan && currentScan.id === scanId) {
      setCurrentScan({ ...currentScan, userFeedback: type });
    }
  };

  const handleDeleteScan = (id: string) => {
    const updated = deleteScan(id);
    setScans(updated);
    if (currentScan && currentScan.id === id) {
      setCurrentScan(updated[0] || null);
    }
  };

  const handleClearHistory = () => {
    const updated = clearHistory();
    setScans(updated);
    setCurrentScan(null);
  };

  const handleSelectPastScan = (scan: ScanResult) => {
    setCurrentScan(scan);
    setActiveTab('result');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveResult={Boolean(currentScan)}
        historyCount={scans.length}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'scanner' && (
          <ScannerView
            onScan={executeScan}
            isScanning={isScanning}
            scanStage={scanStage}
            recentScan={currentScan}
            onViewResult={() => setActiveTab('result')}
            onOpenQrModal={() => setIsQrModalOpen(true)}
          />
        )}

        {activeTab === 'result' && currentScan && (
          <ScanResultView
            scan={currentScan}
            onBackToScanner={() => setActiveTab('scanner')}
            onFeedback={handleFeedback}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            scans={scans}
            onSelectScan={handleSelectPastScan}
            onDeleteScan={handleDeleteScan}
            onClearHistory={handleClearHistory}
            onNavigateToScanner={() => setActiveTab('scanner')}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsView scans={scans} />}

        {activeTab === 'model-insights' && <ModelInsightsView />}

        {activeTab === 'learn' && <LearnProtectView />}

        {activeTab === 'extension' && <ExtensionSimulatorView />}
      </main>

      {/* Footer */}
      <Footer onNavigate={setActiveTab} />

      {/* QR Code / Quishing Scanner Modal */}
      <QrScannerModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onDecodedUrl={(url) => executeScan(url)}
      />
    </div>
  );
}
