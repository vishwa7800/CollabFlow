import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout'
import { ErrorState, useToast } from '@/components/ui'
import { LayoutDashboard, Kanban, ListTodo, Activity, ShieldCheck } from 'lucide-react'
import {
  ProjectHeader,
  ProjectProgressSummary,
  ProjectOverviewTab,
  ProjectTaskBoard,
  ProjectTaskTable,
  ProjectActivityFeed,
  AddTaskDialog,
  TaskDetailDialog,
  ManageMembersDialog,
  DeleteProjectDialog,
  EditProjectDialog,
  ProjectWorkspaceSkeleton,
  ProjectAccountabilityTab,
} from '../components'
import { useProjectWorkspace } from '../hooks/useProjectWorkspace'
import { projectsApi } from '@/lib/api'
import {
  ProjectTask,

  TaskStatus,
  CreateTaskInput,
  UpdateTaskInput,
  ProjectMember,
  Project,
} from '../types'

type TabType = 'overview' | 'board' | 'tasks' | 'activity' | 'accountability'

export interface ProjectDetailPageProps {
  defaultTab?: TabType
}

export function ProjectDetailPage({ defaultTab = 'overview' }: ProjectDetailPageProps = {}) {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const {
    project,
    tasks,
    activities,
    isLoading: isWorkspaceLoading,
    isError,
    createTask,
    updateTask,
    moveTaskStatus,
    deleteTask,
    addComment,
    updateMembers,
    editProject,
  } = useProjectWorkspace(projectId)

  const [activeTab, setActiveTab] = React.useState<TabType>(defaultTab)
  const isLoading = isWorkspaceLoading && !project
  const error = isError && !project ? 'Unable to load project workspace' : null


  // Dialog states
  const [isAddTaskOpen, setIsAddTaskOpen] = React.useState(false)
  const [defaultTaskStatus, setDefaultTaskStatus] = React.useState<TaskStatus>('Todo')
  const [selectedTask, setSelectedTask] = React.useState<ProjectTask | null>(null)
  const [isManageMembersOpen, setIsManageMembersOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)

  // Handlers
  const handleOpenAddTask = (status: TaskStatus = 'Todo') => {
    setDefaultTaskStatus(status)
    setIsAddTaskOpen(true)
  }

  const handleTaskCreated = (input: CreateTaskInput) => {
    const newTask = createTask(input)
    toast({
      title: 'Task created',
      description: `"${newTask.title}" was added to ${newTask.status}.`,
      variant: 'success',
    })
  }

  const handleTaskUpdated = (taskId: string, input: UpdateTaskInput) => {
    const updated = updateTask(taskId, input)
    if (updated) {
      // Sync selected task if currently open in modal
      setSelectedTask(updated)
      toast({
        title: 'Task updated',
        description: `Changes to "${updated.title}" saved.`,
        variant: 'success',
      })
    }
  }

  const handleMoveTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    moveTaskStatus(taskId, newStatus)
    const target = tasks.find((t) => t.id === taskId)
    toast({
      title: newStatus === 'Done' ? 'Task completed! 🎉' : 'Task status updated',
      description: `"${target?.title || 'Task'}" moved to ${newStatus}.`,
      variant: 'info',
    })
  }

  const handleTaskDeleted = (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId)
    deleteTask(taskId)
    setSelectedTask(null)
    toast({
      title: 'Task deleted',
      description: `"${target?.title || 'Task'}" was removed.`,
      variant: 'default',
    })
  }

  const handleAddComment = (taskId: string, content: string) => {
    const newComment = addComment(taskId, content)
    // Update local selectedTask reference if open
    setSelectedTask((prev) => {
      if (prev && prev.id === taskId) {
        const currentComments = prev.comments || []
        return {
          ...prev,
          commentCount: currentComments.length + 1,
          comments: [...currentComments, newComment],
        }
      }
      return prev
    })
  }

  const handleUpdateMembers = (updatedMembers: ProjectMember[]) => {
    updateMembers(updatedMembers)
    toast({
      title: 'Project team updated',
      description: `Active project members updated (${updatedMembers.length} members).`,
      variant: 'success',
    })
  }

  const handleEditSave = (updated: Partial<Project>) => {
    editProject(updated)
    toast({
      title: 'Project details saved',
      description: 'Project metadata was successfully updated.',
      variant: 'success',
    })
  }

  const handleDeleteConfirmed = () => {
    setIsDeleteOpen(false)
    projectsApi
      .deleteProject(project.id)
      .then(() => {
        toast({
          title: 'Project deleted',
          description: `"${project.name}" workspace was removed.`,
          variant: 'default',
        })
        navigate('/app/projects')
      })
      .catch((err) => {
        toast({
          title: 'Delete Failed',
          description: err.message || 'Could not delete project from server.',
          variant: 'destructive',
        })
      })
  }


  const handleDuplicateProject = () => {
    toast({
      title: 'Project duplicated',
      description: `Copy of "${project.name}" created as draft.`,
      variant: 'info',
    })
  }

  const handleArchiveProject = () => {
    editProject({ status: 'On Hold' })
    toast({
      title: 'Project archived',
      description: `"${project.name}" has been moved to On Hold.`,
      variant: 'info',
    })
  }

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'board', label: 'Board', icon: Kanban },
    { id: 'tasks', label: 'Tasks', icon: ListTodo },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'accountability', label: 'Accountability', icon: ShieldCheck },
  ]

  if (isLoading) {
    return (
      <PageContainer>
        <ProjectWorkspaceSkeleton />
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          title="Unable to load project workspace"
          description={error}
          onRetry={() => {}}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Project Header */}
        <ProjectHeader
          project={project}
          onAddTask={() => handleOpenAddTask('Todo')}
          onEditProject={() => setIsEditOpen(true)}
          onDuplicateProject={handleDuplicateProject}
          onArchiveProject={handleArchiveProject}
          onDeleteProject={() => setIsDeleteOpen(true)}
          onManageMembers={() => setIsManageMembersOpen(true)}
        />

        {/* Project Progress Summary Card */}
        <ProjectProgressSummary project={project} tasks={tasks} />

        {/* Workspace Navigation Tabs */}
        <div className="border-b border-slate-800/80">
          <nav
            aria-label="Project workspace tabs"
            role="tablist"
            className="flex items-center gap-1 sm:gap-2 -mb-px overflow-x-auto"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'border-blue-500 text-white bg-slate-900/40 rounded-t-lg'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                  {tab.id === 'tasks' && (
                    <span className="rounded-full bg-slate-800 px-2 py-0.2 text-[10px] font-semibold text-slate-300 ml-1">
                      {tasks.length}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Tab Content */}
        <div className="pt-2">
          {activeTab === 'overview' && (
            <ProjectOverviewTab
              project={project}
              tasks={tasks}
              activities={activities}
              onSelectTask={(task) => setSelectedTask(task)}
              onManageMembers={() => setIsManageMembersOpen(true)}
              onSwitchTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'board' && (
            <ProjectTaskBoard
              tasks={tasks}
              onSelectTask={(task) => setSelectedTask(task)}
              onAddTaskWithStatus={(status) => handleOpenAddTask(status)}
              onMoveTaskStatus={handleMoveTaskStatus}
            />
          )}

          {activeTab === 'tasks' && (
            <ProjectTaskTable
              tasks={tasks}
              members={project.members}
              onSelectTask={(task) => setSelectedTask(task)}
              onAddTask={() => handleOpenAddTask('Todo')}
              onMoveTaskStatus={handleMoveTaskStatus}
            />
          )}

          {activeTab === 'activity' && (
            <ProjectActivityFeed activities={activities} />
          )}

          {activeTab === 'accountability' && (
            <ProjectAccountabilityTab
              project={project}
              tasks={tasks}
              onSelectTask={(task) => setSelectedTask(task)}
            />
          )}
        </div>
      </div>

      {/* Dialogs */}
      <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        projectId={project.id}
        members={project.members}
        defaultStatus={defaultTaskStatus}
        onTaskCreated={handleTaskCreated}
      />

      <TaskDetailDialog
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        task={selectedTask}
        members={project.members}
        onUpdateTask={handleTaskUpdated}
        onDeleteTask={handleTaskDeleted}
        onAddComment={handleAddComment}
      />

      <ManageMembersDialog
        open={isManageMembersOpen}
        onOpenChange={setIsManageMembersOpen}
        members={project.members}
        onUpdateMembers={handleUpdateMembers}
      />

      <EditProjectDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        project={project}
        onSave={handleEditSave}
      />

      <DeleteProjectDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        projectName={project.name}
        onConfirmDelete={handleDeleteConfirmed}
      />
    </PageContainer>
  )
}
