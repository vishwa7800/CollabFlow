import { apiClient } from './client'
import {
  Project,
  ProjectTask,
  ProjectActivityItem,
  ProjectMember,
  TaskComment,
  ProjectStatus,
  ProjectPriority,
  TaskStatus,
  TaskPriority,
  CreateProjectInput,
  CreateTaskInput,
  UpdateTaskInput,
} from '@/features/projects/types'

// Helpers to map between DB Enums and Frontend UI formats
export function toBackendStatus(status: ProjectStatus): string {
  switch (status) {
    case 'In Progress': return 'IN_PROGRESS'
    case 'Completed': return 'COMPLETED'
    case 'On Hold': return 'ON_HOLD'
    case 'Planning':
    default: return 'PLANNING'
  }
}

export function toFrontendStatus(status: string): ProjectStatus {
  switch (status) {
    case 'IN_PROGRESS': return 'In Progress'
    case 'COMPLETED': return 'Completed'
    case 'ON_HOLD': return 'On Hold'
    case 'PLANNING':
    default: return 'Planning'
  }
}

export function toBackendPriority(priority: ProjectPriority | TaskPriority): string {
  return priority.toUpperCase()
}

export function toFrontendPriority(priority: string): ProjectPriority {
  switch (priority?.toUpperCase()) {
    case 'HIGH': return 'High'
    case 'LOW': return 'Low'
    case 'MEDIUM':
    default: return 'Medium'
  }
}

export function toBackendTaskStatus(status: TaskStatus): string {
  switch (status) {
    case 'In Progress': return 'IN_PROGRESS'
    case 'Review': return 'REVIEW'
    case 'Done': return 'DONE'
    case 'Todo':
    default: return 'TODO'
  }
}

export function toFrontendTaskStatus(status: string): TaskStatus {
  switch (status?.toUpperCase()) {
    case 'IN_PROGRESS': return 'In Progress'
    case 'REVIEW': return 'Review'
    case 'DONE': return 'Done'
    case 'TODO':
    default: return 'Todo'
  }
}

export function toFrontendEvidenceStatus(status?: string) {
  switch (status) {
    case 'IN_PROGRESS': return 'In Progress'
    case 'EVIDENCE_SUBMITTED': return 'Evidence Submitted'
    case 'VERIFIED': return 'Verified'
    case 'COMPLETED': return 'Completed'
    case 'BLOCKED': return 'Blocked'
    case 'NOT_STARTED':
    default: return 'Not Started'
  }
}

export function toBackendEvidenceStatus(status?: string) {
  switch (status) {
    case 'In Progress': return 'IN_PROGRESS'
    case 'Evidence Submitted': return 'EVIDENCE_SUBMITTED'
    case 'Verified': return 'VERIFIED'
    case 'Completed': return 'COMPLETED'
    case 'Blocked': return 'BLOCKED'
    case 'Not Started':
    default: return 'NOT_STARTED'
  }
}

// Convert Backend Project to Frontend Project model
export function mapBackendProjectToFrontend(raw: any): Project {
  const totalTasks = raw._count?.tasks ?? raw.tasks?.length ?? 0
  const completedTasks = raw.tasks?.filter((t: any) => t.status === 'DONE').length ?? 0
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (raw.progress ?? 0)

  const owner: ProjectMember = {
    id: raw.owner?.id || 'unknown',
    name: raw.owner?.name || 'Workspace Owner',
    email: raw.owner?.email || '',
    avatar: raw.owner?.avatar || undefined,
    role: 'Owner',
  }

  const members: ProjectMember[] = (raw.members || []).map((m: any) => ({
    id: m.user?.id || m.userId || m.id,
    name: m.user?.name || m.name || 'Member',
    email: m.user?.email || m.email || '',
    avatar: m.user?.avatar || undefined,
    role: (m.role === 'OWNER' ? 'Owner' : m.role === 'MANAGER' ? 'Manager' : 'Member') as any,
  }))

  const tags: string[] = (raw.tags || []).map((t: any) => t.tag?.name || t.name || String(t))

  const dueDateStr = raw.dueDate ? new Date(raw.dueDate).toISOString().split('T')[0] : 'No due date'
  const dueDateTimestamp = raw.dueDate ? new Date(raw.dueDate).getTime() : 0

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description || '',
    status: toFrontendStatus(raw.status),
    priority: toFrontendPriority(raw.priority),
    progress,
    completedTasks,
    totalTasks,
    startDate: raw.startDate ? new Date(raw.startDate).toISOString().split('T')[0] : undefined,
    dueDate: dueDateStr,
    dueDateTimestamp,
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt).toLocaleDateString() : 'Recently',
    updatedAtTimestamp: raw.updatedAt ? new Date(raw.updatedAt).getTime() : Date.now(),
    createdAt: raw.createdAt ? new Date(raw.createdAt).toLocaleDateString() : 'Recently',
    owner,
    members: members.length > 0 ? members : [owner],
    tags,
  }
}

