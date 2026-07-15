# Architecture

This repository implements a 3-tier application in Kubernetes with three logical layers:

- `frontend`: React application served by Nginx
- `backend`: Express API for CRUD operations and health checks
- `mongo`: MongoDB persistence layer

## Deployment model

- Namespace: `mern-app`
- Helm charts are located under `k8_manifests/`
- The frontend, backend, and mongo charts are deployed as separate releases
- Services are exposed as `ClusterIP` by default, so access from outside the cluster is typically done through port-forwarding or an ingress controller

## Runtime flow

```text
Browser
  │
  ▼
Frontend pod (Nginx + static React bundle)
  │
  │  GET /             -> serves index.html and static assets
  │  /api/*           -> proxied to the backend service
  ▼
Backend pod (Express + Mongoose)
  │
  │  /api/tasks       -> CRUD API
  │  /ok              -> health probe endpoint
  ▼
MongoDB pod
```

## Component responsibilities

### Frontend tier

- Built from the React app in `app/frontend`
- Produces a static build and serves it through Nginx
- Uses an Nginx config that forwards `/api` traffic to `http://backend:8080`
- The current client code calls `/api/tasks` directly; it does not depend on a `REACT_APP_BACKEND_URL` variable in the app code

### Backend tier

- Built from the Express app in `app/backend`
- Exposes the task API and a health endpoint
- Uses Mongoose to persist task documents in MongoDB
- Reads database settings from `MONGO_CONN_STR` and optionally `MONGO_USERNAME` / `MONGO_PASSWORD` when `USE_DB_AUTH=true`

### Database tier

- Uses the official MongoDB container image
- Exposes port `27017`
- Credentials are provided to the container via Kubernetes secret references from the Helm values file
- The chart can mount a persistent volume at `/data/db` depending on values configuration

## Network and service topology

```text
+------------------+        +------------------+        +------------------+
|                  |        |                  |        |                  |
| Browser / User   |  HTTP  | Frontend Service |  HTTP  | Backend Service  |
| Agent            | -----> | (Nginx + React) | -----> | (Express API)    |
|                  |        |                  |        |                  |
+------------------+        +------------------+        +------------------+
                                    │                           │
                                    │ /api/* requests           │ MongoDB URI
                                    ▼                           ▼
                            +------------------+      +------------------+
                            | Frontend Pod     |      | Backend Pod      |
                            | (1 replica)      |      | (2 replicas)     |
                            +------------------+      +------------------+
                                                             │
                                                             ▼
                                                     +------------------+
                                                     | MongoDB Service  |
                                                     | (single replica) |
                                                     +------------------+
```

## Configuration details

### Backend environment variables

- `PORT`: container port used by Express, default `8080`
- `MONGO_CONN_STR`: MongoDB connection string used by the backend
- `MONGO_USERNAME`: optional username when auth is enabled
- `MONGO_PASSWORD`: optional password when auth is enabled
- `USE_DB_AUTH`: switches the backend connection to use database credentials

### Frontend behavior

- The frontend uses the relative path `/api/tasks` from the browser-side service client
- In the Kubernetes deployment, Nginx handles the path rewrite/proxying so the browser does not need to know the internal backend address

## Operational notes

- The frontend chart contains ingress templates, but external exposure depends on the target cluster and ingress controller
- The backend chart includes liveness and readiness probes on `/ok`
- The Mongo chart uses a readiness/liveness check based on `mongosh` pinging the local instance
- The current values are intended for a development/demo environment rather than a production-grade hardened deployment
