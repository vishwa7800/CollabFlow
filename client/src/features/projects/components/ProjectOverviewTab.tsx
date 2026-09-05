import { Card, Avatar, Button } from '@/components/ui'
import { Users, ArrowUpRight, Calendar, Activity } from 'lucide-react'
import { Project, ProjectTask, ProjectActivityItem } from '../types'
import { calculateProjectMetrics } from '../utils/taskMetrics'

export interface ProjectOverviewTabProps {
  project: Project
  tasks: ProjectTask[]
  activities: ProjectActivityItem[]
  onSelectTask: (task: ProjectTask) => void
  onManageMembers: () => void
  onSwitchTab: (tab: 'board' | 'tasks' | 'activity') => void
}

export function ProjectOverviewTab({
  project,
  tasks,
  activities,
  onSelectTask,
  onManageMembers,
  onSwitchTab,
}: ProjectOverviewTabProps) {
  const metrics = calculateProjectMetrics(tasks)

  const upcomingTasks = tasks
    .filter((t) => t.status !== 'Done')
    .slice(0, 4)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
      {/* Left Column: Project Summary, Status Breakdown & Members (7 cols on desktop) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Status Breakdown Card */}
        <Card className="border-slate-800/90 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-semibold text-white">
              Workflow Status Breakdown
            </h3>
            <button
              type="button"
              onClick={() => onSwitchTab('board')}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-medium"
            >
              <span>Open board</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-3 text-center space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                To Do
              </span>
              <p className="text-xl font-bold text-slate-200">{metrics.todoTasks}</p>
            </div>
            <div className="rounded-lg bg-blue-950/30 border border-blue-900/40 p-3 text-center space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-400">
                In Progress
              </span>
              <p className="text-xl font-bold text-blue-300">{metrics.inProgressTasks}</p>
            </div>
            <div className="rounded-lg bg-amber-950/30 border border-amber-900/40 p-3 text-center space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400">
                In Review
              </span>
              <p className="text-xl font-bold text-amber-300">{metrics.reviewTasks}</p>
            </div>
            <div className="rounded-lg bg-emerald-950/30 border border-emerald-900/40 p-3 text-center space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400">
                Completed
              </span>
              <p className="text-xl font-bold text-emerald-300">{metrics.completedTasks}</p>
            </div>
          </div>
        </Card>

        {/* Team Members Card */}
        <Card className="border-slate-800/90 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">
                Project Team ({project.members.length})
              </h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onManageMembers}
              className="h-7 text-xs"
            >
              Manage members
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.members.map((member) => {
              const memberTasks = tasks.filter((t) => t.assignee?.id === member.id).length
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={member.name} size="sm" />
                    <div className="space-y-0.5 truncate">
                      <p className="text-xs font-semibold text-white truncate">
                        {member.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {member.role || 'Member'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">
                    {memberTasks} {memberTasks === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Right Column: Upcoming Deadlines & Recent Activity (5 cols on desktop) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Upcoming Tasks Card */}
        <Card className="border-slate-800/90 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">
                Upcoming Deadlines
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onSwitchTab('tasks')}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-medium"
            >
              <span>View all</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/70">
            {upcomingTasks.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No upcoming open task deadlines.
              </p>
            ) : (
              upcomingTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSelectTask(t)}
                  className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 cursor-pointer hover:bg-slate-800/30 px-1.5 rounded transition-colors group"
                >
                  <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                      {t.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span>{t.assignee?.name || 'Unassigned'}</span>
                      <span>•</span>
                      <span>{t.status}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-amber-400 shrink-0">
                    {t.dueDate || 'No date'}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Activity Card */}
        <Card className="border-slate-800/90 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">
                Recent Project Activity
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onSwitchTab('activity')}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-medium"
            >
              <span>Full timeline</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/70">
            {activities.slice(0, 4).map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-2.5 py-2.5 first:pt-0 last:pb-0 text-xs"
              >
                <Avatar name={act.user.name} size="sm" className="mt-0.5 h-6 w-6 text-[10px]" />
                <div className="space-y-0.5 flex-1 min-w-0">
                  <p className="text-slate-300 leading-snug">
                    <strong className="text-white font-medium">{act.user.name}</strong>{' '}
                    <span className="text-slate-400">{act.action}</span>{' '}
                    <span className="text-blue-300 font-medium">{act.target}</span>
                  </p>
                  <span className="text-[10px] text-slate-500 block">
                    {act.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
