# FutureFlow Deployment Guide

**Version:** 1.0  
**Project:** FutureFlow – Predictive Cash Flow & Scenario Planner

## 1. Purpose

This guide describes how FutureFlow will be deployed for local development and future production environments using only open-source technologies.

## 2. Deployment Architecture

| Component | Technology |
| --- | --- |
| Frontend | Angular |
| Backend API | NestJS (Node.js) |
| Database | PostgreSQL |
| AI Service | Ollama |
| Reverse Proxy | NGINX (Production) |
| CI/CD | Jenkins |
| Container Runtime | Docker & Docker Compose |

## 3. Local Development

1. Clone the GitHub repository.
2. Install Docker Desktop or Docker Engine with Docker Compose.
3. Run `docker compose up -d` to start all services.
4. Access the Angular UI in a browser.
5. Use the generated API documentation to verify endpoints.

## 4. Docker Compose Services

- `frontend`
- `api`
- `postgres`
- `ollama`
- `jenkins`

## 5. CI/CD Pipeline

1. Develop features on feature branches.
2. Merge changes into the development branch.
3. Jenkins automatically builds and tests the application.
4. Approved changes are merged into the main branch.
5. Production deployments use tagged releases.

## 6. Environment Configuration

- Store secrets in environment variables.
- Use separate configuration for development and production.
- Never commit credentials to source control.

## 7. Backup & Recovery

- Schedule PostgreSQL backups.
- Backup Docker volumes as needed.
- Version all source code in GitHub.

## 8. Summary

FutureFlow is designed for repeatable deployments using Docker Compose locally and a straightforward Jenkins-based CI/CD workflow. The deployment process emphasizes simplicity, portability, and reproducibility.
