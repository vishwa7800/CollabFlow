import { Link } from 'react-router-dom'
import { Badge, Avatar } from '@/components/ui'
import { Calendar, CheckSquare, ChevronRight } from 'lucide-react'
import { Project, ProjectStatus, ProjectPriority } from '../types'
import { ProjectProgress } from './ProjectProgress'

export interface ProjectListItemProps {
  project: Project
}

export function ProjectListItem({ project }: ProjectListItemProps) {
  const getStatusVariant = (status: ProjectStatus) => {
    switch (status) {
      case 'In Progress':
        return 'info'
      case 'Planning':
        return 'warning'
      case 'Completed':
        return 'success'
      case 'On Hold':
      default:
        return 'default'
    }
  }

  const getPriorityVariant = (priority: ProjectPriority) => {
    switch (priority) {
      case 'High':
        return 'destructive'
      case 'Medium':
        return 'warning'
      case 'Low':
      default:
        return 'default'
    }
  }

  return (
    <div className="group flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800/90 bg-slate-900/50 hover:bg-slate-900/90 hover:border-slate-700/90 transition-all text-left">
      {/* Left: Title, Description, Tags */}
      <div className="space-y-1.5 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/app/projects/${project.id}`}
            className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate"
          >
            {project.name}
          </Link>
          <Badge variant={getStatusVariant(project.status)} size="sm">
            {project.status}
          </Badge>
          <Badge variant={getPriorityVariant(project.priority)} size="sm">
            {project.priority}
          </Badge>
        </div>
        <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl">
          {project.description}
        </p>
      </div>

      {/* Center/Right: Progress & Metrics */}
      <div className="flex flex-wrap items-center gap-6 shrink-0 lg:justify-end">
        {/* Progress */}
        <div className="w-32 hidden sm:block">
          <ProjectProgress progress={project.progress} status={project.status} />
        </div>

        {/* Tasks */}
        <div className="flex items-center gap-1.5 text-xs text-slate-300 min-w-[70px]">
          <CheckSquare className="h-3.5 w-3.5 text-slate-500" />
          <span>
            {project.completedTasks}/{project.totalTasks}
          </span>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 min-w-[100px]">
          <Calendar className="h-3.5 w-3.5 text-slate-500" />
          <span>{project.dueDate}</span>
        </div>

        {/* Member Avatars */}
        <div className="flex items-center -space-x-2">
          {project.members.slice(0, 3).map((m) => (
            <div
              key={m.id}
              className="ring-2 ring-slate-900 rounded-full"
              title={`${m.name} (${m.role || 'Member'})`}
            >
              <Avatar name={m.name} size="sm" />
            </div>
          ))}
          {project.members.length > 3 && (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-300 ring-2 ring-slate-900">
              +{project.members.length - 3}
            </div>
          )}
        </div>

        {/* Arrow Action */}
        <Link
          to={`/app/projects/${project.id}`}
          className="text-slate-500 group-hover:text-blue-400 transition-colors p-1"
          aria-label={`Open ${project.name}`}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
