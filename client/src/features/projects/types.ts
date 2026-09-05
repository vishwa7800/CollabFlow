export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold'
export type ProjectPriority = 'High' | 'Medium' | 'Low'
export type ProjectViewMode = 'grid' | 'list'
export type ProjectSortOption = 'updated' | 'dueDate' | 'name' | 'progress'

export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Done'
export type TaskPriority = 'High' | 'Medium' | 'Low'

export interface ProjectMember {
  id: string
  name: string
  email: string
  avatar?: string
  role?: 'Owner' | 'Manager' | 'Member' | 'Viewer'
}

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  progress: number
  completedTasks: number
  totalTasks: number
  startDate?: string
  dueDate: string
  dueDateTimestamp: number
  updatedAt: string
  updatedAtTimestamp: number
  createdAt: string
  owner: ProjectMember
  members: ProjectMember[]
  tags?: string[]
}

export interface TaskComment {
  id: string
  taskId: string
  user: ProjectMember
  content: string
  createdAt: string
}

export interface ProjectTask {
  id: string
  projectId: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: ProjectMember
  dueDate?: string
  dueDateTimestamp?: number
  estimateHours?: number
  tags?: string[]
  commentCount: number
  comments?: TaskComment[]
  createdAt: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId?: string
  dueDate?: string
  estimateHours?: number
  tags?: string[]
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: string
  dueDate?: string
  estimateHours?: number
  tags?: string[]
}

export interface ProjectActivityItem {
  id: string
  projectId: string
  user: ProjectMember
  action: string
  target: string
  timestamp: string
  type:
    | 'task_created'
    | 'task_updated'
    | 'task_assigned'
    | 'status_changed'
    | 'priority_changed'
    | 'task_completed'
    | 'task_deleted'
    | 'comment_added'
    | 'member_added'
    | 'project_updated'
}

export interface ProjectFiltersState {
  search: string
  status: 'All' | ProjectStatus
  priority: 'All' | ProjectPriority
  sortBy: ProjectSortOption
  viewMode: ProjectViewMode
}

export interface CreateProjectInput {
  name: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  startDate: string
  dueDate: string
  members: ProjectMember[]
  tags: string[]
}
