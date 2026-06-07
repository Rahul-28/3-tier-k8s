# 3-Tier Kubernetes Task Management App

This project is a small full-stack task management application deployed as a 3-tier Kubernetes setup:

- Frontend: React + Material UI
- Backend: Express.js + Mongoose
- Database: MongoDB

It is designed to demonstrate containerization, Helm-based Kubernetes deployment, and a basic cloud-native application flow.

## Project Overview

The application lets users create, view, update, and delete tasks. The frontend calls the backend API, and the backend stores task data in MongoDB.

### Architecture

```text
User -> React Frontend -> Express API -> MongoDB
         (Port 3000)        (Port 8080)   (Port 27017)
```

The Kubernetes charts under `k8_manifests/` are set up to deploy:

- `frontend` chart
- `backend` chart
- `mongo` chart

## Tech Stack

### Frontend
- React 17
- React Scripts
- Material UI
- Axios

### Backend
- Node.js
- Express.js
- Mongoose
- CORS

### Infrastructure
- Docker
- Kubernetes / Minikube
- Helm charts

## Project Structure

```text
.
├── app/
│   ├── backend/
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   ├── db.js
│   │   ├── models/
│   │   └── routes/
│   └── frontend/
│       ├── Dockerfile
│       ├── public/
│       └── src/
├── k8_manifests/
│   ├── backend/
│   ├── frontend/
│   └── mongo/
├── diagrams/
└── todo.md
```

## How the App Works

1. The React frontend renders the task list UI.
2. The frontend sends API requests to the backend.
3. The Express backend stores and retrieves tasks from MongoDB.
4. The Kubernetes charts expose the services for deployment in a cluster.

## Local Development

### Prerequisites

- Node.js
- npm
- Docker (optional for containerized run)
- MongoDB (for local backend testing)

### Run the backend locally

```bash
cd app/backend
npm install
node index.js
```

The backend listens on:

- `http://localhost:8080/api/tasks`

It uses the following default MongoDB connection string:

```bash
mongodb://localhost:27017/todo?directConnection=true
```

### Run the frontend locally

```bash
cd app/frontend
npm install
npm start
```

The frontend runs on:

- `http://localhost:3000`

You can set the backend URL with:

```bash
REACT_APP_BACKEND_URL=http://localhost:8080/api/tasks
```

## Docker Usage

### Build backend image

```bash
cd app/backend
docker build -t <your-backend-image> .
```

### Build frontend image

```bash
cd app/frontend
docker build -t <your-frontend-image> .
```

## Kubernetes / Helm Deployment

The Helm charts are located in `k8_manifests/`.

### Deploy MongoDB

```bash
helm install mongo ./k8_manifests/mongo
```

### Deploy Backend

```bash
helm install backend ./k8_manifests/backend
```

### Deploy Frontend

```bash
helm install frontend ./k8_manifests/frontend
```

### Notes

- The backend chart expects a MongoDB service accessible as `mongodb-svc` inside the cluster.
- The frontend chart currently uses `REACT_APP_BACKEND_URL` for API connectivity.
- The charts are still in progress for full production-grade ingress and CI/CD automation.

## Current Status

The project already includes:

- React frontend UI for task management
- Express backend API for CRUD operations
- MongoDB persistence
- Dockerfiles for both app layers
- Helm charts for frontend, backend, and MongoDB

The following items are still pending in `todo.md`:

- frontend tests
- backend tests
- GitHub Actions CI/CD pipelines
- Kubernetes validation in Minikube
- deployment flow improvements

## Suggested Next Steps

1. Add automated tests for frontend and backend.
2. Set up GitHub Actions for CI and CD.
3. Configure proper ingress and service routing for the cluster.
4. Secure secrets for MongoDB credentials instead of base64 placeholders.
5. Add health checks and production-ready resource limits.

## Summary

This repository is a practical example of a small 3-tier application built for learning and demonstrating Kubernetes deployment workflows using Docker and Helm.
