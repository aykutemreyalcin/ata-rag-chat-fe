import { useQuery } from '@tanstack/react-query'
import { fetchHealth } from '../api/client'
import './BackendStatus.css'

export function BackendStatus() {
  const health = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    refetchInterval: 30_000,
  })

  if (health.isLoading) {
    return <span className="status status--pending">Checking API…</span>
  }

  if (health.isError) {
    return (
      <span className="status status--down" title={String(health.error)}>
        Backend unavailable
      </span>
    )
  }

  return (
    <span className="status status--up">API {health.data?.status ?? 'ok'}</span>
  )
}
