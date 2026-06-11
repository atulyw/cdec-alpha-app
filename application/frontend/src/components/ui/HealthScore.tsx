import React from 'react';

interface HealthScoreProps {
  score: number;
  label?: string;
  size?: 'sm' | 'lg';
}

export const HealthScore: React.FC<HealthScoreProps> = ({ score, label = 'Health Score', size = 'lg' }) => {
  const radius = size === 'lg' ? 54 : 36;
  const stroke = size === 'lg' ? 8 : 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 90 ? '#10b981' : score >= 75 ? '#f59e0b' : '#ef4444';
  const status = score >= 90 ? 'Healthy' : score >= 75 ? 'Warning' : 'Critical';

  const dim = size === 'lg' ? 128 : 88;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90">
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="var(--surface-bg)"
            strokeWidth={stroke}
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold font-mono ${size === 'lg' ? 'text-3xl' : 'text-xl'}`} style={{ color }}>
            {score}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{status}</span>
        </div>
      </div>
      {label && (
        <p className="text-sm font-medium mt-2" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      )}
    </div>
  );
};
