import { Link } from 'react-router-dom'
import { Button, Badge } from '@/components/ui'
import { ArrowRight, Play, CheckCircle2, Shield, MessageSquare } from 'lucide-react'

export function Hero() {
  const handleScrollToWorkflow = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const elem = document.querySelector('#how-it-works')
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Background ambient gradient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-blue-600/10 blur-[120px] -z-10" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        {/* Top Product Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3.5 py-1 text-xs font-medium text-blue-300 shadow-sm backdrop-blur-md mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>Structured Project & Task Collaboration</span>
        </div>

        {/* Hero Main Heading */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl max-w-4xl mx-auto leading-[1.1] animate-in fade-in slide-in-from-bottom-3 duration-500">
          One workspace for projects, tasks, and team execution.
        </h1>

        {/* Hero Supporting Subtext */}
        <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          Stop losing momentum between scattered messaging threads, disconnected spreadsheets, and outdated task lists. CollabFlow unifies projects, task boards, discussions, and progress in one structured platform.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <Link to="/signup" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-7 py-3 text-sm shadow-lg shadow-blue-950/50"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Get started
            </Button>
          </Link>
          <a
            href="#how-it-works"
            onClick={handleScrollToWorkflow}
            className="w-full sm:w-auto"
          >
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto px-6 py-3 text-sm"
              leftIcon={<Play className="h-3.5 w-3.5 fill-current" />}
            >
              See how it works
            </Button>
          </a>
        </div>

        {/* Core Capabilities Chips */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-blue-400" />
            <span>Kanban Workflow</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>Role-Based Access</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-cyan-400" />
            <span>Task Discussions</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <Badge variant="success" size="sm" dot>Live Progress</Badge>
          </div>
        </div>
      </div>
    </section>
  )
}
