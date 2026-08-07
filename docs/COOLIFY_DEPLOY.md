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

| Arg                   | Value                            |
| --------------------- | -------------------------------- |
| `VITE_API_BASE_URL`   | `/api`                           |
| `VITE_ADMIN_USER`     | same as BE `BASIC_AUTH_USER`     |
| `VITE_ADMIN_PASSWORD` | same as BE `BASIC_AUTH_PASSWORD` |

### Runtime env

| Variable           | Example                                          |
| ------------------ | ------------------------------------------------ |
| `BACKEND_UPSTREAM` | `http://ata-rag-be:8080` or internal Coolify URL |
| `BACKEND_HOST`     | backend hostname used in `Host` header           |

## `/healthz` (frontend container)

The SPA container exposes **`GET /healthz`** directly from nginx — it does **not** proxy to the backend.

| Endpoint   | Served by  | Purpose                                         |
| ---------- | ---------- | ----------------------------------------------- |
| `/healthz` | nginx      | Coolify / Traefik liveness for the FE container |
| `/health`  | proxy → BE | Backend API health (`ata-rag-chat-be`)          |

### Verify locally (Docker)

```bash
docker build -t ata-rag-fe .
docker run --rm -p 8081:80 -e BACKEND_UPSTREAM=http://host.docker.internal:8080 -e BACKEND_HOST=host.docker.internal ata-rag-fe
curl -sS http://localhost:8081/healthz
# expected: ok
curl -sS http://localhost:8081/health
# expected: {"status":"ok","service":"ata-rag-chat-be"} when BE is up
```

### Verify in Coolify

```bash
curl -sS "https://<your-fe-host>/healthz"
curl -sS "https://<your-fe-host>/health"
```

The Docker `HEALTHCHECK` in `Dockerfile` also probes `http://127.0.0.1/healthz` every 30s.

## SSE proxy (chat streaming)

Chat uses **`POST /api/chat`** with `text/event-stream`. Buffering at any proxy layer breaks token streaming.

### nginx (included)

`nginx.conf.template` disables buffering for all `/api/` routes:

```nginx
location /api/ {
    proxy_buffering off;
    proxy_cache off;
    proxy_read_timeout 3600s;
    ...
}
```

Automated check: `src/test/nginxSseProxy.test.ts` asserts these directives exist.

### Traefik (Coolify)

Traefik sits in front of the FE container in Coolify. For SSE:

1. Use the default HTTP router to the FE service (nginx handles `/api/` proxy to BE).
2. **Do not** enable response buffering middleware on `/api/chat`.
3. If you add Traefik middleware, avoid `compress` or buffering plugins on `/api/*`.
4. Confirm streaming manually:

```bash
curl -N -X POST "https://<your-fe-host>/api/chat" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{"question":"What is the tuition for Computer Science?","top_k":5}'
```

You should see `event: sources`, then `event: token`, then `event: done` arrive incrementally — not as one block after the connection closes.

### Backend contract

SSE sequence from `be/rag-chat-api`:

```
event: sources → event: token* → event: done
```

Low-confidence answers emit empty sources, fallback tokens, and `done.answered=false`.

## Verify end-to-end

```bash
curl -sS "https://<your-fe-host>/healthz"
curl -sS "https://<your-fe-host>/health"
```

Open the FE URL — header should show **API ok · N ms** when the backend is reachable.
