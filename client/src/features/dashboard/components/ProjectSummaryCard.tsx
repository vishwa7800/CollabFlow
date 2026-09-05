import { Link } from 'react-router-dom'
import { Card, CardContent, Badge, Avatar } from '@/components/ui'
import { Calendar, CheckSquare, ArrowUpRight } from 'lucide-react'
import { ProjectSummary, ProjectStatus } from '../types'

export interface ProjectSummaryCardProps {
  project: ProjectSummary
}

export function ProjectSummaryCard({ project }: ProjectSummaryCardProps) {
  const getStatusBadgeVariant = (status: ProjectStatus) => {
    switch (status) {
      case 'In Progress':
        return 'info'
      case 'Planning':
        return 'warning'
      case 'Completed':
        return 'success'
      case 'On Hold':
        return 'default'
      default:
        return 'default'
    }
  }

  return (
    <Card className="group relative border-slate-800/90 bg-slate-900/60 hover:border-slate-700/90 hover:bg-slate-900/80 transition-all flex flex-col justify-between text-left shadow-sm">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <Link
              to="/app/projects"
              className="text-sm sm:text-base font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1 truncate"
            >
              <span className="truncate">{project.name}</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-blue-400" />
            </Link>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>
          <Badge
            variant={getStatusBadgeVariant(project.status)}
            size="sm"
            className="shrink-0"
          >
            {project.status}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-slate-500" />
              <span>
                {project.completedTasks} of {project.totalTasks} tasks
              </span>
            </div>
            <span className="font-medium text-slate-200">{project.progress}%</span>
          </div>

          <div
            className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden"
            role="progressbar"
            aria-valuenow={project.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${project.name} progress: ${project.progress}%`}
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                project.status === 'Completed'
                  ? 'bg-emerald-500'
                  : project.status === 'On Hold'
                  ? 'bg-slate-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Footer: Due Date & Member Avatars */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>Due {project.dueDate}</span>
          </div>

          {/* Member Avatars */}
          <div className="flex items-center -space-x-2">
            {project.members.slice(0, 3).map((member, idx) => (
              <div
                key={idx}
                className="ring-2 ring-slate-900 rounded-full"
                title={`${member.name} (${member.role || 'Member'})`}
              >
                <Avatar name={member.name} size="sm" />
              </div>
            ))}
            {project.members.length > 3 && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[9px] font-semibold text-slate-300 ring-2 ring-slate-900">
                +{project.members.length - 3}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
