import { useCallback, useEffect, useState } from 'react'
import { useDataRefresh } from '../context/DataContext'

interface UseAsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useAsync<T>(loader: () => Promise<T>, deps: unknown[] = []): UseAsyncState<T> {
  const { refreshKey } = useDataRefresh()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await loader()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }, [...deps, refreshKey])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, loading, error, refresh }
}
