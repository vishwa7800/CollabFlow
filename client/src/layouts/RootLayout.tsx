import { Outlet, Link, useLocation } from 'react-router-dom'
import { APP_NAME } from '@/constants'
import { useHealth } from '@/hooks'

export function RootLayout() {
  const location = useLocation()
  const { data: health, isLoading, isError } = useHealth()

  // For public pages (Landing, Login, Signup) and authenticated workspace (/app/*),
  // render their dedicated full layouts directly without outer dev shell.
  const isDedicatedLayout =
    ['/', '/login', '/signup'].includes(location.pathname) ||
    location.pathname.startsWith('/app')

  if (isDedicatedLayout) {
    return <Outlet />
  }

  // Fallback dev wrapper for standalone routes (such as /dev/design-system)
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-blue-500"></span>
              {APP_NAME}
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/app/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link to="/app/projects" className="hover:text-white transition-colors">Projects</Link>
              <Link to="/dev/design-system" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Design System</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs px-2.5 py-1 rounded-full border border-slate-800 bg-slate-900 text-slate-400 flex items-center gap-1.5">
              <span className={`inline-block h-2 w-2 rounded-full ${
                isLoading ? 'bg-amber-400 animate-pulse' : isError ? 'bg-red-500' : 'bg-emerald-400'
              }`} />
              <span>
                Backend API: {isLoading ? 'Checking...' : isError ? 'Offline' : `Online (${health?.status})`}
              </span>
            </div>
            <Link to="/login" className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500">
        CollabFlow © 2026 — Collaborative Project Management Foundation
      </footer>
    </div>
  )
}
