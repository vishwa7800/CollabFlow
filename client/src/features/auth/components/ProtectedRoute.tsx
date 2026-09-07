import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loader2 } from 'lucide-react'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-xs font-medium tracking-wide">Restoring session...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Preserve intended destination so user is redirected back after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (isAuthenticated) {
    // Redirect already authenticated users to app dashboard
    const destination = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/app/dashboard'
    return <Navigate to={destination} replace />
  }

  return <Outlet />
}
