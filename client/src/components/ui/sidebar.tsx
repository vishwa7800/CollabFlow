import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SidebarItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string | number
}

export interface SidebarGroup {
  label?: string
  items: SidebarItem[]
}

export interface SidebarProps {
  groups: SidebarGroup[]
  brandLogo?: React.ReactNode
  brandName?: string
  footer?: React.ReactNode
  className?: string
}

export function Sidebar({
  groups,
  brandLogo,
  brandName = 'CollabFlow',
  footer,
  className,
}: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const location = useLocation()

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Brand / Logo Area */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 overflow-hidden"
          >
            {brandLogo || (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-sm shadow-blue-900/30">
                CF
              </div>
            )}
            {!collapsed && (
              <span className="font-semibold text-sm tracking-tight text-white truncate">
                {brandName}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-md border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Nav Items */}
        <div className="space-y-6 px-3 py-4">
          {groups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {group.label && !collapsed && (
                <div className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {group.label}
                </div>
              )}
              {group.items.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== '/' && location.pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    title={collapsed ? item.label : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all group',
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/20'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200',
                      collapsed && 'justify-center px-2'
                    )}
                  >
                    <span
                      className={cn(
                        'shrink-0 text-slate-400 group-hover:text-slate-200 transition-colors',
                        isActive && 'text-white'
                      )}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}
                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          isActive
                            ? 'bg-blue-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Area */}
      {footer && (
        <div className="border-t border-slate-800/80 p-3">
          {footer}
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-4 z-40 flex md:hidden items-center justify-center h-9 w-9 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 shadow-sm"
        aria-label="Open sidebar menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col shrink-0 border-r border-slate-800/80 bg-slate-900/50 backdrop-blur-md transition-all duration-200',
          collapsed ? 'w-16' : 'w-60',
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-slate-900 border-r border-slate-800 text-slate-100 shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-md p-1 text-slate-400 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