// Convert Backend Task to Frontend Task model
export function mapBackendTaskToFrontend(raw: any): ProjectTask {
  const assignee: ProjectMember | undefined = raw.assignee
    ? {
        id: raw.assignee.id,
        name: raw.assignee.name,
        email: raw.assignee.email,
        avatar: raw.assignee.avatar || undefined,
      }
    : undefined

  const comments: TaskComment[] = (raw.comments || []).map((c: any) => ({
    id: c.id,
    taskId: c.taskId,
    user: {
      id: c.author?.id || c.authorId,
      name: c.author?.name || 'Member',
      email: c.author?.email || '',
      avatar: c.author?.avatar || undefined,
    },
    content: c.content,
    createdAt: c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
  }))

  const tags: string[] = (raw.tags || []).map((t: any) => t.tag?.name || t.name || String(t))

  return {
    id: raw.id,
    projectId: raw.projectId,
    title: raw.title,
    description: raw.description || undefined,
    status: toFrontendTaskStatus(raw.status),
    priority: toFrontendPriority(raw.priority),
    assignee,
    dueDate: raw.dueDate ? new Date(raw.dueDate).toISOString().split('T')[0] : undefined,
    dueDateTimestamp: raw.dueDate ? new Date(raw.dueDate).getTime() : undefined,
    estimateHours: raw.estimateHours || undefined,
    tags: tags.length > 0 ? tags : undefined,
    commentCount: raw._count?.comments ?? comments.length,
    comments,
    evidenceStatus: toFrontendEvidenceStatus(raw.evidenceStatus),
    actualHours: raw.actualHours || undefined,
    completedAt: raw.completedAt ? new Date(raw.completedAt).toLocaleDateString() : undefined,
    lastActivityAt: raw.lastActivityAt ? new Date(raw.lastActivityAt).toLocaleDateString() : undefined,
    createdAt: raw.createdAt ? new Date(raw.createdAt).toLocaleDateString() : 'Recently',
  }
}

