import React from 'react';
import { RiskLevel } from '../types';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

interface RiskGaugeProps {
  score: number;
  predictedClass: RiskLevel;
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  predictedClass,
  confidence,
  size = 'md',
}) => {
  // SVG semi-circle arc math
  const radius = size === 'lg' ? 95 : size === 'sm' ? 50 : 75;
  const strokeWidth = size === 'lg' ? 14 : size === 'sm' ? 8 : 12;
  const circumference = Math.PI * radius; // 180 degree semi-circle
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColorConfig = () => {
    if (predictedClass === 'High Risk') {
      return {
        stroke: '#f43f5e',
        glow: 'rgba(244, 63, 94, 0.3)',
        textColor: 'text-rose-400',
        badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-800/80',
        icon: ShieldAlert,
        label: 'High Phishing Risk',
      };
    }
    if (predictedClass === 'Suspicious') {
      return {
        stroke: '#f59e0b',
        glow: 'rgba(245, 158, 11, 0.3)',
        textColor: 'text-amber-400',
        badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
        icon: AlertTriangle,
        label: 'Suspicious Indicators',
      };
    }
    return {
      stroke: '#10b981',
      glow: 'rgba(16, 185, 129, 0.3)',
      textColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
      icon: ShieldCheck,
      label: 'Verified Safe / Low Risk',
    };
  };

  const config = getColorConfig();
  const Icon = config.icon;

  const dimensions =
    size === 'lg'
      ? { width: 260, height: 160, viewWidth: 240, viewHeight: 140 }
      : size === 'sm'
      ? { width: 140, height: 90, viewWidth: 140, viewHeight: 90 }
      : { width: 210, height: 130, viewWidth: 200, viewHeight: 120 };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <svg
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.viewWidth} ${dimensions.viewHeight}`}
          className="overflow-visible"
        >
          {/* Subtle Outer Glow Filter */}
          <defs>
            <filter id={`gauge-glow-${predictedClass}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor={config.stroke} floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Background track arc */}
          <path
            d={`M ${dimensions.viewWidth / 2 - radius} ${dimensions.viewHeight - 15} A ${radius} ${radius} 0 0 1 ${
              dimensions.viewWidth / 2 + radius
            } ${dimensions.viewHeight - 15}`}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Colored progress arc */}
          <path
            d={`M ${dimensions.viewWidth / 2 - radius} ${dimensions.viewHeight - 15} A ${radius} ${radius} 0 0 1 ${
              dimensions.viewWidth / 2 + radius
            } ${dimensions.viewHeight - 15}`}
            fill="none"
            stroke={config.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter={`url(#gauge-glow-${predictedClass})`}
            className="transition-all duration-1000 ease-out"
          />

          {/* Scale labels */}
          <text
            x={dimensions.viewWidth / 2 - radius - 5}
            y={dimensions.viewHeight - 2}
            fill="#64748b"
            fontSize="10"
            textAnchor="middle"
            fontWeight="600"
          >
            0%
          </text>
          <text
            x={dimensions.viewWidth / 2}
            y={dimensions.viewHeight - radius - 18}
            fill="#64748b"
            fontSize="10"
            textAnchor="middle"
            fontWeight="600"
          >
            50%
          </text>
          <text
            x={dimensions.viewWidth / 2 + radius + 5}
            y={dimensions.viewHeight - 2}
            fill="#64748b"
            fontSize="10"
            textAnchor="middle"
            fontWeight="600"
          >
            100%
          </text>
        </svg>

        {/* Center overlay for score */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <span className={`text-4xl font-extrabold tracking-tight ${config.textColor}`}>
            {score}%
          </span>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Risk Probability
          </span>
        </div>
      </div>

      {/* Class badge & confidence */}
      <div className="mt-3 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.badgeBg}`}
        >
          <Icon className="w-3.5 h-3.5" />
          <span>{config.label}</span>
        </span>
        <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
          Confidence: <strong className="text-slate-200">{confidence}%</strong>
        </span>
      </div>
    </div>
  );
};
