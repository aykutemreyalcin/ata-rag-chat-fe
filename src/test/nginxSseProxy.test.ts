import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

describe('nginx SSE proxy configuration', () => {
  const nginxConfig = readFileSync(resolve('nginx.conf.template'), 'utf8')

  it('exposes frontend healthz for Coolify', () => {
    expect(nginxConfig).toContain('location = /healthz')
    expect(nginxConfig).toContain("return 200 'ok'")
  })

  it('disables buffering for api routes required by SSE chat', () => {
    expect(nginxConfig).toContain('location /api/')
    expect(nginxConfig).toContain('proxy_buffering off')
    expect(nginxConfig).toContain('proxy_cache off')
    expect(nginxConfig).toContain('proxy_read_timeout 3600s')
  })

  it('proxies backend health separately from healthz', () => {
    expect(nginxConfig).toContain('location = /health')
    expect(nginxConfig).toContain('${BACKEND_UPSTREAM}/health')
  })
})

describe('Docker healthcheck', () => {
  const dockerfile = readFileSync(resolve('Dockerfile'), 'utf8')

  it('probes healthz inside the container', () => {
    expect(dockerfile).toContain('HEALTHCHECK')
    expect(dockerfile).toContain('/healthz')
  })
})