// Convert Backend Activity to Frontend ActivityItem
export function mapBackendActivityToFrontend(raw: any): ProjectActivityItem {
  let type: ProjectActivityItem['type'] = 'project_updated'
  if (raw.type === 'TASK_CREATED') type = 'task_created'
  else if (raw.type === 'TASK_COMPLETED') type = 'task_completed'
  else if (raw.type === 'STATUS_CHANGED') type = 'status_changed'
  else if (raw.type === 'TASK_ASSIGNED') type = 'task_assigned'
  else if (raw.type === 'TASK_DELETED') type = 'task_deleted'
  else if (raw.type === 'COMMENT_ADDED') type = 'comment_added'
  else if (raw.type === 'MEMBER_ADDED') type = 'member_added'
  else if (raw.type === 'TASK_STARTED') type = 'task_started'
  else if (raw.type === 'WORK_UPDATE_ADDED') type = 'work_update_added'
  else if (raw.type === 'BLOCKER_REPORTED') type = 'blocker_reported'
  else if (raw.type === 'EVIDENCE_SUBMITTED') type = 'evidence_submitted'
  else if (raw.type === 'EVIDENCE_VERIFIED') type = 'evidence_verified'
  else if (raw.type === 'EVIDENCE_REJECTED') type = 'evidence_rejected'
  else if (raw.type === 'REVIEW_REQUESTED') type = 'review_requested'
  else if (raw.type === 'GITHUB_PR_LINKED') type = 'github_pr_linked'
  else if (raw.type === 'GITHUB_COMMIT_LINKED') type = 'github_commit_linked'

  return {
    id: raw.id,
    projectId: raw.projectId,
    user: {
      id: raw.user?.id || raw.userId,
      name: raw.user?.name || 'Team Member',
      email: raw.user?.email || '',
      avatar: raw.user?.avatar || undefined,
    },
    action: raw.action,
    target: raw.target,
    timestamp: raw.createdAt ? new Date(raw.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
    type,
  }
}

export const projectsApi = {
  // 1. Projects
  async getProjects(params?: { search?: string; status?: string; priority?: string; sortBy?: string }) {
    const res = await apiClient.get<{ data: { projects: any[] } }>('/projects', { params })
    return (res.data?.projects || []).map(mapBackendProjectToFrontend)
  },

  async getProject(id: string) {
    const res = await apiClient.get<{ data: { project: any } }>(`/projects/${id}`)
    return mapBackendProjectToFrontend(res.data.project)
  },

  async createProject(input: CreateProjectInput) {
    const body = {
      name: input.name,
      description: input.description,
      status: toBackendStatus(input.status),
      priority: toBackendPriority(input.priority),
      startDate: input.startDate ? new Date(input.startDate).toISOString() : undefined,
      dueDate: input.dueDate ? new Date(input.dueDate).toISOString() : undefined,
    }
    const res = await apiClient.post<{ data: { project: any } }>('/projects', body)
    return mapBackendProjectToFrontend(res.data.project)
  },

  async updateProject(id: string, input: Partial<CreateProjectInput>) {
    const body = {
      ...(input.name && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.status && { status: toBackendStatus(input.status) }),
      ...(input.priority && { priority: toBackendPriority(input.priority) }),
      ...(input.startDate && { startDate: new Date(input.startDate).toISOString() }),
      ...(input.dueDate && { dueDate: new Date(input.dueDate).toISOString() }),
    }
    const res = await apiClient.patch<{ data: { project: any } }>(`/projects/${id}`, body)
    return mapBackendProjectToFrontend(res.data.project)
  },

  async deleteProject(id: string) {
    return apiClient.delete(`/projects/${id}`)
  },

  // 2. Project Members
  async getMembers(projectId: string) {
    const res = await apiClient.get<{ data: { members: any[] } }>(`/projects/${projectId}/members`)
    return (res.data?.members || []).map((m: any) => ({
      id: m.user?.id || m.userId,
      name: m.user?.name || 'Member',
      email: m.user?.email || '',
      avatar: m.user?.avatar || undefined,
      role: m.role,
    }))
  },

  async addMember(projectId: string, userId: string, role = 'MEMBER') {
    return apiClient.post(`/projects/${projectId}/members`, { userId, role })
  },

  async removeMember(projectId: string, userId: string) {
    return apiClient.delete(`/projects/${projectId}/members/${userId}`)
  },

  // 3. Project Activities
  async getActivities(projectId: string) {
    const res = await apiClient.get<{ data: { activities: any[] } }>(`/projects/${projectId}/activities`)
    return (res.data?.activities || []).map(mapBackendActivityToFrontend)
  },

  // 4. Tasks
  async getTasks(projectId: string, params?: { search?: string; status?: string; priority?: string }) {
    const res = await apiClient.get<{ data: { tasks: any[] } }>(`/projects/${projectId}/tasks`, { params })
    return (res.data?.tasks || []).map(mapBackendTaskToFrontend)
  },

  async getTask(taskId: string) {
    const res = await apiClient.get<{ data: { task: any } }>(`/tasks/${taskId}`)
    return mapBackendTaskToFrontend(res.data.task)
  },

  async createTask(projectId: string, input: CreateTaskInput) {
    const body = {
      title: input.title,
      description: input.description,
      status: toBackendTaskStatus(input.status),
      priority: toBackendPriority(input.priority),
      assigneeId: input.assigneeId || undefined,
      dueDate: input.dueDate ? new Date(input.dueDate).toISOString() : undefined,
      estimateHours: input.estimateHours,
      projectId,
    }
    const res = await apiClient.post<{ data: { task: any } }>(`/projects/${projectId}/tasks`, body)
    return mapBackendTaskToFrontend(res.data.task)
  },

  async updateTask(taskId: string, input: UpdateTaskInput) {
    const body = {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.status !== undefined && { status: toBackendTaskStatus(input.status) }),
      ...(input.priority !== undefined && { priority: toBackendPriority(input.priority) }),
      ...(input.assigneeId !== undefined && { assigneeId: input.assigneeId }),
      ...(input.dueDate !== undefined && { dueDate: input.dueDate ? new Date(input.dueDate).toISOString() : null }),
      ...(input.estimateHours !== undefined && { estimateHours: input.estimateHours }),
      ...(input.actualHours !== undefined && { actualHours: input.actualHours }),
      ...(input.evidenceStatus !== undefined && { evidenceStatus: toBackendEvidenceStatus(input.evidenceStatus) }),
    }
    const res = await apiClient.patch<{ data: { task: any } }>(`/tasks/${taskId}`, body)
    return mapBackendTaskToFrontend(res.data.task)
  },

  async deleteTask(taskId: string) {
    return apiClient.delete(`/tasks/${taskId}`)
  },

  // 5. Comments
  async getComments(taskId: string) {
    const res = await apiClient.get<{ data: { comments: any[] } }>(`/tasks/${taskId}/comments`)
    return res.data?.comments || []
  },

  async addComment(taskId: string, content: string) {
    const res = await apiClient.post<{ data: { comment: any } }>(`/tasks/${taskId}/comments`, { content })
    return res.data?.comment
  },

  async deleteComment(commentId: string) {
    return apiClient.delete(`/comments/${commentId}`)
  },
}
