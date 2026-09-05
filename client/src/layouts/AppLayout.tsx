import * as React from 'react'
import { Outlet } from 'react-router-dom'
import { AppSidebar, AppTopNav } from '@/components/layout'

export function AppLayout() {
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Sidebar */}
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onToggleMobile={setMobileOpen}
      />

      {/* Main Workspace Column */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Navigation Bar */}
        <AppTopNav onToggleMobile={() => setMobileOpen(true)} />

        {/* Dynamic Page Content Region */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
