import React from 'react';
import { Play, Clock, XCircle, RefreshCw, RotateCcw } from 'lucide-react';
import { MetricCard } from '../ui/MetricCard';
import { podSummary } from '../../data/mockClusterData';

interface PodSummaryCardsProps {
  loading?: boolean;
}

export const PodSummaryCards: React.FC<PodSummaryCardsProps> = ({ loading }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    <MetricCard title="Running Pods" value={podSummary.running} icon={Play} iconColor="text-emerald-500" loading={loading} />
    <MetricCard title="Pending Pods" value={podSummary.pending} icon={Clock} iconColor="text-amber-500" loading={loading} />
    <MetricCard title="Failed Pods" value={podSummary.failed} icon={XCircle} iconColor="text-red-500" loading={loading} />
    <MetricCard title="CrashLoopBackOff" value={podSummary.crashLoopBackOff} icon={RefreshCw} iconColor="text-red-600" loading={loading} />
    <MetricCard title="Restarting" value={podSummary.restarting} icon={RotateCcw} iconColor="text-blue-500" loading={loading} />
  </div>
);
