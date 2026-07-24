# ATA RAG Chat — Frontend

React + TypeScript SPA for the AkademiaTA (`akademiata.pl`) RAG assistant.

## Stack

- React 19 + Vite 8 + TypeScript
- React Router + TanStack Query + Axios
- nginx runtime proxy for Coolify (`/api` → backend)
- Vitest + Testing Library

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173

Default API base: `http://localhost:8080/api`. Or set `VITE_API_BASE_URL=/api` to use the Vite proxy.

## Feature branches (planned)

| Branch                     | Scope                            |
| -------------------------- | -------------------------------- |
| `fe/chat-experience`       | SSE chat, citations, PL/EN       |
| `fe/admin-dashboard`       | Admin metrics UI                 |
| `fe/quality-observability` | Tests, a11y, SSE proxy hardening |

See [jira_tasks.csv](./jira_tasks.csv).

## Docker / Coolify

Build-time: `VITE_API_BASE_URL=/api`  
Runtime: `BACKEND_UPSTREAM`, `BACKEND_HOST`

Details: [docs/COOLIFY_DEPLOY.md](./docs/COOLIFY_DEPLOY.md)

## Scripts

| Command                | Description                   |
| ---------------------- | ----------------------------- |
| `npm run dev`          | Vite dev server               |
| `npm run build`        | Type-check + production build |
| `npm run test`         | Vitest                        |
| `npm run lint`         | ESLint                        |
| `npm run format:check` | Prettier check                |
