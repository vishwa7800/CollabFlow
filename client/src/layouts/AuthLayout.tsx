import { Outlet, Link } from 'react-router-dom'
import { APP_NAME } from '@/constants'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

export function AuthLayout() {
  const highlights = [
    'Centralized project boards & real-time progress',
    'Role-based permissions (Owner, Manager, Member, Viewer)',
    'In-task discussion threads keeping context connected',
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Bar */}
      <header className="px-6 py-4 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-bold text-white text-xs shadow-sm shadow-blue-900/30 group-hover:bg-blue-500 transition-colors">
              CF
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              {APP_NAME}
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to home</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Brand Panel (Desktop lg+) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-8 pr-4 text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3 py-1 text-xs font-medium text-blue-300">
                <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400" />
                <span>Modern Project Management</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white leading-snug">
                Plan the work. Collaborate clearly. Ship together.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                CollabFlow provides small teams with one centralized workspace where projects, task owners, and discussions stay connected.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-3">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Subtle Workflow Card */}
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-white">Project Pipeline</span>
                <span className="text-emerald-400 font-medium">Active Sprint</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full w-3/4" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>9 Tasks completed</span>
                <span>75% Progress</span>
              </div>
            </div>
          </div>

          {/* Right Auth Form Area */}
          <div className="w-full lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md">
              <Outlet />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <p>© {new Date().getFullYear()} CollabFlow. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <Link to="/dev/design-system" className="hover:text-blue-400 transition-colors">
              UI System
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
