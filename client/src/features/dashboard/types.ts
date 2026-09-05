export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold'
export type TaskPriority = 'High' | 'Medium' | 'Low'
export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Done'

export interface DashboardMetricsData {
  activeProjects: {
    value: number
    label: string
    change?: string
  }
  openTasks: {
    value: number
    label: string
    change?: string
  }
  dueThisWeek: {
    value: number
    label: string
    change?: string
  }
  completedThisMonth: {
    value: number
    label: string
    change?: string
  }
}

export interface ProjectSummary {
  id: string
  name: string
  description: string
  status: ProjectStatus
  progress: number
  completedTasks: number
  totalTasks: number
  dueDate: string
  members: Array<{
    name: string
    avatar?: string
    role?: string
  }>
}

export interface TaskSummary {
  id: string
  title: string
  projectName: string
  projectId: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string
  dueUrgent?: boolean
}

export interface ActivityItem {
  id: string
  user: {
    name: string
    avatar?: string
  }
  action: string
  target: string
  timestamp: string
  type: 'assignment' | 'comment' | 'status_change' | 'project_created'
}

export interface UpcomingDeadlineItem {
  id: string
  title: string
  projectName: string
  dueDate: string
  formattedDate: string
  priority: TaskPriority
  daysRemaining: number
}

export interface DashboardData {
  metrics: DashboardMetricsData
  projects: ProjectSummary[]
  myTasks: TaskSummary[]
  activities: ActivityItem[]
  upcomingDeadlines: UpcomingDeadlineItem[]
}
