import { useLocation } from 'react-router-dom'
import { Menu, Search, ChevronRight } from 'lucide-react'
import { NotificationPopover } from './NotificationPopover'
import { UserMenu } from './UserMenu'
import { getRouteMeta } from '@/config/navigation'

export interface AppTopNavProps {
  onToggleMobile: () => void
}

export function AppTopNav({ onToggleMobile }: AppTopNavProps) {
  const location = useLocation()
  const routeMeta = getRouteMeta(location.pathname)

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      {/* Left: Mobile Hamburger & Dynamic Breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onToggleMobile}
          className="flex md:hidden items-center justify-center h-9 w-9 rounded-lg border border-slate-800 bg-slate-900/90 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Dynamic Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400">
          {routeMeta.breadcrumb.map((crumb, idx) => {
            const isLast = idx === routeMeta.breadcrumb.length - 1
            return (
              <span key={idx} className="flex items-center gap-1.5">
                <span
                  className={
                    isLast
                      ? 'font-semibold text-white tracking-tight'
                      : 'text-slate-400 hover:text-slate-200'
                  }
                >
                  {crumb}
                </span>
                {!isLast && <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />}
              </span>
            )
          })}
        </nav>
      </div>

      {/* Right: Search, Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Search Shortcut Placeholder */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-400 focus-within:border-slate-700">
          <Search className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-slate-500">Search workspace...</span>
          <kbd className="rounded border border-slate-800 bg-slate-950 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
            Ctrl+K
          </kbd>
        </div>

        {/* Notifications Popover */}
        <NotificationPopover />

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  )
}
