# 3-Tier Kubernetes Task Management App

This repository contains a simple task manager implemented as a 3-tier application and packaged for Kubernetes deployment with Helm.

- Frontend: React 17 with Material UI
- Backend: Express.js API with Mongoose
- Database: MongoDB

It is intended for learning containerization, Helm charts, and cloud-native service connectivity.

## Project Overview

The application lets users create, list, complete, and delete tasks.
The frontend communicates with the backend API, and the backend persists task data in MongoDB.

### Architecture

```text
Browser -> Nginx frontend -> Express backend -> MongoDB
          (frontend service)   (backend service)
```

In Kubernetes, the app is deployed as three Helm charts under `k8_manifests/`:

- `frontend`
- `backend`
- `mongo`

## Tech Stack

### Frontend
- React 17
- React Scripts
- Material UI
- Axios
- Nginx (container runtime for static files and API proxy)

### Backend
- Node.js
- Express.js
- Mongoose
- CORS

### Infrastructure
- Docker
- Kubernetes
- Helm

## Project Structure

```text
.
├── app/
│   ├── backend/
│   │   ├── Dockerfile
│   │   ├── db.js
│   │   ├── index.js
│   │   ├── models/task.js
│   │   └── routes/tasks.js
│   └── frontend/
│       ├── Dockerfile
│       ├── nginx.conf
│       ├── package.json
│       ├── public/
│       └── src/
├── diagrams/
├── k8_manifests/
│   ├── backend/
│   ├── frontend/
│   └── mongo/
└── todo.md
```

## How the App Works

1. The React frontend renders the task list UI.
2. Frontend code calls the backend API at `/api/tasks`.
3. The Express backend performs CRUD operations and stores tasks in MongoDB.
4. In Kubernetes, the frontend service routes requests to the backend service, and the backend service connects to the MongoDB service.

## Frontend Behavior

The frontend uses `app/frontend/src/services/taskServices.js` with a default API URL of `/api/tasks`.
When deployed in Kubernetes, the frontend receives `REACT_APP_BACKEND_URL` from the Helm chart:

```yaml
REACT_APP_BACKEND_URL: "http://backend:8080/api/tasks"
```

The production container is served by Nginx, and `nginx.conf` proxies `/api` requests to `http://backend:8080`.

## Backend Behavior

The backend exposes:

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /ok` health endpoint

The backend uses `app/backend/db.js` to connect to MongoDB using:

```bash
mongodb://localhost:27017/todo?directConnection=true
```

when no `MONGO_CONN_STR` environment variable is provided.

In Kubernetes, the backend chart sets:

- `MONGO_CONN_STR=mongodb://admin:password123@mongo:27017/todo?directConnection=true&authSource=admin`
- `MONGO_USERNAME=admin`
- `MONGO_PASSWORD=password123`
- `USE_DB_AUTH=true`

## Kubernetes / Helm Deployment

Each layer is deployed with a Helm chart under `k8_manifests/`.

### Default service names

- MongoDB service: `mongo`
- Backend service: `backend`
- Frontend service: `frontend`

### Default ports

- MongoDB: `27017`
- Backend: `8080`
- Frontend: `80`

### Deploy charts

```bash
helm install mongo ./k8_manifests/mongo
helm install backend ./k8_manifests/backend
helm install frontend ./k8_manifests/frontend
```

### Notes

- The Helm charts currently disable ingress by default.
- Frontend and backend services are ClusterIP by default.
- The MongoDB chart creates a PVC-backed data volume by default.
- Secrets and credentials are currently configured as plain values in Helm values files.

## Local Development

### Prerequisites

- Node.js
- npm
- Docker (optional)
- Local MongoDB for backend testing

### Run the backend locally

```bash
cd app/backend
npm install
node index.js
```

Default backend endpoint:

- `http://localhost:8080/api/tasks`

### Run the frontend locally

```bash
cd app/frontend
npm install
npm start
```

Local frontend endpoint:

- `http://localhost:3000`

Override the backend target with:

```bash
REACT_APP_BACKEND_URL=http://localhost:8080/api/tasks
```

## Current State

Implemented:

- React frontend UI for task management
- Express backend API for CRUD operations
- MongoDB persistence
- Dockerfiles for frontend and backend
- Helm charts for frontend, backend, and MongoDB

Pending:

- frontend tests
- backend tests
- GitHub Actions CI/CD
- Kubernetes validation in Minikube
- production-ready ingress and secrets
- documented release/deployment flow

## Suggested Next Steps

1. Add automated frontend and backend tests.
2. Add Helm secrets or Kubernetes Secret resources for database credentials.
3. Enable and validate ingress routing in the charts.
4. Add a CI/CD pipeline that builds images and validates Helm deployment.
5. Add resource requests/limits and improved readiness/liveness configuration.

