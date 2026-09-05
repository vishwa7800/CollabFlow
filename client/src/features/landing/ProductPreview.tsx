import {
  Card,
  Badge,
  Avatar,
  Button,
} from '@/components/ui'
import {
  FolderKanban,
  CheckSquare,
  Users,
  LayoutDashboard,
  Search,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  Calendar,
} from 'lucide-react'

export function ProductPreview() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pb-20 -mt-4">
      <div className="mx-auto max-w-6xl">
        {/* Mockup Frame Wrapper */}
        <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-2 sm:p-3.5 shadow-2xl shadow-blue-950/20 backdrop-blur-xl ring-1 ring-white/10">
          {/* Window Header Dots */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/80 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-[11px] font-mono text-slate-500 hidden sm:inline">
                app.collabflow.dev/projects/website-redesign/board
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm" dot pulseDot>Live Sync</Badge>
            </div>
          </div>

          {/* Inner Application Shell Preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden min-h-[520px]">
            {/* Sidebar Mock */}
            <div className="hidden md:flex md:col-span-3 lg:col-span-2 flex-col justify-between border-r border-slate-800/80 bg-slate-950/60 p-3">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 px-2 py-1.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 font-bold text-white text-xs">
                    CF
                  </div>
                  <span className="font-semibold text-xs text-white">Acme Team</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span>Dashboard</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="h-3.5 w-3.5" />
                      <span>Projects</span>
                    </div>
                    <span className="rounded-full bg-blue-700 px-1.5 py-0.2 text-[10px]">3</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200">
                    <CheckSquare className="h-3.5 w-3.5" />
                    <span>My Tasks</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200">
                    <Users className="h-3.5 w-3.5" />
                    <span>Members</span>
                  </div>
                </div>
              </div>

              {/* Sidebar User */}
              <div className="flex items-center gap-2 border-t border-slate-800/80 pt-3 px-1">
                <Avatar name="Alex Rivera" size="sm" />
                <div className="overflow-hidden text-left">
                  <p className="text-[11px] font-semibold text-white truncate">Alex Rivera</p>
                  <p className="text-[10px] text-slate-500 truncate">Project Lead</p>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-1 md:col-span-9 lg:col-span-10 flex flex-col bg-slate-900/20">
              {/* Workspace Top Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 px-4 sm:px-6 py-3 bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Website Redesign & Platform Launch
                  </h2>
                  <Badge variant="info" size="sm">Q3 Priority</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-400">
                    <Search className="h-3.5 w-3.5" />
                    <span>Search board...</span>
                  </div>
                  <Button variant="primary" size="sm" leftIcon={<Plus className="h-3 w-3" />}>
                    Add Task
                  </Button>
                </div>
              </div>

              {/* Project Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 px-4 sm:px-6 py-2.5 bg-slate-950/20 text-xs">
                <div className="flex items-center gap-4 text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>Target: Sep 15, 2026</span>
                  </span>
                  <span className="hidden sm:inline text-slate-700">|</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>6 of 9 Tasks Complete</span>
                  </span>
                </div>

                {/* Assignees Stack */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Team:</span>
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <Avatar name="Alex Rivera" size="sm" className="ring-2 ring-slate-900" />
                    <Avatar name="Sarah Connor" size="sm" className="ring-2 ring-slate-900" />
                    <Avatar name="Rahul Sharma" size="sm" className="ring-2 ring-slate-900" />
                    <Avatar name="Priya Patel" size="sm" className="ring-2 ring-slate-900" />
                  </div>
                </div>
              </div>

              {/* Kanban Board Columns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-6 overflow-x-auto">
                {/* Column 1: Todo */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-400" />
                      <span className="text-xs font-semibold text-slate-300">Todo</span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">2</span>
                  </div>

                  {/* Task Card 1 */}
                  <Card className="p-3 border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-colors shadow-sm text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" size="sm">Database</Badge>
                      <Badge variant="default" size="sm">Low</Badge>
                    </div>
                    <p className="text-xs font-medium text-slate-100 leading-snug">
                      Configure PostgreSQL database migrations & schema models
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span>Sep 5</span>
                      </span>
                      <Avatar name="Sarah Connor" size="sm" />
                    </div>
                  </Card>

                  {/* Task Card 2 */}
                  <Card className="p-3 border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-colors shadow-sm text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" size="sm">Launch</Badge>
                      <Badge variant="warning" size="sm">Medium</Badge>
                    </div>
                    <p className="text-xs font-medium text-slate-100 leading-snug">
                      Prepare Q3 product launch checklist & assets
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span>Sep 8</span>
                      </span>
                      <Avatar name="Rahul Sharma" size="sm" />
                    </div>
                  </Card>
                </div>

                {/* Column 2: In Progress */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                      <span className="text-xs font-semibold text-blue-300">In Progress</span>
                    </div>
                    <span className="text-[11px] font-medium text-blue-400 font-mono">2</span>
                  </div>

                  {/* Task Card 3 */}
                  <Card className="p-3 border-blue-900/40 bg-slate-900/90 hover:border-blue-700/60 transition-colors shadow-sm text-left space-y-2 ring-1 ring-blue-500/20">
                    <div className="flex items-center justify-between">
                      <Badge variant="info" size="sm">Auth</Badge>
                      <Badge variant="destructive" size="sm">High</Badge>
                    </div>
                    <p className="text-xs font-medium text-white leading-snug">
                      Finalize user onboarding & authentication session flow
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Clock className="h-3 w-3" />
                        <span>Tomorrow</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5 text-slate-400">
                          <MessageSquare className="h-3 w-3" />
                          <span>3</span>
                        </span>
                        <Avatar name="Alex Rivera" size="sm" />
                      </div>
                    </div>
                  </Card>

                  {/* Task Card 4 */}
                  <Card className="p-3 border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-colors shadow-sm text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="info" size="sm">Billing</Badge>
                      <Badge variant="destructive" size="sm">High</Badge>
                    </div>
                    <p className="text-xs font-medium text-slate-100 leading-snug">
                      Implement payment webhook listener & verification
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span>Sep 4</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5 text-slate-400">
                          <MessageSquare className="h-3 w-3" />
                          <span>5</span>
                        </span>
                        <Avatar name="Priya Patel" size="sm" />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Column 3: Done */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-300">Done</span>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-400">2</span>
                  </div>

                  {/* Task Card 5 */}
                  <Card className="p-3 border-slate-800/70 bg-slate-900/50 hover:border-slate-700 transition-colors shadow-sm text-left space-y-2 opacity-85">
                    <div className="flex items-center justify-between">
                      <Badge variant="success" size="sm">Architecture</Badge>
                      <Badge variant="success" size="sm">Done</Badge>
                    </div>
                    <p className="text-xs font-medium text-slate-300 line-through leading-snug">
                      Design centralized API communication client
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] text-slate-500">
                      <span>Completed Aug 31</span>
                      <Avatar name="Rahul Sharma" size="sm" />
                    </div>
                  </Card>

                  {/* Task Card 6 */}
                  <Card className="p-3 border-slate-800/70 bg-slate-900/50 hover:border-slate-700 transition-colors shadow-sm text-left space-y-2 opacity-85">
                    <div className="flex items-center justify-between">
                      <Badge variant="success" size="sm">Design</Badge>
                      <Badge variant="success" size="sm">Done</Badge>
                    </div>
                    <p className="text-xs font-medium text-slate-300 line-through leading-snug">
                      Set up design tokens and reusable UI system
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] text-slate-500">
                      <span>Completed Aug 31</span>
                      <Avatar name="Sarah Connor" size="sm" />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
