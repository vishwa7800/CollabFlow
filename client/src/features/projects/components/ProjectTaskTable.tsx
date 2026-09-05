import * as React from 'react'
import { Input, Select, Badge, Avatar, Button, EmptyState } from '@/components/ui'
import { Search, X, MessageSquare, Clock, SearchX, Plus, Timer } from 'lucide-react'
import { ProjectTask, TaskStatus, TaskPriority, ProjectMember } from '../types'

export interface ProjectTaskTableProps {
  tasks: ProjectTask[]
  members: ProjectMember[]
  onSelectTask: (task: ProjectTask) => void
  onAddTask: () => void
  onMoveTaskStatus?: (taskId: string, newStatus: TaskStatus) => void
}

export function ProjectTaskTable({
  tasks,
  members,
  onSelectTask,
  onAddTask,
  onMoveTaskStatus,
}: ProjectTaskTableProps) {
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<'All' | TaskStatus>('All')
  const [priorityFilter, setPriorityFilter] = React.useState<'All' | TaskPriority>('All')
  const [assigneeFilter, setAssigneeFilter] = React.useState<string>('All')
  const [sortBy, setSortBy] = React.useState<'dueDate' | 'priority' | 'title'>('dueDate')

  const statusOptions = [
    { value: 'All', label: 'All Statuses' },
    { value: 'Todo', label: 'To Do' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Review', label: 'In Review' },
    { value: 'Done', label: 'Completed' },
  ]

  const priorityOptions = [
    { value: 'All', label: 'All Priorities' },
    { value: 'High', label: 'High Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'Low', label: 'Low Priority' },
  ]

  const assigneeOptions = [
    { value: 'All', label: 'All Assignees' },
    ...members.map((m) => ({ value: m.id, label: m.name })),
  ]

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Task Title' },
  ]

  const filteredTasks = React.useMemo(() => {
    return tasks
      .filter((t) => {
        if (search.trim()) {
          const q = search.toLowerCase()
          const matchesTitle = t.title.toLowerCase().includes(q)
          const matchesDesc = t.description?.toLowerCase().includes(q)
          const matchesTag = t.tags?.some((tag) => tag.toLowerCase().includes(q))
          if (!matchesTitle && !matchesDesc && !matchesTag) return false
        }

        if (statusFilter !== 'All' && t.status !== statusFilter) return false
        if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false
        if (assigneeFilter !== 'All' && t.assignee?.id !== assigneeFilter) return false

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title)
        }
        if (sortBy === 'priority') {
          const weights: Record<TaskPriority, number> = { High: 3, Medium: 2, Low: 1 }
          return weights[b.priority] - weights[a.priority]
        }
        // Due Date default
        return (a.dueDateTimestamp || 0) - (b.dueDateTimestamp || 0)
      })
  }, [tasks, search, statusFilter, priorityFilter, assigneeFilter, sortBy])

  const handleResetFilters = () => {
    setSearch('')
    setStatusFilter('All')
    setPriorityFilter('All')
    setAssigneeFilter('All')
    setSortBy('dueDate')
  }

  const getPriorityVariant = (priority: TaskPriority) => {
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
    <div className="space-y-4 text-left">
      {/* Search & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Input
            placeholder="Search project tasks by title, description, or tag..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-slate-500" />}
            rightIcon={
              search ? (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-slate-400 hover:text-white p-1"
                  aria-label="Clear task search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : undefined
            }
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-32">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setStatusFilter(e.target.value as 'All' | TaskStatus)
              }
            />
          </div>

          <div className="w-32">
            <Select
              options={priorityOptions}
              value={priorityFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setPriorityFilter(e.target.value as 'All' | TaskPriority)
              }
            />
          </div>

          <div className="w-36">
            <Select
              options={assigneeOptions}
              value={assigneeFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setAssigneeFilter(e.target.value)
              }
            />
          </div>

          <div className="w-36">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSortBy(e.target.value as 'dueDate' | 'priority' | 'title')
              }
            />
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onAddTask}
            leftIcon={<Plus className="h-4 w-4" />}
            className="hidden sm:inline-flex"
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Task List / Table */}
      {filteredTasks.length === 0 ? (
        <div className="py-12">
          <EmptyState
            icon={<SearchX className="h-7 w-7 text-amber-400" />}
            title="No matching tasks found"
            description="Try changing your search terms or clearing your status and assignee filters."
            primaryAction={
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Clear filters
              </Button>
            }
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/60 shadow-sm divide-y divide-slate-800/70">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onSelectTask(task)}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              {/* Task Details */}
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                      task.status === 'Done'
                        ? 'bg-emerald-400'
                        : task.status === 'In Progress'
                        ? 'bg-blue-400'
                        : task.status === 'Review'
                        ? 'bg-amber-400'
                        : 'bg-slate-500'
                    }`}
                  />
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition-colors truncate">
                    {task.title}
                  </h4>
                </div>

                {task.description && (
                  <p className="text-xs text-slate-400 pl-4 line-clamp-1">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Badges & Meta */}
              <div className="flex items-center gap-3 pl-4 sm:pl-0 shrink-0">
                {task.estimateHours && (
                  <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    <Timer className="h-3 w-3 text-slate-500" />
                    <span>{task.estimateHours}h</span>
                  </span>
                )}

                <Badge variant={getPriorityVariant(task.priority)} size="sm">
                  {task.priority}
                </Badge>

                {/* Inline Status Select (allows quick status move directly from table) */}
                <div onClick={(e) => e.stopPropagation()}>
                  <select
                    value={task.status}
                    onChange={(e) => {
                      if (onMoveTaskStatus) {
                        onMoveTaskStatus(task.id, e.target.value as TaskStatus)
                      }
                    }}
                    className="appearance-none rounded-md bg-slate-950 border border-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
                  >
                    <option value="Todo">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">In Review</option>
                    <option value="Done">Completed</option>
                  </select>
                </div>

                {task.dueDate && (
                  <span className="text-xs text-slate-400 flex items-center gap-1 min-w-[70px]">
                    <Clock className="h-3 w-3 text-slate-500" />
                    <span>{task.dueDate}</span>
                  </span>
                )}

                {task.commentCount > 0 && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 text-slate-500" />
                    <span>{task.commentCount}</span>
                  </span>
                )}

                {task.assignee ? (
                  <div title={task.assignee.name}>
                    <Avatar
                      name={task.assignee.name}
                      size="sm"
                      className="h-6 w-6 text-[10px]"
                    />
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">Unassigned</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
