import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import ToastContainer, { type ToastMessage } from '../components/ToastContainer'
import { useDataRefresh } from '../../context/DataContext'

interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
}

interface AdminContextValue {
  version: number
  refresh: () => void
  showToast: (message: string, type?: ToastMessage['type']) => void
  confirm: (options: ConfirmOptions) => Promise<boolean>
  logAction: (action: string, details: string) => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const { refreshAll } = useDataRefresh()
  const [version, setVersion] = useState(0)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [confirmState, setConfirmState] = useState<
  (ConfirmOptions & { resolve: (value: boolean) => void }) | null
  >(null)

  const refresh = useCallback(() => {
    setVersion((value) => value + 1)
    refreshAll()
  }, [refreshAll])

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}`
    setToasts((current) => [...current, { id, message, type }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3200)
  }, [])

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ ...options, resolve })
    })
  }, [])

  const logAction = useCallback((_action: string, _details: string) => {
    refresh()
  }, [refresh])

  const value = useMemo(
    () => ({ version, refresh, showToast, confirm, logAction }),
    [version, refresh, showToast, confirm, logAction],
  )

  return (
    <AdminContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} />
      {confirmState && (
        <ConfirmDialog
          title={confirmState.title}
          message={confirmState.message}
          confirmLabel={confirmState.confirmLabel}
          danger={confirmState.danger}
          onCancel={() => {
            confirmState.resolve(false)
            setConfirmState(null)
          }}
          onConfirm={() => {
            confirmState.resolve(true)
            setConfirmState(null)
          }}
        />
      )}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
