import * as React from 'react'
import {
  Project,
  ProjectTask,
  ProjectActivityItem,
  TaskStatus,
  ProjectMember,
  CreateTaskInput,
  UpdateTaskInput,
  TaskComment,
} from '../types'
import { MOCK_PROJECTS, WORKSPACE_MEMBERS } from '../data/mockProjects'
import { getProjectTasks, getProjectActivities } from '../data/mockProjectDetails'
import { calculateProjectMetrics } from '../utils/taskMetrics'

export function useProjectWorkspace(projectId: string | undefined) {
  const currentProjectId = projectId || 'proj-1'

  // Get base project metadata
  const baseProject = React.useMemo(() => {
    return (
      MOCK_PROJECTS.find((p) => p.id === currentProjectId) || {
        ...MOCK_PROJECTS[0],
        id: currentProjectId,
        name: `Project Workspace (${currentProjectId})`,
      }
    )
  }, [currentProjectId])

  const [project, setProject] = React.useState<Project>(baseProject)
  const [tasks, setTasks] = React.useState<ProjectTask[]>(() =>
    getProjectTasks(currentProjectId)
  )
  const [activities, setActivities] = React.useState<ProjectActivityItem[]>(() =>
    getProjectActivities(currentProjectId)
  )

  const currentUser: ProjectMember = project.members[0] || WORKSPACE_MEMBERS[0]

  // Centralized real-time metrics
  const metrics = React.useMemo(() => calculateProjectMetrics(tasks), [tasks])

  // 1. Create Task
  const createTask = React.useCallback(
    (input: CreateTaskInput): ProjectTask => {
      const selectedAssignee = input.assigneeId
        ? project.members.find((m) => m.id === input.assigneeId) ||
          WORKSPACE_MEMBERS.find((m) => m.id === input.assigneeId)
        : undefined

      const newTask: ProjectTask = {
        id: `task-${Date.now()}`,
        projectId: project.id,
        title: input.title.trim(),
        description: input.description?.trim() || undefined,
        status: input.status,
        priority: input.priority,
        assignee: selectedAssignee,
        dueDate: input.dueDate || undefined,
        dueDateTimestamp: input.dueDate ? new Date(input.dueDate).getTime() : undefined,
        estimateHours: input.estimateHours,
        tags: input.tags && input.tags.length > 0 ? input.tags : undefined,
        commentCount: 0,
        comments: [],
        createdAt: 'Just now',
      }

      setTasks((prev) => [newTask, ...prev])

      const activity: ProjectActivityItem = {
        id: `act-${Date.now()}`,
        projectId: project.id,
        user: currentUser,
        action: 'created new task',
        target: newTask.title,
        timestamp: 'Just now',
        type: 'task_created',
      }
      setActivities((prev) => [activity, ...prev])

      return newTask
    },
    [project.id, project.members, currentUser]
  )

  // 2. Update Task
  const updateTask = React.useCallback(
    (taskId: string, input: UpdateTaskInput): ProjectTask | null => {
      let updatedTaskResult: ProjectTask | null = null

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            const selectedAssignee =
              input.assigneeId !== undefined
                ? input.assigneeId
                  ? project.members.find((m) => m.id === input.assigneeId) ||
                    WORKSPACE_MEMBERS.find((m) => m.id === input.assigneeId)
                  : undefined
                : t.assignee

            const updated: ProjectTask = {
              ...t,
              title: input.title !== undefined ? input.title.trim() : t.title,
              description:
                input.description !== undefined
                  ? input.description.trim() || undefined
                  : t.description,
              status: input.status !== undefined ? input.status : t.status,
              priority: input.priority !== undefined ? input.priority : t.priority,
              assignee: selectedAssignee,
              dueDate: input.dueDate !== undefined ? input.dueDate || undefined : t.dueDate,
              dueDateTimestamp:
                input.dueDate !== undefined
                  ? input.dueDate
                    ? new Date(input.dueDate).getTime()
                    : undefined
                  : t.dueDateTimestamp,
              estimateHours:
                input.estimateHours !== undefined ? input.estimateHours : t.estimateHours,
              tags: input.tags !== undefined ? input.tags : t.tags,
            }

            updatedTaskResult = updated
            return updated
          }
          return t
        })
      )

      if (updatedTaskResult) {
        const taskObj = updatedTaskResult as ProjectTask
        // Log activity based on what changed
        let action = 'updated task'
        let actType: ProjectActivityItem['type'] = 'task_updated'

        if (input.status && input.status !== (tasks.find((t) => t.id === taskId)?.status)) {
          if (input.status === 'Done') {
            action = 'completed task'
            actType = 'task_completed'
          } else {
            action = `moved task to ${input.status}`
            actType = 'status_changed'
          }
        } else if (input.priority && input.priority !== (tasks.find((t) => t.id === taskId)?.priority)) {
          action = `changed priority to ${input.priority} on`
          actType = 'priority_changed'
        } else if (input.assigneeId !== undefined) {
          const assigneeName = taskObj.assignee?.name || 'Unassigned'
          action = `assigned ${assigneeName} to`
          actType = 'task_assigned'
        }

        const activity: ProjectActivityItem = {
          id: `act-${Date.now()}`,
          projectId: project.id,
          user: currentUser,
          action,
          target: taskObj.title,
          timestamp: 'Just now',
          type: actType,
        }
        setActivities((prev) => [activity, ...prev])
      }

      return updatedTaskResult
    },
    [project.id, project.members, tasks, currentUser]
  )

  // 3. Move Task Status
  const moveTaskStatus = React.useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      const targetTask = tasks.find((t) => t.id === taskId)
      if (!targetTask || targetTask.status === newStatus) return

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      )

      const isCompleted = newStatus === 'Done'
      const activity: ProjectActivityItem = {
        id: `act-${Date.now()}`,
        projectId: project.id,
        user: currentUser,
        action: isCompleted ? 'completed task' : `moved task to ${newStatus}`,
        target: targetTask.title,
        timestamp: 'Just now',
        type: isCompleted ? 'task_completed' : 'status_changed',
      }
      setActivities((prev) => [activity, ...prev])
    },
    [tasks, project.id, currentUser]
  )

  // 4. Delete Task
  const deleteTask = React.useCallback(
    (taskId: string) => {
      const targetTask = tasks.find((t) => t.id === taskId)
      if (!targetTask) return

      setTasks((prev) => prev.filter((t) => t.id !== taskId))

      const activity: ProjectActivityItem = {
        id: `act-${Date.now()}`,
        projectId: project.id,
        user: currentUser,
        action: 'deleted task',
        target: targetTask.title,
        timestamp: 'Just now',
        type: 'task_deleted',
      }
      setActivities((prev) => [activity, ...prev])
    },
    [tasks, project.id, currentUser]
  )

  // 5. Add Comment
  const addComment = React.useCallback(
    (taskId: string, content: string): TaskComment => {
      const newComment: TaskComment = {
        id: `comment-${Date.now()}`,
        taskId,
        user: currentUser,
        content: content.trim(),
        createdAt: 'Just now',
      }

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            const currentComments = t.comments || []
            return {
              ...t,
              commentCount: currentComments.length + 1,
              comments: [...currentComments, newComment],
            }
          }
          return t
        })
      )

      const targetTask = tasks.find((t) => t.id === taskId)
      const activity: ProjectActivityItem = {
        id: `act-${Date.now()}`,
        projectId: project.id,
        user: currentUser,
        action: 'commented on',
        target: targetTask?.title || 'task',
        timestamp: 'Just now',
        type: 'comment_added',
      }
      setActivities((prev) => [activity, ...prev])

      return newComment
    },
    [currentUser, project.id, tasks]
  )

  // 6. Update Project Members
  const updateMembers = React.useCallback(
    (newMembers: ProjectMember[]) => {
      setProject((prev) => ({ ...prev, members: newMembers }))

      const activity: ProjectActivityItem = {
        id: `act-${Date.now()}`,
        projectId: project.id,
        user: currentUser,
        action: 'updated project team to',
        target: `${newMembers.length} members`,
        timestamp: 'Just now',
        type: 'member_added',
      }
      setActivities((prev) => [activity, ...prev])
    },
    [project.id, currentUser]
  )

  // 7. Edit Project
  const editProject = React.useCallback(
    (updated: Partial<Project>) => {
      setProject((prev) => ({ ...prev, ...updated }))

      const activity: ProjectActivityItem = {
        id: `act-${Date.now()}`,
        projectId: project.id,
        user: currentUser,
        action: 'updated project configuration',
        target: updated.name || project.name,
        timestamp: 'Just now',
        type: 'project_updated',
      }
      setActivities((prev) => [activity, ...prev])
    },
    [project.id, project.name, currentUser]
  )

  return {
    project,
    tasks,
    activities,
    metrics,
    createTask,
    updateTask,
    moveTaskStatus,
    deleteTask,
    addComment,
    updateMembers,
    editProject,
  }
}
