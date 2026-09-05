import { Link } from 'react-router-dom'
import { Badge, Card } from '@/components/ui'
import { ArrowRight, Clock } from 'lucide-react'
import { TaskSummary, TaskPriority, TaskStatus } from '../types'

export interface MyWorkProps {
  tasks: TaskSummary[]
}

export function MyWork({ tasks }: MyWorkProps) {
  const getPriorityBadgeVariant = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return 'destructive'
      case 'Medium':
        return 'warning'
      case 'Low':
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusBadgeVariant = (status: TaskStatus) => {
    switch (status) {
      case 'In Progress':
        return 'info'
      case 'Review':
        return 'warning'
      case 'Done':
        return 'success'
      case 'Todo':
      default:
        return 'default'
    }
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            My Work
          </h2>
          <p className="text-xs text-slate-400">
            Tasks currently assigned to you across projects.
          </p>
        </div>

        <Link
          to="/app/tasks"
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-medium"
        >
          <span>All tasks</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <Card className="border-slate-800/90 bg-slate-900/60 overflow-hidden divide-y divide-slate-800/70 shadow-sm">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-slate-800/40 transition-colors"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    task.status === 'Done'
                      ? 'bg-emerald-400'
                      : task.status === 'In Progress'
                      ? 'bg-blue-400'
                      : 'bg-slate-500'
                  }`}
                />
                <Link
                  to="/app/tasks"
                  className="text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors truncate"
                >
                  {task.title}
                </Link>
              </div>
              <p className="text-[11px] text-slate-400 pl-4 truncate">
                {task.projectName}
              </p>
            </div>

            <div className="flex items-center gap-2.5 pl-4 sm:pl-0 shrink-0">
              <Badge variant={getPriorityBadgeVariant(task.priority)} size="sm">
                {task.priority}
              </Badge>

              <Badge variant={getStatusBadgeVariant(task.status)} size="sm">
                {task.status}
              </Badge>

              <span
                className={`text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1 ${
                  task.dueUrgent
                    ? 'text-amber-300 bg-amber-950/40 border border-amber-800/40'
                    : 'text-slate-400'
                }`}
              >
                <Clock className="h-3 w-3" />
                <span>{task.dueDate}</span>
              </span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
