import { Card, CardContent } from '@/components/ui'
import { MessageSquareOff, FileSpreadsheet, Layers, CheckCircle2 } from 'lucide-react'

export function ProblemSection() {
  const problems = [
    {
      icon: <MessageSquareOff className="h-5 w-5 text-red-400" />,
      title: 'Discussions lost in chat threads',
      description:
        'Project updates and decisions get buried in messaging channels. Teammates lose context on why a task changed or what was agreed upon.',
    },
    {
      icon: <FileSpreadsheet className="h-5 w-5 text-amber-400" />,
      title: 'Outdated spreadsheets & docs',
      description:
        'Static spreadsheets require manual updates and quickly become stale. Nobody knows whether a status reflects the actual ground truth.',
    },
    {
      icon: <Layers className="h-5 w-5 text-blue-400" />,
      title: 'Unclear ownership & priorities',
      description:
        'Without a single source of truth, priorities clash, deadlines are missed, and work slips through the cracks between teams.',
    },
  ]

  return (
    <section className="py-20 border-t border-slate-800/60 bg-slate-950/40 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            The Problem
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Work gets scattered when tools are disconnected.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Small teams frequently juggle work across separate messaging apps, spreadsheets, and informal notes. CollabFlow brings clarity by uniting all project execution in one place.
          </p>
        </div>

        {/* 3 Friction Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((prob, idx) => (
            <Card
              key={idx}
              className="border-slate-800/80 bg-slate-900/40 hover:border-slate-700/80 transition-all text-left"
            >
              <CardContent className="p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/50">
                  {prob.icon}
                </div>
                <h3 className="text-base font-semibold text-white">
                  {prob.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {prob.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CollabFlow Resolution Callout */}
        <div className="mt-10 rounded-2xl border border-blue-900/40 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-950/40 p-6 sm:p-8 backdrop-blur text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              <h4 className="text-sm font-semibold text-white">The CollabFlow Solution</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every project links its members, task boards, priority matrix, contextual discussions, and overall progress into a coherent workflow — giving your team a single source of truth.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              <span>Clear Ownership</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-300 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              <span>Continuous Visibility</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
