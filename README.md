# 3-Tier Kubernetes Task Management App

This repository contains a small task-management application implemented as a 3-tier system for learning and demonstrating containerization, service networking, and Helm-based Kubernetes deployment.

## Overview

The app lets a user create, view, complete, and delete tasks. The frontend is a React application, the backend is an Express API, and the database layer is MongoDB. In Kubernetes, the three tiers are packaged as separate Helm charts under the k8_manifests directory.

## Architecture summary

```text
User / Browser
    │
    ▼
Frontend (React + Nginx)
    │
    │  /api/* requests are proxied to the backend service
    ▼
Backend (Express + Mongoose)
    │
    │  CRUD operations and health checks
    ▼
MongoDB service
```

### Request flow

1. The browser loads the React app from the frontend service.
2. The frontend calls the backend through relative API paths such as /api/tasks.
3. Nginx in the frontend container forwards those requests to the backend service.
4. The Express backend reads and writes task records in MongoDB.

## Repository structure

```text
.
├── app/
│   ├── backend/
│   │   ├── Dockerfile
│   │   ├── db.js
│   │   ├── index.js
│   │   ├── models/
│   │   ├── routes/
│   │   └── tests/
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
├── template/
├── README.md
└── todo.md
```

## Component details

### Frontend

The frontend lives in app/frontend and is built with React 17, Material UI, Axios, and React Scripts.

Key points:
- The production container is built with Node.js, then serves the compiled React build through Nginx.
- The Nginx configuration in app/frontend/nginx.conf proxies /api traffic to the backend service at http://backend:8080.
- The frontend client code uses a relative API path of /api/tasks from app/frontend/src/services/taskServices.js, so it does not rely on a REACT_APP_BACKEND_URL environment variable in the current implementation.

### Backend

The backend lives in app/backend and is built with Express.js and Mongoose.

Key points:
- The main entry point is app/backend/index.js.
- It exposes:
  - GET /api/tasks
  - POST /api/tasks
  - PUT /api/tasks/:id
  - DELETE /api/tasks/:id
  - GET /ok (health endpoint)
- The database connection logic is in app/backend/db.js.
- MongoDB connection details are read from the MONGO_CONN_STR environment variable. If not supplied, the service falls back to mongodb://localhost:27017/todo?directConnection=true.
- When running in Kubernetes, the backend chart passes MONGO_CONN_STR, MONGO_USERNAME, MONGO_PASSWORD, and USE_DB_AUTH=true to the pod.

### MongoDB

MongoDB is the persistence layer for task documents.

Key points:
- The Mongo chart uses the official mongo image.
- Credentials are sourced from Kubernetes secrets via the chart values file.
- The chart includes a volume mount for /data/db and supports persistence through the values file.

## Local development

### Prerequisites

- Node.js and npm
- A local MongoDB instance (or a reachable Mongo deployment)
- Optional: Docker for building the images locally

### Run the backend locally

```bash
cd app/backend
npm install
node index.js
```

The backend will listen on:
- http://localhost:8080/api/tasks
- http://localhost:8080/ok

### Run the frontend locally

```bash
cd app/frontend
npm install
npm start
```

The frontend will be available at:
- http://localhost:3000

If you want the frontend to talk to a locally running backend, make sure the backend is available at http://localhost:8080 and keep the frontend service path as /api/tasks.

## Kubernetes / Helm deployment

The deployment is organized into three Helm charts under k8_manifests:
- backend
- frontend
- mongo

The charts are configured for the mern-app namespace and use service DNS names that allow internal communication between tiers.

### Default service names and ports

- Frontend service: frontend, port 80
- Backend service: backend, port 8080
- Mongo service: mongo, port 27017

### Install the charts

```bash
helm install mongo ./k8_manifests/mongo
helm install backend ./k8_manifests/backend
helm install frontend ./k8_manifests/frontend
```

### Accessing the app in a cluster

Because the services are ClusterIP by default, local access usually requires port-forwarding:

```bash
kubectl port-forward svc/frontend 8080:80 -n mern-app
kubectl port-forward svc/backend 8081:8080 -n mern-app
```

Then use:
- http://localhost:8080 for the frontend UI
- http://localhost:8081/ok for the backend health endpoint

### Notes on ingress

The frontend chart includes ingress templates, but ingress exposure depends on the cluster environment and ingress controller availability. In many local setups, port-forwarding is the simplest way to verify the app.

## Tests and validation

The repository includes test suites for both application layers:
- Backend tests under app/backend/tests
- Frontend service tests under app/frontend/src/services/taskServices.test.js

These are intended for CI validation, but they are not a substitute for a real cluster deployment test.

## Current state and next steps

Implemented:
- React frontend UI for task management
- Express backend CRUD API
- MongoDB persistence path
- Dockerfiles for frontend and backend
- Helm charts for frontend, backend, and MongoDB

Suggested follow-ups:
1. Validate the Helm deployment in a real Kubernetes cluster or Minikube.
2. Replace placeholder credentials with a more secure secret-management approach.
3. Add a CI/CD workflow for image builds and chart validation.
4. Improve ingress and external access configuration for production-style deployments.

