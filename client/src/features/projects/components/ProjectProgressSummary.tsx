import { Card, CardContent } from '@/components/ui'
import { CheckCircle2, Clock, Calendar } from 'lucide-react'
import { Project, ProjectTask } from '../types'
import { ProjectProgress } from './ProjectProgress'
import { calculateProjectMetrics } from '../utils/taskMetrics'

export interface ProjectProgressSummaryProps {
  project: Project
  tasks: ProjectTask[]
}

export function ProjectProgressSummary({ project, tasks }: ProjectProgressSummaryProps) {
  const metrics = calculateProjectMetrics(tasks)

  return (
    <Card className="border-slate-800/80 bg-slate-900/40 p-4 sm:p-5 text-left shadow-sm">
      <CardContent className="p-0 space-y-4">
        {/* Top: Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Overall Progress
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-white">
                {metrics.progressPercent}%
              </span>
              <span className="text-xs text-slate-400">Complete</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Tasks Completed
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-base font-bold text-white">
                {metrics.completedTasks}/{metrics.totalTasks}
              </span>
              <span className="text-slate-400">tasks</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              In Progress / Open
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Clock className="h-4 w-4 text-blue-400 shrink-0" />
              <span className="text-base font-bold text-white">
                {metrics.inProgressTasks} active
              </span>
              <span className="text-slate-400">({metrics.openTasks} open)</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Timeline Delivery
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200 truncate">
                Due {project.dueDate}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom: Progress Bar */}
        <ProjectProgress
          progress={metrics.progressPercent}
          status={project.status}
          showLabel={false}
        />
      </CardContent>
    </Card>
  )
}
