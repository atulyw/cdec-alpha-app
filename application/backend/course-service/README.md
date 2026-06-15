# Course Service

Course catalog microservice — list, create, update, and delete courses.

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
cd application/backend/course-service
chmod +x mvnw
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | Set in `application.yml` | MongoDB connection string |

For production:

```bash
export MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/cb_auth"
```

## Run locally (development)

```bash
./mvnw spring-boot:run
```

Service starts on [http://localhost:8082](http://localhost:8082).

API base path: `/api/courses`

```bash
curl http://localhost:8082/api/courses/health
curl http://localhost:8082/api/courses/
```

## Build

### Development

No separate build step — use `./mvnw spring-boot:run` for local development.

### Production

Build the executable JAR:

```bash
./mvnw clean package -DskipTests
```

Output: `target/course-service-1.0.0.jar`

Run the JAR:

```bash
export MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/cb_auth"

java -jar target/course-service-1.0.0.jar
```

## Deploy to EKS

Build, containerize, push to ECR, and roll out to Kubernetes.

Replace placeholders with your values:

```bash
cd application/backend/course-service

ECR_REGISTRY=YOUR_ACCOUNT.dkr.ecr.eu-west-1.amazonaws.com
IMAGE=${ECR_REGISTRY}/cloudblitz/course-service:latest
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
kubectl rollout status deployment/course-service -n ${KUBE_NAMESPACE} --timeout=300s
```

## Other commands

```bash
./mvnw test              # run unit tests
./mvnw clean package     # build with tests
./mvnw clean verify      # build, test, and generate JaCoCo coverage report
```

## SonarCloud Integration

Static analysis, code coverage, and a **quality gate** for `course-service` are integrated via **Maven**, **JaCoCo**, and **SonarCloud**.

The pipeline **passes only when every SonarCloud rating is A**; any lower rating fails the build and blocks Docker deploy.

### Prerequisites

| Requirement | Notes |
|-------------|-------|
| [SonarCloud](https://sonarcloud.io) account | Free for public repositories |
| SonarCloud project | Key: `atulyw_course-service`, org: `atulyw` |
| Custom quality gate | **All A Ratings** — see setup below |
| Java 17 | Same as local development |
| Maven | Use `./mvnw` in this directory |

### Quality gate — all A ratings required

Create a quality gate in SonarCloud and assign it to this project.

1. SonarCloud → **Quality Gates** → **Create**
2. Name it e.g. `All A Ratings`
3. Add these conditions (all must pass):

| Condition | Operator | Value |
|-----------|----------|-------|
| Reliability Rating | is | A |
| Security Rating | is | A |
| Maintainability Rating | is | A |
| Security Review Rating | is | A |

4. **Quality Gates** → **Projects** → assign `atulyw_course-service` to `All A Ratings`

When any rating drops below **A**, SonarCloud marks the quality gate as **Failed**. With `sonar.qualitygate.wait=true`, Maven exits with an error and Jenkins stops before the Docker/ECR/EKS stages.

### Run analysis locally

```bash
cd application/backend/course-service

# 1. Build, run tests, and generate JaCoCo XML (target/site/jacoco/jacoco.xml)
./mvnw clean verify

# 2. Upload analysis and wait for quality gate result
export SONAR_TOKEN="your-sonar-token"
./mvnw sonar:sonar \
  -Dsonar.organization=atulyw \
  -Dsonar.projectKey=atulyw_course-service \
  -Dsonar.qualitygate.wait=true
```

> **Security:** Never commit tokens. Store them in Jenkins credentials or a local environment variable only.

### Jenkins pipeline

Pipeline: [`Jenkinsfile`](Jenkinsfile)

| Stage | Action |
|-------|--------|
| Build and Unit Tests | `./mvnw clean verify` (JaCoCo report) |
| SonarCloud Analysis | `./mvnw sonar:sonar` — **fails if quality gate not all A** |
| Build Docker image | Runs only after SonarCloud passes |
| Push to ECR / Deploy to EKS | Runs only after SonarCloud passes |

Jenkins credential: `sonarcloud-token` → `SONAR_TOKEN`

View ratings and gate status on the [SonarCloud project dashboard](https://sonarcloud.io/project/overview?id=atulyw_course-service).

### Configuration files

| File | Purpose |
|------|---------|
| `pom.xml` | JaCoCo plugin, SonarScanner plugin, `sonar.qualitygate.wait=true` |
| `sonar-project.properties` | SonarCloud project settings and quality gate wait flag |

## Project structure

```text
course-service/
├── src/main/java/            # Application code
├── src/main/resources/
│   └── application.yml       # Port and MongoDB config
├── sonar-project.properties  # SonarCloud settings and quality gate
├── Jenkinsfile               # CI: build, SonarCloud gate, deploy
├── pom.xml
├── mvnw                      # Maven wrapper
└── target/                   # Build output (created by mvnw package)
```
