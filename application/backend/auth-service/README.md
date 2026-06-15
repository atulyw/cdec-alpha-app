# Auth Service

Authentication microservice — user registration, login, and JWT token issuance.

## Stack

| Tool | Version |
|------|---------|
| Java | 17 |
| Spring Boot | 3.2.0 |
| Maven | 3.9.6 (via `./mvnw`) |
| MongoDB | Atlas |

## Prerequisites

```bash
java --version    # should print 17.x
```

## Setup

```bash
cd application/backend/auth-service
chmod +x mvnw
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | Set in `application.yml` | MongoDB connection string |
| `JWT_SECRET` | Set in `application.yml` | Secret key for JWT signing |

For production, always set these explicitly:

```bash
export MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/cb_auth"
export JWT_SECRET="your-production-secret"
```

## Run locally (development)

```bash
./mvnw spring-boot:run
```

Service starts on [http://localhost:8081](http://localhost:8081).

API base path: `/api/auth`

```bash
curl http://localhost:8081/api/auth/health
```

## Build

### Development

No separate build step — use `./mvnw spring-boot:run` for local development.

### Production

Build the executable JAR:

```bash
./mvnw clean package -DskipTests
```

Output: `target/auth-service-1.0.0.jar`

Run the JAR:

```bash
export MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/cb_auth"
export JWT_SECRET="your-production-secret"

java -jar target/auth-service-1.0.0.jar
```

## Deploy to EKS

Build, containerize, push to ECR, and roll out to Kubernetes.

Replace placeholders with your values:

```bash
cd application/backend/auth-service

ECR_REGISTRY=YOUR_ACCOUNT.dkr.ecr.eu-west-1.amazonaws.com
IMAGE=${ECR_REGISTRY}/cloudblitz/auth-service:latest
EKS_CLUSTER=YOUR_CLUSTER_NAME
EKS_REGION=eu-west-1
KUBE_NAMESPACE=cloudblitz

# Build JAR
./mvnw clean package -DskipTests

# Build and push Docker image
aws ecr get-login-password --region eu-west-1 | \
  docker login --username AWS --password-stdin ${ECR_REGISTRY}

docker build -t ${IMAGE} .
docker push ${IMAGE}

# Deploy to EKS
aws eks update-kubeconfig --region ${EKS_REGION} --name ${EKS_CLUSTER}
kubectl apply -f k8s/ -n ${KUBE_NAMESPACE}
kubectl rollout status deployment/auth-service -n ${KUBE_NAMESPACE} --timeout=300s
```

## Other commands

```bash
./mvnw test              # run unit tests
./mvnw clean package     # build with tests
./mvnw clean verify      # build, test, and generate JaCoCo coverage report
```

## SonarCloud Integration

Static analysis and code coverage for `auth-service` are integrated via **Maven**, **JaCoCo**, and **SonarCloud**.

### Prerequisites

| Requirement | Notes |
|-------------|-------|
| [SonarCloud](https://sonarcloud.io) account | Free for public repositories |
| SonarCloud project | Create a project for `auth-service` and note the **organization** and **project key** |
| Java 17 | Same as local development |
| Maven | Use `./mvnw` in this directory |

### Required GitHub Secrets

Add these under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `SONAR_TOKEN` | SonarCloud token (**My Account → Security → Generate Tokens**) |
| `SONAR_ORGANIZATION` | Organization key from SonarCloud |
| `SONAR_PROJECT_KEY` | Project key (e.g. `your-org_auth-service`) |

> **Security:** Never commit tokens to the repository. Store them only in GitHub Secrets or a local environment variable.

### How to run analysis locally

```bash
cd application/backend/auth-service

# 1. Build, run tests, and generate JaCoCo XML (target/site/jacoco/jacoco.xml)
./mvnw clean verify

# 2. Upload analysis to SonarCloud (replace placeholders)
export SONAR_TOKEN="your-sonar-token"
./mvnw sonar:sonar \
  -Dsonar.organization="SONAR_ORGANIZATION" \
  -Dsonar.projectKey="SONAR_PROJECT_KEY"
```

Optional: copy `sonar-project.properties` values or pass all settings via `-D` flags as shown above.

### How the CI/CD pipeline performs analysis

**GitHub Actions** — workflow: [`.github/workflows/auth-service.yml`](../../../.github/workflows/auth-service.yml)

On every push or pull request that touches `auth-service`:

1. **Checkout** — full git history (`fetch-depth: 0`) for accurate SonarCloud blame and PR decoration
2. **Build** — `./mvnw clean verify` compiles the project and runs unit tests
3. **JaCoCo** — `jacoco-maven-plugin` writes `target/site/jacoco/jacoco.xml`
4. **SonarCloud** — `sonar-maven-plugin` uploads sources, test results, and coverage to SonarCloud

**Jenkins** — pipeline: [`Jenkinsfile`](Jenkinsfile)

| Stage | Action |
|-------|--------|
| Build and Unit Tests | `./mvnw clean verify` (JaCoCo report) |
| SonarCloud Analysis | `./mvnw sonar:sonar` with Jenkins credentials |
| Build Docker image | Deploy stages run only after analysis succeeds |

Jenkins credentials (Secret text):

| Credential ID | Maps to |
|---------------|---------|
| `sonarcloud-token` | `SONAR_TOKEN` |
| `sonarcloud-organization` | `SONAR_ORGANIZATION` |
| `sonarcloud-project-key` | `SONAR_PROJECT_KEY` |

View results in the SonarCloud dashboard for your project.

### Configuration files

| File | Purpose |
|------|---------|
| `pom.xml` | JaCoCo plugin, SonarScanner plugin, coverage path properties |
| `sonar-project.properties` | SonarCloud project settings (placeholders; overridden in CI) |

## Project structure

```text
auth-service/
├── src/main/java/       # Application code
├── src/main/resources/
│   └── application.yml  # Port, MongoDB, JWT config
├── sonar-project.properties  # SonarCloud settings (placeholders)
├── pom.xml
├── mvnw                 # Maven wrapper
└── target/              # Build output (created by mvnw package)
```
