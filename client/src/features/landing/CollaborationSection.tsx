import { Card, CardContent, Badge, Avatar } from '@/components/ui'
import {
  ArrowRight,
  FolderKanban,
  CheckSquare,
  Users,
  Clock,
  MessageSquare,
  TrendingUp,
} from 'lucide-react'

export function CollaborationSection() {
  const connectionChain = [
    { label: 'Project', icon: <FolderKanban className="h-4 w-4 text-blue-400" /> },
    { label: 'Tasks', icon: <CheckSquare className="h-4 w-4 text-indigo-400" /> },
    { label: 'Assignees', icon: <Users className="h-4 w-4 text-cyan-400" /> },
    { label: 'Status', icon: <Clock className="h-4 w-4 text-amber-400" /> },
    { label: 'Discussions', icon: <MessageSquare className="h-4 w-4 text-rose-400" /> },
    { label: 'Progress', icon: <TrendingUp className="h-4 w-4 text-emerald-400" /> },
  ]

  return (
    <section id="collaboration" className="py-20 scroll-mt-16 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Connected Collaboration
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everyone knows what needs to happen next.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            No more chasing down teammates or guessing task statuses. CollabFlow connects every link in your project delivery chain.
          </p>
        </div>

        {/* Visual Connection Ribbon */}
        <div className="mt-12 overflow-x-auto pb-4">
          <div className="flex items-center justify-start md:justify-center gap-2 sm:gap-3 min-w-max px-2">
            {connectionChain.map((node, idx) => (
              <div key={node.label} className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3.5 py-2 shadow-sm">
                  {node.icon}
                  <span className="text-xs font-semibold text-white">{node.label}</span>
                </div>
                {idx < connectionChain.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-slate-600 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Visual Composition Card: Contextual Task In Action */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-md overflow-hidden shadow-2xl">
            <div className="border-b border-slate-800/80 bg-slate-950/60 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-xs font-mono text-slate-400">TASK-104</span>
                <span className="text-sm font-semibold text-white">
                  Finalize user onboarding & authentication flow
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="info" size="sm" dot pulseDot>In Progress</Badge>
                <Badge variant="destructive" size="sm">High Priority</Badge>
              </div>
            </div>

            <CardContent className="p-6 space-y-6 text-left">
              {/* Task Details Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Project</span>
                  <span className="font-medium text-slate-200 mt-0.5 block">Website Redesign</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Assignee</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Avatar name="Alex Rivera" size="sm" />
                    <span className="font-medium text-slate-200">Alex Rivera</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Due Date</span>
                  <span className="font-medium text-amber-400 mt-0.5 block">Tomorrow</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Project Health</span>
                  <span className="font-medium text-emerald-400 mt-0.5 block">72% Completed</span>
                </div>
              </div>

              {/* Connected Task Comments Thread */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
                  <span>Discussion attached to this task (2 comments)</span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 rounded-lg border border-slate-800/60 bg-slate-950/50 p-3 text-xs">
                    <Avatar name="Sarah Connor" size="sm" />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Sarah Connor</span>
                        <span className="text-[10px] text-slate-500">Today at 10:15 AM</span>
                      </div>
                      <p className="text-slate-300">
                        I’ve reviewed the session token validation logic. Everything looks solid for merging into staging.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-slate-800/60 bg-slate-950/50 p-3 text-xs">
                    <Avatar name="Alex Rivera" size="sm" />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Alex Rivera</span>
                        <span className="text-[10px] text-slate-500">Today at 11:30 AM</span>
                      </div>
                      <p className="text-slate-300">
                        Thanks Sarah! Moving this task to Done as soon as tests pass on CI.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
