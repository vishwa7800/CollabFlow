import { Link } from 'react-router-dom'
import { Card, CardContent, Badge, Avatar } from '@/components/ui'
import { Calendar, CheckSquare, ArrowUpRight } from 'lucide-react'
import { Project, ProjectStatus, ProjectPriority } from '../types'
import { ProjectProgress } from './ProjectProgress'

export interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
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
    <Card className="group relative flex flex-col justify-between border-slate-800/90 bg-slate-900/60 p-0 hover:border-slate-700 hover:bg-slate-900/90 transition-all text-left shadow-sm">
      <CardContent className="p-5 space-y-4 flex flex-col justify-between flex-1">
        {/* Top: Badges & Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant={getStatusVariant(project.status)} size="sm">
                {project.status}
              </Badge>
              <Badge variant={getPriorityVariant(project.priority)} size="sm">
                {project.priority}
              </Badge>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Updated {project.updatedAt}
            </span>
          </div>

          {/* Title & Description */}
          <div className="space-y-1">
            <Link
              to={`/app/projects/${project.id}`}
              className="text-base font-bold text-white group-hover:text-blue-400 transition-colors inline-flex items-center gap-1 leading-snug"
            >
              <span className="line-clamp-1">{project.name}</span>
              <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-blue-400" />
            </Link>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Middle & Bottom Sections */}
        <div className="space-y-3 pt-2">
          {/* Progress Indicator */}
          <ProjectProgress progress={project.progress} status={project.status} />

          {/* Tasks & Due Date & Members Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-3 text-[11px]">
              <div className="flex items-center gap-1 text-slate-300 font-medium">
                <CheckSquare className="h-3.5 w-3.5 text-slate-500" />
                <span>
                  {project.completedTasks}/{project.totalTasks}
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                <span>{project.dueDate}</span>
              </div>
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
