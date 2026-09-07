import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import { projectsApi } from '@/lib/api'
import { MOCK_PROJECTS, WORKSPACE_MEMBERS } from '../data/mockProjects'
import { getProjectTasks, getProjectActivities } from '../data/mockProjectDetails'
import { calculateProjectMetrics } from '../utils/taskMetrics'
import { useToast } from '@/components/ui'

export function useProjectWorkspace(projectId: string | undefined) {
  const currentProjectId = projectId || 'proj-1'
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Base fallback project
  const fallbackProject = React.useMemo(() => {
    return (
      MOCK_PROJECTS.find((p) => p.id === currentProjectId) || {
        ...MOCK_PROJECTS[0],
        id: currentProjectId,
        name: `Project Workspace (${currentProjectId})`,
      }
    )
  }, [currentProjectId])

  // 1. Fetch Project Data from API
  const projectQuery = useQuery({
    queryKey: ['project', currentProjectId],
    queryFn: () => projectsApi.getProject(currentProjectId),
    retry: 1,
  })

  // 2. Fetch Tasks Data from API
  const tasksQuery = useQuery({
    queryKey: ['project-tasks', currentProjectId],
    queryFn: () => projectsApi.getTasks(currentProjectId),
    retry: 1,
  })

  // 3. Fetch Activities Data from API
  const activitiesQuery = useQuery({
    queryKey: ['project-activities', currentProjectId],
    queryFn: () => projectsApi.getActivities(currentProjectId),
    retry: 1,
  })

  // Local synced state for immediate optimistic UI reactivity
  const [project, setProject] = React.useState<Project>(fallbackProject)
  const [tasks, setTasks] = React.useState<ProjectTask[]>(() =>
    getProjectTasks(currentProjectId)
  )
  const [activities, setActivities] = React.useState<ProjectActivityItem[]>(() =>
    getProjectActivities(currentProjectId)
  )

  // Synchronize local state with API query responses
  React.useEffect(() => {
    if (projectQuery.data) {
      setProject(projectQuery.data)
    }
  }, [projectQuery.data])

  React.useEffect(() => {
    if (tasksQuery.data && tasksQuery.data.length > 0) {
      setTasks(tasksQuery.data)
    }
  }, [tasksQuery.data])

  React.useEffect(() => {
    if (activitiesQuery.data && activitiesQuery.data.length > 0) {
      setActivities(activitiesQuery.data)
    }
  }, [activitiesQuery.data])

  const currentUser: ProjectMember = project.members[0] || WORKSPACE_MEMBERS[0]

  // Centralized real-time metrics
  const metrics = React.useMemo(() => calculateProjectMetrics(tasks), [tasks])

  // 1. Create Task Mutation
  const createTaskMutation = useMutation({
    mutationFn: (input: CreateTaskInput) => projectsApi.createTask(currentProjectId, input),
    onSuccess: (createdTask) => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', currentProjectId] })
      queryClient.invalidateQueries({ queryKey: ['project-activities', currentProjectId] })
      toast({
        title: 'Task Created',
        description: `"${createdTask.title}" added to project.`,
        variant: 'success',
      })
    },
    onError: (err: any) => {
      toast({
        title: 'Task Creation Failed',
        description: err.message || 'Unable to create task on the server.',
        variant: 'destructive',
      })
    },
  })

  const createTask = React.useCallback(
    (input: CreateTaskInput): ProjectTask => {
      const selectedAssignee = input.assigneeId
        ? project.members.find((m) => m.id === input.assigneeId) ||
          WORKSPACE_MEMBERS.find((m) => m.id === input.assigneeId)
        : undefined

      const optimisticTask: ProjectTask = {
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

      setTasks((prev) => [optimisticTask, ...prev])

      const activity: ProjectActivityItem = {
        id: `act-${Date.now()}`,
        projectId: project.id,
        user: currentUser,
        action: 'created new task',
        target: optimisticTask.title,
        timestamp: 'Just now',
        type: 'task_created',
      }
      setActivities((prev) => [activity, ...prev])

      // Fire real API mutation in background
      createTaskMutation.mutate(input)

      return optimisticTask
    },
    [project.id, project.members, currentUser, createTaskMutation]
  )

  // 2. Update Task Mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, input }: { taskId: string; input: UpdateTaskInput }) =>
      projectsApi.updateTask(taskId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', currentProjectId] })
      queryClient.invalidateQueries({ queryKey: ['project-activities', currentProjectId] })
    },
    onError: (err: any) => {
      toast({
        title: 'Task Update Failed',
        description: err.message || 'Failed to sync update with the server.',
        variant: 'destructive',
      })
    },
  })

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
        updateTaskMutation.mutate({ taskId, input })
      }

      return updatedTaskResult
    },
    [project.members, updateTaskMutation]
  )

  // 3. Move Task Status (Optimistic Kanban with Rollback on Error)
  const moveTaskStatus = React.useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      const previousTasks = [...tasks]
      const targetTask = tasks.find((t) => t.id === taskId)
      if (!targetTask || targetTask.status === newStatus) return

      // Optimistic UI update
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

      // Execute server update
      projectsApi
        .updateTask(taskId, { status: newStatus })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['project-tasks', currentProjectId] })
          queryClient.invalidateQueries({ queryKey: ['project-activities', currentProjectId] })
        })
        .catch((err) => {
          // Rollback on failure
          setTasks(previousTasks)
          toast({
            title: 'Failed to update task status',
            description: err.message || 'Status could not be updated. Changes reverted.',
            variant: 'destructive',
          })
        })
    },
    [tasks, project.id, currentUser, queryClient, currentProjectId, toast]
  )

  // 4. Delete Task Mutation
  const deleteTask = React.useCallback(
    (taskId: string) => {
      const previousTasks = [...tasks]
      const targetTask = tasks.find((t) => t.id === taskId)
      if (!targetTask) return

      // Optimistic remove
      setTasks((prev) => prev.filter((t) => t.id !== taskId))

      projectsApi
        .deleteTask(taskId)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['project-tasks', currentProjectId] })
          queryClient.invalidateQueries({ queryKey: ['project-activities', currentProjectId] })
          toast({
            title: 'Task Deleted',
            description: `"${targetTask.title}" has been deleted.`,
            variant: 'success',
          })
        })
        .catch((err) => {
          // Rollback
          setTasks(previousTasks)
          toast({
            title: 'Deletion Failed',
            description: err.message || 'Could not delete task from server.',
            variant: 'destructive',
          })
        })
    },
    [tasks, queryClient, currentProjectId, toast]
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

      projectsApi
        .addComment(taskId, content)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['project-tasks', currentProjectId] })
          queryClient.invalidateQueries({ queryKey: ['project-activities', currentProjectId] })
        })
        .catch((err) => {
          toast({
            title: 'Comment Failed',
            description: err.message || 'Could not post comment to server.',
            variant: 'destructive',
          })
        })

      return newComment
    },
    [currentUser, currentProjectId, queryClient, toast]
  )

  // 6. Update Project Members
  const updateMembers = React.useCallback(
    (newMembers: ProjectMember[]) => {
      setProject((prev) => ({ ...prev, members: newMembers }))
    },
    []
  )

  // 7. Edit Project
  const editProject = React.useCallback(
    (updated: Partial<Project>) => {
      setProject((prev) => ({ ...prev, ...updated }))
      projectsApi.updateProject(currentProjectId, updated as any).catch((err) => {
        toast({
          title: 'Project Update Failed',
          description: err.message || 'Failed to update project on server.',
          variant: 'destructive',
        })
      })
    },
    [currentProjectId, toast]
  )

  return {
    project,
    tasks,
    activities,
    metrics,
    isLoading: projectQuery.isLoading || tasksQuery.isLoading,
    isError: projectQuery.isError,
    createTask,
    updateTask,
    moveTaskStatus,
    deleteTask,
    addComment,
    updateMembers,
    editProject,
  }
}
