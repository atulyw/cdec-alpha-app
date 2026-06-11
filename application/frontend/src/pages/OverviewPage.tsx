import React, { useState, useEffect } from 'react';
import {
  Server,
  Cpu,
  Box,
  AlertTriangle,
  Rocket,
  HardDrive,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { MetricCard } from '../components/ui/MetricCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { HealthScore } from '../components/ui/HealthScore';
import { StatusChip } from '../components/ui/StatusChip';
import {
  clusterOverview,
  resourceTrend,
  podDistribution,
  nodeAvailability,
  clusters,
} from '../data/mockClusterData';

export const OverviewPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const overallHealth = Math.round(
    clusters.reduce((sum, c) => sum + c.healthScore, 0) / clusters.length
  );

  return (
    <div className="space-y-6">
      {/* Executive Overview */}
      <section aria-labelledby="exec-overview">
        <h3 id="exec-overview" className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
          Executive Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard title="Total Clusters" value={clusterOverview.totalClusters} icon={Server} iconColor="text-blue-500" trend={{ value: 0 }} loading={loading} />
          <MetricCard title="Healthy Nodes" value={`${clusterOverview.healthyNodes}/${clusterOverview.totalNodes}`} icon={Cpu} iconColor="text-emerald-500" trend={{ value: 2 }} loading={loading} />
          <MetricCard title="Running Pods" value={clusterOverview.runningPods} icon={Box} iconColor="text-indigo-500" trend={{ value: 5 }} loading={loading} />
          <MetricCard title="Failed Pods" value={clusterOverview.failedPods} icon={AlertTriangle} iconColor="text-red-500" trend={{ value: -12 }} loading={loading} />
          <MetricCard title="Active Deployments" value={clusterOverview.activeDeployments} icon={Rocket} iconColor="text-violet-500" loading={loading} />
          <MetricCard title="Storage Used" value={`${clusterOverview.storageUsage}%`} icon={HardDrive} iconColor="text-amber-500" loading={loading} />
        </div>
      </section>

      {/* Health + Resource Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score */}
        <div className="card p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold self-start mb-4" style={{ color: 'var(--text-secondary)' }}>
            Platform Health Score
          </h3>
          {loading ? (
            <div className="skeleton h-32 w-32 rounded-full" />
          ) : (
            <HealthScore score={overallHealth} />
          )}
        </div>

        {/* Resource Consumption */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-5" style={{ color: 'var(--text-secondary)' }}>
            Resource Consumption
          </h3>
          {loading ? (
            <div className="space-y-4">
              <div className="skeleton h-8 w-full" />
              <div className="skeleton h-8 w-full" />
              <div className="skeleton h-8 w-full" />
            </div>
          ) : (
            <div className="space-y-5">
              <ProgressBar value={clusterOverview.cpuUsage} label="CPU Utilization" />
              <ProgressBar value={clusterOverview.memoryUsage} label="Memory Utilization" />
              <ProgressBar value={clusterOverview.storageUsage} label="Storage Utilization" />
            </div>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Trend */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
            Resource Usage Trend
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Last 24 hours</p>
          {loading ? (
            <div className="skeleton h-56 w-full rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={resourceTrend}>
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface-card)',
                    border: '1px solid var(--surface-border)',
                    borderRadius: '0.5rem',
                    fontSize: '0.8125rem',
                  }}
                />
                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fill="url(#cpuGrad)" strokeWidth={2} name="CPU %" />
                <Area type="monotone" dataKey="memory" stroke="#10b981" fill="url(#memGrad)" strokeWidth={2} name="Memory %" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pod Distribution */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
            Pod Distribution
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>By status across all clusters</p>
          {loading ? (
            <div className="skeleton h-56 w-full rounded-lg" />
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie
                    data={podDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {podDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface-card)',
                      border: '1px solid var(--surface-border)',
                      borderRadius: '0.5rem',
                      fontSize: '0.8125rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {podDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                    </div>
                    <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cluster Health + Node Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
            Cluster Health Overview
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-14 w-full" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {clusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--surface-bg)] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <HealthScore score={cluster.healthScore} size="sm" label="" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{cluster.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {cluster.region} · K8s {cluster.version} · {cluster.nodes} nodes · {cluster.pods} pods
                      </p>
                    </div>
                  </div>
                  <StatusChip
                    label={cluster.health.charAt(0).toUpperCase() + cluster.health.slice(1)}
                    variant={cluster.health === 'healthy' ? 'healthy' : cluster.health === 'warning' ? 'warning' : 'critical'}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
            Node Availability
          </h3>
          {loading ? (
            <div className="skeleton h-48 w-full rounded-lg" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={nodeAvailability}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {nodeAvailability.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface-card)',
                      border: '1px solid var(--surface-border)',
                      borderRadius: '0.5rem',
                      fontSize: '0.8125rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {nodeAvailability.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                    </div>
                    <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
