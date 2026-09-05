import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  HelpCircle,
} from 'lucide-react'
import { Avatar, Tooltip, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from '@/components/ui'
import { MAIN_NAV_ITEMS, SECONDARY_NAV_ITEMS } from '@/config/navigation'
import { APP_NAME } from '@/constants'
import { cn } from '@/lib/utils'

export interface AppSidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onToggleMobile: (open: boolean) => void
}

export function AppSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onToggleMobile,
}: AppSidebarProps) {
  const location = useLocation()
  const [helpDialogOpen, setHelpDialogOpen] = React.useState(false)

  // Listen for Escape key to close mobile drawer
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        onToggleMobile(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen, onToggleMobile])

  const renderNavItems = (items: typeof MAIN_NAV_ITEMS, isMobile = false) => {
    return items.map((item) => {
      const isActive =
        location.pathname === item.href ||
        (item.href !== '/app/dashboard' && location.pathname.startsWith(item.href))

      const Icon = item.icon

      const linkElement = (
        <Link
          key={item.href}
          to={item.href}
          onClick={() => isMobile && onToggleMobile(false)}
          className={cn(
            'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all select-none',
            isActive
              ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-900/30'
              : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200',
            collapsed && !isMobile && 'justify-center px-2'
          )}
        >
          {/* Active Accent Left Border */}
          {isActive && !collapsed && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r bg-white" />
          )}

          <Icon
            className={cn(
              'h-4 w-4 shrink-0 transition-colors',
              isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
            )}
          />

          {(!collapsed || isMobile) && (
            <span className="truncate flex-1 text-left">{item.label}</span>
          )}

          {(!collapsed || isMobile) && item.badge !== undefined && (
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
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

      if (collapsed && !isMobile) {
        return (
          <Tooltip key={item.href} content={item.label} position="right">
            {linkElement}
          </Tooltip>
        )
      }

      return linkElement
    })
  }

  const sidebarContent = (isMobile = false) => (
    <div className="flex h-full flex-col justify-between overflow-y-auto">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
          <Link
            to="/app/dashboard"
            onClick={() => isMobile && onToggleMobile(false)}
            className="flex items-center gap-2.5 overflow-hidden group"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-sm shadow-blue-900/30 group-hover:bg-blue-500 transition-colors">
              CF
            </div>
            {(!collapsed || isMobile) && (
              <div className="text-left leading-tight">
                <span className="font-bold text-sm tracking-tight text-white block">
                  {APP_NAME}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">
                  Workspace
                </span>
              </div>
            )}
          </Link>

          {!isMobile && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Primary Navigation */}
        <div className="space-y-1 px-3">
          {(!collapsed || isMobile) && (
            <div className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-left">
              Menu
            </div>
          )}
          <nav className="space-y-1">
            {renderNavItems(MAIN_NAV_ITEMS, isMobile)}
          </nav>
        </div>
      </div>

      {/* Secondary Bottom Area */}
      <div className="space-y-3 p-3 border-t border-slate-800/80">
        <nav className="space-y-1">
          {/* Settings Link */}
          {(() => {
            const SettingsIcon = SECONDARY_NAV_ITEMS[0].icon
            return (
              <Link
                to="/app/settings"
                onClick={() => isMobile && onToggleMobile(false)}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all text-slate-400 hover:bg-slate-800/70 hover:text-slate-200',
                  location.pathname === '/app/settings' && 'bg-blue-600 text-white font-semibold',
                  collapsed && !isMobile && 'justify-center px-2'
                )}
              >
                <SettingsIcon className="h-4 w-4 shrink-0" />
                {(!collapsed || isMobile) && <span>Settings</span>}
              </Link>
            )
          })()}

          {/* Help & Support Button */}
          <button
            type="button"
            onClick={() => {
              setHelpDialogOpen(true)
              if (isMobile) onToggleMobile(false)
            }}
            className={cn(
              'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 text-left',
              collapsed && !isMobile && 'justify-center px-2'
            )}
          >
            <HelpCircle className="h-4 w-4 shrink-0" />
            {(!collapsed || isMobile) && <span>Help & Docs</span>}
          </button>
        </nav>

        {/* Compact User Widget */}
        <div
          className={cn(
            'flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-2.5 text-left',
            collapsed && !isMobile && 'justify-center p-1.5'
          )}
        >
          <Avatar name="Alex Morgan" size="sm" />
          {(!collapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Alex Morgan</p>
              <p className="text-[10px] text-slate-500 truncate">alex@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col shrink-0 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl transition-all duration-200 z-30 sticky top-0 h-screen',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile Slide-in Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => onToggleMobile(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-slate-950 border-r border-slate-800 text-slate-100 shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              type="button"
              onClick={() => onToggleMobile(false)}
              className="absolute right-3 top-4 rounded-md p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close navigation drawer"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebarContent(true)}
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/40 mb-2">
              <Sparkles className="h-5 w-5" />
            </div>
            <DialogTitle>CollabFlow Quick Help & Guides</DialogTitle>
            <DialogDescription>
              Need assistance with projects, tasks, or role permissions? Here are quick references for your team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-left text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <h4 className="font-semibold text-white">Kanban Workflow</h4>
              <p className="text-slate-400">
                Drag and drop tasks between Todo, In Progress, and Done to keep the team in sync.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <h4 className="font-semibold text-white">Project Roles</h4>
              <p className="text-slate-400">
                Owners and Managers coordinate tasks, while Members and Viewers participate with appropriate access.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setHelpDialogOpen(false)}
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
