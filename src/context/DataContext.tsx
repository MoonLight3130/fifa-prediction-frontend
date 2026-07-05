import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

interface DataContextValue {
  refreshKey: number
  refreshAll: () => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0)

  const refreshAll = useCallback(() => {
    setRefreshKey((value) => value + 1)
  }, [])

  const value = useMemo(() => ({ refreshKey, refreshAll }), [refreshKey, refreshAll])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useDataRefresh() {
  const context = useContext(DataContext)
  if (!context) {
    return { refreshKey: 0, refreshAll: () => {} }
  }
  return context
}
