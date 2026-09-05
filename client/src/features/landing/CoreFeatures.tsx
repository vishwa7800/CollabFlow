import { Card, CardContent } from '@/components/ui'
import {
  FolderKanban,
  CheckSquare,
  Columns3,
  ShieldCheck,
  MessageSquare,
  BarChart3,
} from 'lucide-react'

export function CoreFeatures() {
  const features = [
    {
      icon: <FolderKanban className="h-5 w-5 text-blue-400" />,
      title: 'Project Workspaces',
      description:
        'Create and structure dedicated project workspaces with descriptions, target milestones, assigned team members, and live progress metrics.',
    },
    {
      icon: <CheckSquare className="h-5 w-5 text-indigo-400" />,
      title: 'Task Management',
      description:
        'Define clear task titles, comprehensive descriptions, due dates, priority tiers (Low, Medium, High), and assign owners with accountability.',
    },
    {
      icon: <Columns3 className="h-5 w-5 text-cyan-400" />,
      title: 'Kanban Workflow',
      description:
        'Visualize your team’s delivery pipeline with structured Todo, In Progress, and Done columns. Move and update tasks with real-time status transitions.',
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
      title: 'Role-Based Access Control',
      description:
        'Protect project integrity with granular project roles: Owner, Manager, Member, and Viewer — ensuring proper permissions at every stage.',
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-amber-400" />,
      title: 'Contextual Discussions',
      description:
        'Discuss tasks directly in context. Keep feedback, review notes, and blockers attached to the specific unit of work instead of lost in chat apps.',
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-rose-400" />,
      title: 'Progress Visibility',
      description:
        'Track total projects, active tasks, completion percentages, and overdue warnings in an executive dashboard overview.',
    },
  ]

  return (
    <section id="features" className="py-20 scroll-mt-16 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Capabilities
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything your team needs to deliver together.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            A cohesive suite of project tools built for speed, focus, and clarity — without the bloat of legacy project management software.
          </p>
        </div>

        {/* 6 Features Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="border-slate-800/80 bg-slate-900/40 hover:border-slate-700/90 hover:bg-slate-900/60 transition-all duration-200 group text-left"
            >
              <CardContent className="p-6 space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800/90 border border-slate-700/60 group-hover:border-blue-500/40 group-hover:bg-blue-950/30 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
