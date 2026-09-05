import { ProjectTask, TaskStatus } from '../types'

export interface ProjectTaskMetrics {
  totalTasks: number
  completedTasks: number
  openTasks: number
  inProgressTasks: number
  todoTasks: number
  reviewTasks: number
  overdueTasks: number
  progressPercent: number
  statusBreakdown: Record<TaskStatus, number>
}

export function calculateProjectMetrics(tasks: ProjectTask[]): ProjectTaskMetrics {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'Done').length
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length
  const todoTasks = tasks.filter((t) => t.status === 'Todo').length
  const reviewTasks = tasks.filter((t) => t.status === 'Review').length
  const openTasks = totalTasks - completedTasks

  const now = Date.now()
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'Done' && t.dueDateTimestamp && t.dueDateTimestamp < now
  ).length

  const progressPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  return {
    totalTasks,
    completedTasks,
    openTasks,
    inProgressTasks,
    todoTasks,
    reviewTasks,
    overdueTasks,
    progressPercent,
    statusBreakdown: {
      Todo: todoTasks,
      'In Progress': inProgressTasks,
      Review: reviewTasks,
      Done: completedTasks,
    },
  }
}
