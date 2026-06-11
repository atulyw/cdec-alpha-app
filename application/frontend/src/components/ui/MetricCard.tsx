import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: { value: number; label?: string };
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-500',
  trend,
  loading,
}) => {
  if (loading) {
    return (
      <div className="card p-5">
        <div className="skeleton h-10 w-10 rounded-lg mb-4" />
        <div className="skeleton h-4 w-24 mb-2" />
        <div className="skeleton h-8 w-16" />
      </div>
    );
  }

  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
        ? TrendingDown
        : Minus
    : null;

  const trendColor = trend
    ? trend.value > 0
      ? 'text-emerald-500'
      : trend.value < 0
        ? 'text-red-500'
        : 'text-[var(--text-muted)]'
    : '';

  return (
    <div className="card card-hover p-5 group">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg bg-[var(--surface-bg)] ${iconColor} transition-transform group-hover:scale-105`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && TrendIcon && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="h-3.5 w-3.5" />
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      <p className="text-2xl font-bold mt-1 font-mono" style={{ color: 'var(--text-primary)' }}>{value}</p>
      {subtitle && (
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
      )}
    </div>
  );
};
