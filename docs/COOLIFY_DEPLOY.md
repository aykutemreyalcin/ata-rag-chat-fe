# Coolify deployment — ATA RAG Frontend

## Overview

Deploy as a **Dockerfile** resource. The static SPA is served by nginx; `/api/` and `/health` are proxied to the backend at runtime (no rebuild when backend host changes).

## Settings

| Setting               | Value                 |
| --------------------- | --------------------- |
| **Build pack**        | Dockerfile            |
| **Ports Exposes**     | `80`                  |
| **Port Mappings**     | leave empty (Traefik) |
| **Health check path** | `/healthz`            |
| **Branch**            | `main`                |

### Build args

| Arg                 | Value  |
| ------------------- | ------ |
| `VITE_API_BASE_URL` | `/api` |

### Runtime env

| Variable           | Example                                          |
| ------------------ | ------------------------------------------------ |
| `BACKEND_UPSTREAM` | `http://ata-rag-be:8080` or internal Coolify URL |
| `BACKEND_HOST`     | backend hostname used in `Host` header           |

## SSE notes

`nginx.conf.template` disables buffering for `/api/` so chat SSE works once `fe/chat-experience` + `be/rag-chat-api` land. Ensure Traefik also does not buffer that path.

## Verify

```bash
curl -sS "https://<your-fe-host>/healthz"
curl -sS "https://<your-fe-host>/health"
```

Open the FE URL — header should show API status when backend is reachable.
