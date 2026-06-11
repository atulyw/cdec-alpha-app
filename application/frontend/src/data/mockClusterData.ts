export type PodStatus = 'Running' | 'Pending' | 'Failed' | 'CrashLoopBackOff' | 'Restarting' | 'Succeeded';

export interface Pod {
  id: string;
  name: string;
  namespace: string;
  cluster: string;
  status: PodStatus;
  restarts: number;
  cpu: string;
  memory: string;
  age: string;
  node: string;
}

export interface ClusterInfo {
  id: string;
  name: string;
  region: string;
  version: string;
  nodes: number;
  healthyNodes: number;
  pods: number;
  health: 'healthy' | 'warning' | 'critical';
  healthScore: number;
}

export const clusterOverview = {
  totalClusters: 4,
  healthyNodes: 18,
  totalNodes: 20,
  runningPods: 142,
  failedPods: 3,
  activeDeployments: 28,
  cpuUsage: 67,
  memoryUsage: 54,
  storageUsage: 38,
};

export const podSummary = {
  running: 142,
  pending: 5,
  failed: 3,
  crashLoopBackOff: 2,
  restarting: 1,
};

export const clusters: ClusterInfo[] = [
  { id: 'c1', name: 'prod-us-east-1', region: 'us-east-1', version: '1.29.2', nodes: 8, healthyNodes: 8, pods: 64, health: 'healthy', healthScore: 98 },
  { id: 'c2', name: 'prod-eu-west-1', region: 'eu-west-1', version: '1.29.2', nodes: 6, healthyNodes: 6, pods: 48, health: 'healthy', healthScore: 96 },
  { id: 'c3', name: 'staging-us-west-2', region: 'us-west-2', version: '1.28.5', nodes: 4, healthyNodes: 3, pods: 22, health: 'warning', healthScore: 82 },
  { id: 'c4', name: 'dev-ap-south-1', region: 'ap-south-1', version: '1.28.5', nodes: 2, healthyNodes: 1, pods: 8, health: 'critical', healthScore: 61 },
];

export const pods: Pod[] = [
  { id: 'p1', name: 'auth-service-7d4f8b9c6-xk2m9', namespace: 'backend', cluster: 'prod-us-east-1', status: 'Running', restarts: 0, cpu: '120m', memory: '256Mi', age: '3d', node: 'ip-10-0-1-42' },
  { id: 'p2', name: 'course-service-5b8c7d6e4-pn7k2', namespace: 'backend', cluster: 'prod-us-east-1', status: 'Running', restarts: 0, cpu: '95m', memory: '192Mi', age: '3d', node: 'ip-10-0-1-43' },
  { id: 'p3', name: 'enroll-service-9a2b3c4d5-mj8w1', namespace: 'backend', cluster: 'prod-us-east-1', status: 'Running', restarts: 1, cpu: '88m', memory: '180Mi', age: '2d', node: 'ip-10-0-1-42' },
  { id: 'p4', name: 'prometheus-server-0', namespace: 'monitoring', cluster: 'prod-us-east-1', status: 'Running', restarts: 0, cpu: '340m', memory: '1.2Gi', age: '7d', node: 'ip-10-0-1-44' },
  { id: 'p5', name: 'grafana-6f8d9e0a1-bq3n5', namespace: 'monitoring', cluster: 'prod-eu-west-1', status: 'Running', restarts: 0, cpu: '65m', memory: '320Mi', age: '7d', node: 'ip-10-1-2-18' },
  { id: 'p6', name: 'nginx-ingress-4c5d6e7f8-rt9p0', namespace: 'ingress', cluster: 'prod-eu-west-1', status: 'Running', restarts: 0, cpu: '45m', memory: '128Mi', age: '14d', node: 'ip-10-1-2-19' },
  { id: 'p7', name: 'redis-cache-0', namespace: 'cache', cluster: 'staging-us-west-2', status: 'Pending', restarts: 0, cpu: '-', memory: '-', age: '12m', node: '-' },
  { id: 'p8', name: 'worker-batch-3x7y9z-a1b2c', namespace: 'jobs', cluster: 'staging-us-west-2', status: 'Failed', restarts: 4, cpu: '0m', memory: '0Mi', age: '1h', node: 'ip-10-2-3-55' },
  { id: 'p9', name: 'api-gateway-2e4f6g8h-j4k6l', namespace: 'gateway', cluster: 'staging-us-west-2', status: 'CrashLoopBackOff', restarts: 12, cpu: '15m', memory: '64Mi', age: '6h', node: 'ip-10-2-3-56' },
  { id: 'p10', name: 'frontend-8a9b0c1d2-e3f4g', namespace: 'frontend', cluster: 'prod-us-east-1', status: 'Running', restarts: 0, cpu: '22m', memory: '96Mi', age: '1d', node: 'ip-10-0-1-43' },
  { id: 'p11', name: 'fluentd-daemonset-abc12', namespace: 'logging', cluster: 'dev-ap-south-1', status: 'Restarting', restarts: 3, cpu: '30m', memory: '110Mi', age: '45m', node: 'ip-10-3-4-72' },
  { id: 'p12', name: 'cert-manager-webhook-xyz', namespace: 'cert-manager', cluster: 'dev-ap-south-1', status: 'Failed', restarts: 8, cpu: '0m', memory: '0Mi', age: '2h', node: 'ip-10-3-4-71' },
];

export const resourceTrend = [
  { time: '00:00', cpu: 42, memory: 38, pods: 128 },
  { time: '04:00', cpu: 35, memory: 36, pods: 125 },
  { time: '08:00', cpu: 58, memory: 45, pods: 135 },
  { time: '12:00', cpu: 72, memory: 52, pods: 140 },
  { time: '16:00', cpu: 68, memory: 55, pods: 142 },
  { time: '20:00', cpu: 55, memory: 48, pods: 138 },
  { time: 'Now', cpu: 67, memory: 54, pods: 142 },
];

export const podDistribution = [
  { name: 'Running', value: 142, color: '#10b981' },
  { name: 'Pending', value: 5, color: '#f59e0b' },
  { name: 'Failed', value: 3, color: '#ef4444' },
  { name: 'CrashLoop', value: 2, color: '#dc2626' },
  { name: 'Restarting', value: 1, color: '#3b82f6' },
];

export const nodeAvailability = [
  { name: 'Ready', value: 18, color: '#10b981' },
  { name: 'NotReady', value: 1, color: '#ef4444' },
  { name: 'SchedulingDisabled', value: 1, color: '#f59e0b' },
];
