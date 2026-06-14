# Architecture

This project is built as a 3-tier Kubernetes app running in a cluster namespace with three services:

- `frontend` (React app served by Nginx)
- `backend` (Express API)
- `mongo` (MongoDB database)

## Current Deployment Model

- Kubernetes namespace: `mern-app`
- Helm charts under `k8_manifests/`
- Ingress templates exist but are disabled by default
- Services are `ClusterIP` by default

## Runtime Flow

```text
Browser
   │
   ▼
Frontend service (nginx)
   │  (serves React bundle)
   │
   ├─ GET /               -> serve static assets
   │
   └─ /api/*              -> proxy to backend service
                             │
                             ▼
                       Backend service (Express)
                             │
                             └─ CRUD API: /api/tasks
                                   │
                                   ▼
                              MongoDB service
```

## Visual Diagram

```text
+-----------------+          +-----------------+          +-----------------+
|                 |          |                 |          |                 |
|   Browser /     |   HTTP   |   Frontend      |   HTTP   |   Backend       |
|   User Agent    | ───────> |   Nginx + React | ───────> |   Express API   |
|                 |          |                 |          |                 |
+-----------------+          +-----------------+          +-----------------+
                                     │                          |
                                     │ /api                     │ MongoDB URI
                                     │ proxy                    ▼
                                     ▼                  +-----------------+
                              +-----------------+       |                 |
                              |   Frontend      |       |   MongoDB       |
                              |   Service       |       |   Service       |
                              +-----------------+       |                 |
                                                        +-----------------+
```

## Service Details

- Frontend service: `frontend`
  - container port: `80`
  - configured env: `REACT_APP_BACKEND_URL=http://backend:8080/api/tasks`
  - Nginx proxies `/api` traffic to `http://backend:8080`

- Backend service: `backend`
  - container port: `8080`
  - exposes `/api/tasks` for task CRUD and `/ok` for health checks
  - connects to MongoDB via `MONGO_CONN_STR`

- MongoDB service: `mongo`
  - container port: `27017`
  - root credentials are currently configured as `admin` / `password123`
  - persistence is enabled by default through a PVC

## Notes

- The frontend and backend are wired together using internal Kubernetes DNS names.
- The backend uses `mongodb://admin:password123@mongo:27017/todo?directConnection=true&authSource=admin` when deployed with the current Helm values.
- The charts currently do not expose an external ingress by default, so cluster access requires port-forwarding or a service type change for external connectivity.
