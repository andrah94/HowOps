# Solopreneur Workflow App – MVP Skeleton

Cross‑platform PWA (Next.js 14) + React Native wrappers, backed by NestJS and PostgreSQL.

## Monorepo Layout
```text
myapp/
├── .github/workflows/ci.yml        # GitHub Actions CI
├── docker-compose.yml              # Local dev stack (Postgres, pgAdmin)
├── frontend/                       # Next.js 14 PWA
├── mobile/                         # Expo React Native wrapper
├── backend/                        # NestJS API server
├── shared/                         # Shared TS configs / types
└── infra/                          # Terraform IaC stubs
```

## Getting Started (local)
```bash
docker compose up -d
npm install -w frontend -w backend -w mobile
npm --workspace backend run start:dev
npm --workspace frontend run dev
```
