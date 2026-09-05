import { Link } from 'react-router-dom'
import { Badge, Button, Avatar, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui'
import { Plus, MoreHorizontal, Edit, Copy, Archive, Trash2, Calendar, ChevronRight, Users } from 'lucide-react'
import { Project, ProjectStatus, ProjectPriority } from '../types'

export interface ProjectHeaderProps {
  project: Project
  onAddTask: () => void
  onEditProject?: () => void
  onDuplicateProject?: () => void
  onArchiveProject?: () => void
  onDeleteProject?: () => void
  onManageMembers?: () => void
}

export function ProjectHeader({
  project,
  onAddTask,
  onEditProject,
  onDuplicateProject,
  onArchiveProject,
  onDeleteProject,
  onManageMembers,
}: ProjectHeaderProps) {
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
    <div className="space-y-4 border-b border-slate-800/80 pb-5 text-left">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link to="/app/dashboard" className="hover:text-slate-200 transition-colors">
          Workspace
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
        <Link to="/app/projects" className="hover:text-slate-200 transition-colors">
          Projects
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
        <span className="font-medium text-slate-200 truncate max-w-xs sm:max-w-md">
          {project.name}
        </span>
      </nav>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title, Badges, Description */}
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white truncate">
              {project.name}
            </h1>
            <Badge variant={getStatusVariant(project.status)} size="sm">
              {project.status}
            </Badge>
            <Badge variant={getPriorityVariant(project.priority)} size="sm">
              {project.priority} Priority
            </Badge>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            {project.description}
          </p>

          {/* Tags & Due Date Metadata */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <span>Due {project.dueDate}</span>
            </div>

            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
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

            {/* Member Avatars */}
            <div
              onClick={onManageMembers}
              className="flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity pl-1"
              title="Click to manage team members"
            >
              <div className="flex items-center -space-x-2">
                {project.members.slice(0, 4).map((m) => (
                  <div key={m.id} className="ring-2 ring-slate-950 rounded-full">
                    <Avatar name={m.name} size="sm" />
                  </div>
                ))}
                {project.members.length > 4 && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-300 ring-2 ring-slate-950">
                    +{project.members.length - 4}
                  </div>
                )}
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                {project.members.length} members
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onManageMembers}
            leftIcon={<Users className="h-3.5 w-3.5" />}
            className="hidden sm:inline-flex"
          >
            Members
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onAddTask}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Task
          </Button>

          {/* Project Actions Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Project actions menu"
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="right" className="w-48">
              <DropdownMenuItem
                icon={<Edit className="h-3.5 w-3.5" />}
                onClick={onEditProject}
              >
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem
                icon={<Copy className="h-3.5 w-3.5" />}
                onClick={onDuplicateProject}
              >
                Duplicate Project
              </DropdownMenuItem>
              <DropdownMenuItem
                icon={<Archive className="h-3.5 w-3.5" />}
                onClick={onArchiveProject}
              >
                Archive Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                destructive
                icon={<Trash2 className="h-3.5 w-3.5" />}
                onClick={onDeleteProject}
              >
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
