import * as React from 'react'
import {
  Badge,
  Avatar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui'
import { Plus, MessageSquare, Clock, ArrowRightLeft, Check, Timer } from 'lucide-react'
import { ProjectTask, TaskStatus, TaskPriority } from '../types'

export interface ProjectTaskBoardProps {
  tasks: ProjectTask[]
  onSelectTask: (task: ProjectTask) => void
  onAddTaskWithStatus: (status: TaskStatus) => void
  onMoveTaskStatus: (taskId: string, newStatus: TaskStatus) => void
}

export function ProjectTaskBoard({
  tasks,
  onSelectTask,
  onAddTaskWithStatus,
  onMoveTaskStatus,
}: ProjectTaskBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = React.useState<TaskStatus | null>(null)

  const columns: { status: TaskStatus; label: string; headerColor: string; borderColor: string }[] = [
    { status: 'Todo', label: 'To Do', headerColor: 'text-slate-300', borderColor: 'border-slate-800/90' },
    { status: 'In Progress', label: 'In Progress', headerColor: 'text-blue-400', borderColor: 'border-blue-900/50' },
    { status: 'Review', label: 'In Review', headerColor: 'text-amber-400', borderColor: 'border-amber-900/50' },
    { status: 'Done', label: 'Completed', headerColor: 'text-emerald-400', borderColor: 'border-emerald-900/50' },
  ]

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

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId)
    e.dataTransfer.effectAllowed = 'move'
    setDraggedTaskId(taskId)
  }

  const handleDragEnd = () => {
    setDraggedTaskId(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent, colStatus: TaskStatus) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverColumn !== colStatus) {
      setDragOverColumn(colStatus)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only reset if leaving current column container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null)
    }
  }

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId
    if (taskId) {
      onMoveTaskStatus(taskId, targetStatus)
    }
    setDraggedTaskId(null)
    setDragOverColumn(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start overflow-x-auto pb-6 text-left">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status)
        const isColumnActiveTarget = dragOverColumn === col.status

        return (
          <div
            key={col.status}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.status)}
            className={`flex flex-col rounded-xl border p-3.5 space-y-3 min-w-[260px] transition-all duration-150 ${
              isColumnActiveTarget
                ? 'bg-blue-950/20 border-blue-500/80 shadow-lg ring-1 ring-blue-500/40'
                : 'bg-slate-950/70 border-slate-800/90 shadow-sm'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${col.headerColor}`}>
                  {col.label}
                </span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                  {columnTasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onAddTaskWithStatus(col.status)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label={`Add task to ${col.label}`}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Tasks Stack */}
            <div className="space-y-2.5 min-h-[160px]">
              {columnTasks.length === 0 ? (
                <div
                  className={`flex h-32 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center transition-colors ${
                    isColumnActiveTarget
                      ? 'border-blue-500/60 bg-blue-950/20 text-blue-300'
                      : 'border-slate-800/80 text-slate-500'
                  }`}
                >
                  <p className="text-xs">
                    {isColumnActiveTarget ? 'Drop task here' : `No tasks in ${col.label}`}
                  </p>
                </div>
              ) : (
                columnTasks.map((task) => {
                  const isBeingDragged = draggedTaskId === task.id

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onSelectTask(task)}
                      className={`group relative flex flex-col justify-between gap-2.5 rounded-lg border border-slate-800/90 bg-slate-900/90 p-3.5 shadow-sm hover:border-slate-700 hover:bg-slate-900 transition-all cursor-grab active:cursor-grabbing ${
                        isBeingDragged ? 'opacity-40 scale-95 border-dashed border-blue-500' : ''
                      }`}
                    >
                      {/* Top: Priority, Estimate, and Move Menu */}
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <Badge variant={getPriorityVariant(task.priority)} size="sm">
                            {task.priority}
                          </Badge>
                          {task.estimateHours && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                              <Timer className="h-3 w-3 text-slate-500" />
                              <span>{task.estimateHours}h</span>
                            </span>
                          )}
                        </div>

                        {/* Quick Move Status Action Menu */}
                        <div onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              className="flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
                              aria-label="Move task status"
                            >
                              <ArrowRightLeft className="h-3 w-3" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="right" className="w-36">
                              <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                Move to...
                              </div>
                              {columns.map((targetCol) => (
                                <DropdownMenuItem
                                  key={targetCol.status}
                                  onClick={() => onMoveTaskStatus(task.id, targetCol.status)}
                                  className="flex items-center justify-between text-xs"
                                >
                                  <span>{targetCol.label}</span>
                                  {task.status === targetCol.status && (
                                    <Check className="h-3 w-3 text-blue-400" />
                                  )}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition-colors leading-snug line-clamp-2">
                        {task.title}
                      </h4>

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="text-[9px] font-medium text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer: Due date, comment count, and assignee */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/70 text-[11px] text-slate-400">
                        <div className="flex items-center gap-2.5">
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-slate-400">
                              <Clock className="h-3 w-3" />
                              <span>{task.dueDate}</span>
                            </div>
                          )}
                          {task.commentCount > 0 && (
                            <div className="flex items-center gap-1 text-slate-400">
                              <MessageSquare className="h-3 w-3" />
                              <span>{task.commentCount}</span>
                            </div>
                          )}
                        </div>

                        {task.assignee ? (
                          <div title={`Assigned to ${task.assignee.name}`}>
                            <Avatar
                              name={task.assignee.name}
                              size="sm"
                              className="h-5 w-5 text-[10px]"
                            />
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-600 italic">Unassigned</span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
