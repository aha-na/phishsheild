import React, { useState } from 'react';
import {
  QrCode,
  X,
  Upload,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FileImage,
} from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDecodedUrl: (url: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onDecodedUrl,
}) => {
  const [decodedUrl, setDecodedUrl] = useState('');
  const [selectedPresetLabel, setSelectedPresetLabel] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);

  if (!isOpen) return null;

  const qrPresets = [
    {
      label: 'Fake Banking Quishing Attack',
      url: 'http://192.168.1.104/secure-chase-login/verify.html',
      threat: 'Direct IP + Phishing Form',
    },
    {
      label: 'Typosquatted E-Commerce Quishing',
      url: 'https://paypa1-security-verification.xyz/account/confirm-identity',
      threat: 'Brand Impersonation + High Risk TLD',
    },
    {
      label: 'Legitimate Corporate Resource',
      url: 'https://www.chase.com/personal/banking',
      threat: 'Verified Institutional Domain',
    },
  ];

  const handleSelectPreset = (preset: (typeof qrPresets)[0]) => {
    setSelectedPresetLabel(preset.label);
    setIsDecoding(true);
    setTimeout(() => {
      setIsDecoding(false);
      setDecodedUrl(preset.url);
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsDecoding(true);
    // Simulate reading and decoding QR image payload
    setTimeout(() => {
      setIsDecoding(false);
      setSelectedPresetLabel(file.name);
      setDecodedUrl('https://login-appleid-verify.cloud-services.workers.dev/auth/v2');
    }, 600);
  };

  const handleConfirmScan = () => {
    if (!decodedUrl) return;
    onDecodedUrl(decodedUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">QR Code / Quishing Scanner</h3>
              <p className="text-xs text-slate-400">Extract hidden URLs from QR barcodes & evaluate threat</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Dropzone */}
        <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-6 text-center space-y-2 bg-slate-950/60 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 mx-auto flex items-center justify-center text-cyan-400">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-slate-200">
            Drag & drop QR image or click to browse
          </p>
          <p className="text-[11px] text-slate-400">
            Supports PNG, JPG, WebP formats (scans email posters & receipts)
          </p>
        </div>

        {/* Sample QR Presets */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Or test with sample Quishing vectors:
          </span>
          <div className="space-y-2">
            {qrPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedPresetLabel === preset.label
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">{preset.label}</span>
                  <span className="text-[11px] text-slate-400">{preset.threat}</span>
                </div>
                <QrCode className="w-4 h-4 text-slate-500 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Decoded URL Output Preview */}
        {decodedUrl && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 animate-fadeIn">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
              Decoded URL Payload:
            </span>
            <p className="font-mono text-xs text-white break-all">{decodedUrl}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmScan}
            disabled={!decodedUrl || isDecoding}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span>Scan Decoded Link</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
