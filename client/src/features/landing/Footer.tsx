import { Link } from 'react-router-dom'
import { APP_NAME } from '@/constants'

export function Footer() {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const elem = document.querySelector(href)
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-12 lg:px-8 text-xs text-slate-400">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Left: Brand & Statement */}
        <div className="space-y-2 max-w-sm text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 font-bold text-white text-xs">
              CF
            </div>
            <span className="font-bold text-sm text-white tracking-tight">
              {APP_NAME}
            </span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            A collaborative project management platform giving small agile teams one structured workspace for projects, tasks, discussions, and progress.
          </p>
        </div>

        {/* Right: Quick Links */}
        <div className="flex flex-wrap gap-8 sm:gap-12 text-left">
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Product</h4>
            <ul className="space-y-1.5">
              <li>
                <a href="#features" onClick={(e) => handleScrollTo(e, '#features')} className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" onClick={(e) => handleScrollTo(e, '#how-it-works')} className="hover:text-white transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="#collaboration" onClick={(e) => handleScrollTo(e, '#collaboration')} className="hover:text-white transition-colors">
                  Collaboration
                </a>
              </li>
              <li>
                <Link to="/app/dashboard" className="hover:text-white transition-colors">
                  Application Preview
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Account</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Log in
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white transition-colors">
                  Sign up
                </Link>
              </li>
              <li>
                <Link to="/dev/design-system" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Design System
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mx-auto max-w-7xl mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
        <p>© {new Date().getFullYear()} CollabFlow. All rights reserved.</p>
        <p>Built with React, TypeScript & Tailwind CSS.</p>
      </div>
    </footer>
  )
}
