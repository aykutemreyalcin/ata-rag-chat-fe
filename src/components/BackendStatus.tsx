import { useQuery } from '@tanstack/react-query'
import { fetchHealth } from '../api/client'
import './BackendStatus.css'

export type HealthCheckResult = {
  status: string
  service: string
  latencyMs: number
}

async function fetchHealthWithLatency(): Promise<HealthCheckResult> {
  const start = performance.now()
  const data = await fetchHealth()
  return {
    ...data,
    latencyMs: Math.round(performance.now() - start),
  }
}

export function BackendStatus() {
  const health = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealthWithLatency,
    refetchInterval: 30_000,
  })

  if (health.isLoading) {
    return (
      <span
        className="status status--pending"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        Checking API…
      </span>
    )
  }

  if (health.isError) {
    const message =
      health.error instanceof Error
        ? health.error.message
        : 'Backend unavailable'

    return (
      <span
        className="status status--down"
        role="status"
        aria-live="polite"
        title={message}
      >
        Backend unavailable
      </span>
    )
  }

  const latency = health.data?.latencyMs
  const label =
    latency !== undefined
      ? `API ${health.data?.status ?? 'ok'} · ${latency} ms`
      : `API ${health.data?.status ?? 'ok'}`

  return (
    <span
      className="status status--up"
      role="status"
      aria-live="polite"
      aria-label={`Backend healthy. Response latency ${latency ?? 'unknown'} milliseconds.`}
    >
      {label}
    </span>
  )
}
