# Datadog Setup on AWS EKS Using Helm

Deploy the [Datadog Agent](https://docs.datadoghq.com/containers/kubernetes/installation/?tab=helm) on Amazon EKS using the official Datadog Helm chart. This guide covers repository setup, secret management, production-oriented values, installation, verification, upgrades, rollback, and uninstall.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Step 1 — Add Datadog Helm Repository](#step-1--add-datadog-helm-repository)
- [Step 2 — Create Namespace](#step-2--create-namespace)
- [Step 3 — Create Datadog Secret](#step-3--create-datadog-secret)
- [Step 4 — Create values.yaml](#step-4--create-valuesyaml)
- [Step 5 — Install Datadog](#step-5--install-datadog)
- [Step 6 — Verify Pods](#step-6--verify-pods)
- [Step 7 — Verify DaemonSet](#step-7--verify-daemonset)
- [Step 8 — Verify Agent Health](#step-8--verify-agent-health)
- [Step 9 — Verify Metrics in Datadog](#step-9--verify-metrics-in-datadog)
- [Step 10 — Upgrade Datadog](#step-10--upgrade-datadog)
- [Step 11 — Rollback](#step-11--rollback)
- [Step 12 — Uninstall](#step-12--uninstall)
- [Quick Reference](#quick-reference)

---

## Prerequisites

| Requirement | Description |
|-------------|-------------|
| **AWS EKS cluster** | Running cluster with worker nodes |
| **kubectl** | Configured to access the cluster (`aws eks update-kubeconfig`) |
| **Helm v3** | `helm version` shows v3.x |
| **Datadog account** | Active organization at [Datadog](https://www.datadoghq.com/) |
| **Datadog API Key** | From **Organization Settings → API Keys** |
| **Datadog App Key** | Optional but recommended for full API access |

Verify cluster access:

```bash
kubectl get nodes
```

---

## Step 1 — Add Datadog Helm Repository

```bash
helm repo add datadog https://helm.datadoghq.com
helm repo update
```

Verify the chart is available:

```bash
helm search repo datadog
```

---

## Step 2 — Create Namespace

```bash
kubectl create namespace datadog
```

Verify:

```bash
kubectl get ns datadog
```

---

## Step 3 — Create Datadog Secret

Retrieve your **API Key** from the Datadog portal: **Organization Settings → API Keys**.

Create the secret:

```bash
kubectl create secret generic datadog-secret \
  --from-literal=api-key='<DATADOG_API_KEY>' \
  -n datadog
```

**Recommended** — include the App Key for extended API features:

```bash
kubectl create secret generic datadog-secret \
  --from-literal=api-key='<DATADOG_API_KEY>' \
  --from-literal=app-key='<DATADOG_APP_KEY>' \
  -n datadog \
  --dry-run=client -o yaml | kubectl apply -f -
```

Verify:

```bash
kubectl get secret datadog-secret -n datadog
```

> **Security:** Never commit API keys or App keys to Git. Store secrets in Kubernetes, AWS Secrets Manager, or an External Secrets Operator.

---

## Step 4 — Create values.yaml

An example production configuration is provided in [`values.yaml`](values.yaml):

```yaml
datadog:
  site: datadoghq.eu

  apiKeyExistingSecret: datadog-secret

  logs:
    enabled: true
    containerCollectAll: true

  processAgent:
    enabled: true

  networkMonitoring:
    enabled: true

  orchestratorExplorer:
    enabled: true

  kubeStateMetricsEnabled: true

  clusterChecks:
    enabled: true

  prometheusScrape:
    enabled: true

  admissionController:
    enabled: true

  operator:
    enabled: false

clusterAgent:
  enabled: true

  replicas: 2

  pdb:
    create: true
```

| Setting | Purpose |
|---------|---------|
| `site` | Datadog region (`datadoghq.com`, `datadoghq.eu`, `us3.datadoghq.com`, etc.) |
| `apiKeyExistingSecret` | References the Kubernetes secret created in Step 3 |
| `logs.containerCollectAll` | Collects logs from all containers in the cluster |
| `processAgent` | Enables process-level monitoring |
| `networkMonitoring` | Enables network performance monitoring (NPM) |
| `orchestratorExplorer` | Kubernetes resource explorer in Datadog |
| `kubeStateMetricsEnabled` | Cluster-level Kubernetes state metrics |
| `prometheusScrape` | Auto-discovers and scrapes Prometheus endpoints |
| `admissionController` | Injects Datadog library configs into pods |
| `clusterAgent.replicas: 2` | High availability for the Cluster Agent |
| `clusterAgent.pdb` | Pod Disruption Budget for safer node drains |

> **Note:** Change `site` to match your Datadog organization region. Use `datadoghq.com` for US1, `datadoghq.eu` for EU.

---

## Step 5 — Install Datadog

From the repository root (or the `datadog/` directory):

```bash
helm install datadog-agent \
  datadog/datadog \
  -n datadog \
  -f values.yaml
```

Verify:

```bash
helm list -n datadog
```

Expected output:

```text
STATUS: deployed
```

---

## Step 6 — Verify Pods

```bash
kubectl get pods -n datadog
```

Expected pods (names will vary):

```text
datadog-agent-xxxxx                   Running
datadog-agent-xxxxx                   Running
datadog-agent-cluster-agent-xxxxx     Running
```

Wait until all pods are `Running`:

```bash
kubectl wait --for=condition=Ready pods --all -n datadog --timeout=600s
```

---

## Step 7 — Verify DaemonSet

The Datadog Agent runs as a DaemonSet on every node:

```bash
kubectl get daemonset -n datadog
```

Expected — desired, current, and ready counts should match:

```text
DESIRED = CURRENT = READY
```

---

## Step 8 — Verify Agent Health

Run the agent status command inside a Datadog Agent pod:

```bash
kubectl exec -it -n datadog \
  $(kubectl get pods -n datadog -l app=datadog-agent -o jsonpath='{.items[0].metadata.name}') \
  -- agent status
```

Look for:

```text
API Keys status: OK
Forwarder status: OK
```

If either shows an error, verify the API key secret and `site` value in `values.yaml`.

---

## Step 9 — Verify Metrics in Datadog

Open the [Datadog console](https://app.datadoghq.com/) and confirm data is flowing:

| View | What to check |
|------|---------------|
| **Infrastructure → Hosts** | EKS worker nodes visible |
| **Kubernetes Explorer** | Cluster, namespaces, and workloads |
| **Containers** | Running pods listed |
| **Metrics Explorer** | Kubernetes and container metrics |
| **Logs** | Container logs from the cluster (if log collection enabled) |

Allow **2–5 minutes** after install for initial data ingestion.

---

## Step 10 — Upgrade Datadog

When `values.yaml` changes or a new chart version is available:

```bash
helm repo update

helm upgrade datadog-agent \
  datadog/datadog \
  -n datadog \
  -f values.yaml
```

Verify after upgrade:

```bash
helm list -n datadog
kubectl get pods -n datadog
kubectl rollout status daemonset/datadog-agent -n datadog
```

---

## Step 11 — Rollback

List revision history:

```bash
helm history datadog-agent -n datadog
```

Rollback to a previous revision:

```bash
helm rollback datadog-agent <REVISION> -n datadog
```

Example — rollback to revision 1:

```bash
helm rollback datadog-agent 1 -n datadog
```

---

## Step 12 — Uninstall

Remove the Helm release:

```bash
helm uninstall datadog-agent -n datadog
```

Delete the namespace (optional):

```bash
kubectl delete namespace datadog
```

> **Warning:** Deleting the namespace removes the `datadog-secret`. Export or recreate secrets before uninstall if you plan to reinstall.

---

## Quick Reference

```bash
# Prerequisites
kubectl get nodes

# Setup
helm repo add datadog https://helm.datadoghq.com && helm repo update
kubectl create namespace datadog
kubectl create secret generic datadog-secret \
  --from-literal=api-key='<DATADOG_API_KEY>' -n datadog

# Install
helm install datadog-agent datadog/datadog -n datadog -f values.yaml

# Verify
kubectl get pods,daemonset -n datadog
kubectl exec -it -n datadog \
  $(kubectl get pods -n datadog -l app=datadog-agent -o jsonpath='{.items[0].metadata.name}') \
  -- agent status

# Upgrade
helm upgrade datadog-agent datadog/datadog -n datadog -f values.yaml

# Rollback
helm history datadog-agent -n datadog
helm rollback datadog-agent <REVISION> -n datadog

# Uninstall
helm uninstall datadog-agent -n datadog
kubectl delete namespace datadog
```

---

## Related Documentation

- [Datadog Kubernetes installation (Helm)](https://docs.datadoghq.com/containers/kubernetes/installation/?tab=helm)
- [Datadog Helm chart values](https://github.com/DataDog/helm-charts/tree/main/charts/datadog)
- [EKS monitoring with Prometheus & Grafana](../prometheus/README.md) — complementary in-cluster observability stack
