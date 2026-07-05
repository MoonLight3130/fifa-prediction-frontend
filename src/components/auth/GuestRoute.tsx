import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function GuestRoute() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950">
        <p className="text-sm text-white/60">Loading...</p>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/'} replace />
  }

  return <Outlet />
}
