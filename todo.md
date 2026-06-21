# Project Checklist

## Required
- [x] Create a new Dockerfile for the frontend.
- [x] Create a new Dockerfile for the backend.
- [x] Create a new Git Repository and put the code in that.
- [x] Push frontend image to dockerhub
- [x] Push backend image to dockerhub
- [x] Create separate folders for MongoDB, frontend, backend kubernetes manifests.
- [x] Create new Kubernetes manifests for MongoDB.(use helm if needed)
- [x] Create new Kubernetes manifests for the frontend.(use helm if needed)
- [x] Create new Kubernetes manifests for the backend.(use helm if needed)
- [x] Create k8s secrets for db username and password 
- [x] Update the deployments to use the created secrets instead of plainText 
- [ ] Create frontend tests to run in CI pipelines.
- [ ] Create backend tests to run in CI pipelines.
- [ ] Create CI pipelines using GitHub Actions.
- [ ] Ensure the CI pipeline runs tests.
- [ ] Ensure the CI pipeline builds Docker images.
- [ ] Ensure the CI pipeline validates Kubernetes build/deployment using Minikube.
- [ ] Create a CD pipeline using GitHub Actions.
- [ ] Figure out and define the CD deployment flow.

## Optional
- [ ] Add a linting package.
- [ ] Add static code analysis.
- [ ] Add trivy to the CI/CD pipeline (for professional touch)