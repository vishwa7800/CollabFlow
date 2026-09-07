import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Badge,
  Avatar,
  Button,
  Input,
  Textarea,
  Select,
} from '@/components/ui'
import {
  Calendar,
  MessageSquare,
  Send,
  Tag,
  User,
  Clock,
  Edit2,
  Trash2,
  Check,
  AlertTriangle,
  GitPullRequest,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Play,
  Info,
  GitCommit,
  RefreshCw,
} from 'lucide-react'
import {
  ProjectTask,
  TaskStatus,
  TaskPriority,
  ProjectMember,
  UpdateTaskInput,
  TaskWorkUpdate,
  TaskEvidence,
  TaskReview,
} from '../types'
import { accountabilityApi } from '@/lib/api'
import { githubApi } from '@/lib/api/github'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useToast } from '@/components/ui'

export interface TaskDetailDialogProps {
  task: ProjectTask | null
  open: boolean
  members: ProjectMember[]
  onOpenChange: (open: boolean) => void
  onUpdateTask?: (taskId: string, input: UpdateTaskInput) => void
  onDeleteTask?: (taskId: string) => void
  onAddComment?: (taskId: string, content: string) => void
}

type DialogTab = 'overview' | 'checkins' | 'evidence'

function TaskDetailContent({
  task,
  members,
  onUpdateTask,
  onDeleteTask,
  onAddComment,
  onClose,
}: {
  task: ProjectTask
  members: ProjectMember[]
  onUpdateTask?: (taskId: string, input: UpdateTaskInput) => void
  onDeleteTask?: (taskId: string) => void
  onAddComment?: (taskId: string, content: string) => void
  onClose: () => void
}) {
  const { user } = useAuth()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = React.useState<DialogTab>('overview')
  const [isEditing, setIsEditing] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [commentText, setCommentText] = React.useState('')
  const [isPostingComment, setIsPostingComment] = React.useState(false)

  // Edit form state
  const [editTitle, setEditTitle] = React.useState(task.title)
  const [editDescription, setEditDescription] = React.useState(task.description || '')
  const [editStatus, setEditStatus] = React.useState<TaskStatus>(task.status)
  const [editPriority, setEditPriority] = React.useState<TaskPriority>(task.priority)
  const [editAssigneeId, setEditAssigneeId] = React.useState(task.assignee?.id || '')
  const [editDueDate, setEditDueDate] = React.useState(task.dueDate || '')
  const [editEstimate, setEditEstimate] = React.useState<string>(
    task.estimateHours ? String(task.estimateHours) : ''
  )
  const [editTags, setEditTags] = React.useState(task.tags?.join(', ') || '')

  // Phase 16 Check-in & Evidence State
  const [workUpdates, setWorkUpdates] = React.useState<TaskWorkUpdate[]>(task.workUpdates || [])
  const [evidenceList, setEvidenceList] = React.useState<TaskEvidence[]>(task.evidence || [])

  // Work update form
  const [updateContent, setUpdateContent] = React.useState('')
  const [updateProgress, setUpdateProgress] = React.useState<number>(50)
  const [isBlocker, setIsBlocker] = React.useState(false)
  const [blockerReason, setBlockerReason] = React.useState('')
  const [isSubmittingUpdate, setIsSubmittingUpdate] = React.useState(false)
  const [reverifyingId, setReverifyingId] = React.useState<string | null>(null)

  // Evidence submission form
  const [evidenceDescription, setEvidenceDescription] = React.useState('')
  const [repoName, setRepoName] = React.useState('collabflow/web-app')
  const [branchName, setBranchName] = React.useState('')
  const [prUrl, setPrUrl] = React.useState('')
  const [commitSha, setCommitSha] = React.useState('')
  const [isSubmittingEvidence, setIsSubmittingEvidence] = React.useState(false)

  // Verification review feedback
  const [reviewFeedback, setReviewFeedback] = React.useState('')
  const [isVerifying, setIsVerifying] = React.useState(false)

  // Fetch real updates and evidence on mount
  React.useEffect(() => {
    Promise.all([
      accountabilityApi.getWorkUpdates(task.id).catch(() => []),
      accountabilityApi.getTaskEvidence(task.id).catch(() => []),
    ]).then(([updates, evidence]) => {
      if (updates.length > 0) setWorkUpdates(updates)
      if (evidence.length > 0) setEvidenceList(evidence)
    })
  }, [task.id])

  // Handlers
  const handleStartTask = async () => {
    try {
      await accountabilityApi.startTask(task.id)
      if (onUpdateTask) {
        onUpdateTask(task.id, { status: 'In Progress', evidenceStatus: 'In Progress' })
      }
      toast({
        title: 'Task Started',
        description: 'Task status moved to In Progress.',
        variant: 'success',
      })
    } catch (err: any) {
      toast({
        title: 'Unable to start task',
        description: err.message || 'Error updating task status.',
        variant: 'destructive',
      })
    }
  }

  const handlePostWorkUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!updateContent.trim()) return

    setIsSubmittingUpdate(true)
    try {
      const created = await accountabilityApi.addWorkUpdate(task.id, {
        content: updateContent.trim(),
        progress: updateProgress,
        isBlocker,
        blockerReason: isBlocker ? blockerReason.trim() : undefined,
      })

      setWorkUpdates((prev) => [
        {
          id: created.id,
          taskId: task.id,
          user: {
            id: user?.id || 'usr-me',
            name: user?.name || 'Current User',
            email: user?.email || '',
            avatar: user?.avatar || undefined,
          },
          content: updateContent.trim(),
          progress: updateProgress,
          isBlocker,
          blockerReason: isBlocker ? blockerReason.trim() : undefined,
          createdAt: 'Just now',
        },
        ...prev,
      ])

      if (onUpdateTask) {
        onUpdateTask(task.id, {
          evidenceStatus: isBlocker ? 'Blocked' : 'In Progress',
        })
      }

      setUpdateContent('')
      setIsBlocker(false)
      setBlockerReason('')
      toast({
        title: isBlocker ? 'Blocker Reported' : 'Check-in Posted',
        description: 'Your progress update was recorded.',
        variant: isBlocker ? 'warning' : 'success',
      })
    } catch (err: any) {
      toast({
        title: 'Update failed',
        description: err.message || 'Could not post work update.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmittingUpdate(false)
    }
  }

  const handleReverify = async (evidenceId: string) => {
    if (!task) return
    try {
      setReverifyingId(evidenceId)
      await githubApi.reverifyEvidence(evidenceId)
      const updatedList = await accountabilityApi.getTaskEvidence(task.id)
      setEvidenceList(updatedList)
      toast({
        title: 'Evidence Re-verified',
        description: 'GitHub verification snapshot has been refreshed.',
        variant: 'success',
      })
    } catch (err: any) {
      toast({
        title: 'Re-verification Failed',
        description: err.message || 'Could not reverify GitHub evidence.',
        variant: 'destructive',
      })
    } finally {
      setReverifyingId(null)
    }
  }

  const handleSubmitEvidence = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!evidenceDescription.trim()) return

    setIsSubmittingEvidence(true)
    try {
      const isResubmission = task.evidenceStatus === 'Changes Requested'
      if (isResubmission) {
        await accountabilityApi.resubmitEvidence(task.id, {
          description: evidenceDescription.trim(),
          github: {
            repoName: repoName.trim() || 'collabflow/web-app',
            branch: branchName.trim() || undefined,
            prUrl: prUrl.trim() || undefined,
            commitSha: commitSha.trim() || undefined,
          },
        })
      } else {
        await accountabilityApi.submitEvidence(task.id, {
          description: evidenceDescription.trim(),
          github: {
            repoName: repoName.trim() || 'collabflow/web-app',
            branch: branchName.trim() || undefined,
            prUrl: prUrl.trim() || undefined,
            commitSha: commitSha.trim() || undefined,
          },
        })
      }

      const updatedList = await accountabilityApi.getTaskEvidence(task.id)
      setEvidenceList(updatedList)

      if (onUpdateTask) {
        onUpdateTask(task.id, {
          status: 'Review',
          evidenceStatus: 'Evidence Submitted',
        })
      }

      setEvidenceDescription('')
      setBranchName('')
      setPrUrl('')
      setCommitSha('')
      toast({
        title: isResubmission ? 'Evidence Resubmitted' : 'Evidence Submitted',
        description: 'Task moved to Review for manager verification.',
        variant: 'success',
      })
    } catch (err: any) {
      toast({
        title: 'Submission failed',
        description: err.message || 'Could not submit evidence.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmittingEvidence(false)
    }
  }

  const handleVerifyEvidence = async (evidenceId: string) => {
    setIsVerifying(true)
    try {
      await accountabilityApi.reviewEvidence(evidenceId, 'APPROVED', reviewFeedback.trim() || undefined)

      const newReview: TaskReview = {
        id: `rev-${Date.now()}`,
        taskId: task.id,
        evidenceId,
        reviewer: {
          id: user?.id || 'usr-verifier',
          name: user?.name || 'Verifier',
          email: user?.email || '',
          avatar: user?.avatar || undefined,
        },
        decision: 'APPROVED',
        comment: reviewFeedback.trim() || undefined,
        createdAt: 'Just now',
      }

      setEvidenceList((prev) =>
        prev.map((e) =>
          e.id === evidenceId
            ? {
                ...e,
                status: 'Verified',
                feedback: reviewFeedback.trim() || undefined,
                verifiedBy: {
                  id: user?.id || 'usr-verifier',
                  name: user?.name || 'Verifier',
                  email: user?.email || '',
                  avatar: user?.avatar || undefined,
                },
                verifiedAt: 'Just now',
                reviews: [newReview, ...(e.reviews || [])],
              }
            : e
        )
      )

      if (onUpdateTask) {
        onUpdateTask(task.id, {
          status: 'Done',
          evidenceStatus: 'Verified',
        })
      }

      setReviewFeedback('')
      toast({
        title: 'Evidence Verified! 🎉',
        description: 'Task successfully verified and marked as Completed.',
        variant: 'success',
      })
    } catch (err: any) {
      toast({
        title: 'Verification Failed',
        description: err.message || 'Unable to verify evidence.',
        variant: 'destructive',
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleRejectEvidence = async (evidenceId: string) => {
    if (!reviewFeedback.trim()) {
      toast({
        title: 'Feedback required',
        description: 'Please provide feedback explaining the requested changes.',
        variant: 'destructive',
      })
      return
    }

    setIsVerifying(true)
    try {
      await accountabilityApi.reviewEvidence(evidenceId, 'CHANGES_REQUESTED', reviewFeedback.trim())

      const newReview: TaskReview = {
        id: `rev-${Date.now()}`,
        taskId: task.id,
        evidenceId,
        reviewer: {
          id: user?.id || 'usr-verifier',
          name: user?.name || 'Reviewer',
          email: user?.email || '',
          avatar: user?.avatar || undefined,
        },
        decision: 'CHANGES_REQUESTED',
        comment: reviewFeedback.trim(),
        createdAt: 'Just now',
      }

      setEvidenceList((prev) =>
        prev.map((e) =>
          e.id === evidenceId
            ? {
                ...e,
                status: 'Changes Requested',
                feedback: reviewFeedback.trim(),
                reviews: [newReview, ...(e.reviews || [])],
              }
            : e
        )
      )

      if (onUpdateTask) {
        onUpdateTask(task.id, {
          status: 'In Progress',
          evidenceStatus: 'Changes Requested',
        })
      }

      setReviewFeedback('')
      toast({
        title: 'Changes Requested',
        description: 'Feedback recorded and task moved back to In Progress for updates.',
        variant: 'warning',
      })
    } catch (err: any) {
      toast({
        title: 'Action Failed',
        description: err.message || 'Unable to request changes on evidence.',
        variant: 'destructive',
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || isPostingComment) return

    setIsPostingComment(true)
    setTimeout(() => {
      if (onAddComment) {
        onAddComment(task.id, commentText.trim())
      }
      setCommentText('')
      setIsPostingComment(false)
    }, 250)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editTitle.trim()) return

    const parsedTags = editTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    if (onUpdateTask) {
      onUpdateTask(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        status: editStatus,
        priority: editPriority,
        assigneeId: editAssigneeId || undefined,
        dueDate: editDueDate || undefined,
        estimateHours: editEstimate ? Number(editEstimate) : undefined,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
      })
    }

    setIsEditing(false)
  }

  const handleDelete = () => {
    if (onDeleteTask) {
      onDeleteTask(task.id)
    }
    onClose()
  }

  const getStatusVariant = (status: TaskStatus) => {
    switch (status) {
      case 'In Progress':
        return 'info'
      case 'Review':
        return 'warning'
      case 'Done':
        return 'success'
      default:
        return 'default'
    }
  }

  const getPriorityVariant = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return 'destructive'
      case 'Medium':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  const memberOptions = [
    { value: '', label: 'Unassigned' },
    ...members.map((m) => ({ value: m.id, label: m.name })),
  ]

  if (isDeleting) {
    return (
      <div className="space-y-4 py-4 text-left">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="text-base font-bold text-white">Delete Task?</h3>
        </div>
        <p className="text-xs text-slate-300">
          Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <Button variant="outline" size="sm" onClick={() => setIsDeleting(false)}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Yes, Delete Task
          </Button>
        </div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSaveEdit} className="space-y-4 text-left">
        <DialogHeader className="text-left border-b border-slate-800 pb-3">
          <DialogTitle className="text-lg font-bold text-white">Edit Task</DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Update task details, assignees, or labels.
          </DialogDescription>
        </DialogHeader>

        <Input
          label="Title *"
          value={editTitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTitle(e.target.value)}
          required
        />

        <Textarea
          label="Description"
          rows={3}
          value={editDescription}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setEditDescription(e.target.value)
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Status"
            options={[
              { value: 'Todo', label: 'To Do' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Review', label: 'Review' },
              { value: 'Done', label: 'Done' },
            ]}
            value={editStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setEditStatus(e.target.value as TaskStatus)
            }
          />

          <Select
            label="Priority"
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
            ]}
            value={editPriority}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setEditPriority(e.target.value as TaskPriority)
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assignee"
            options={memberOptions}
            value={editAssigneeId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setEditAssigneeId(e.target.value)
            }
          />

          <Input
            label="Due Date"
            type="date"
            value={editDueDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditDueDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Estimate (Hours)"
            type="number"
            min="0"
            step="0.5"
            value={editEstimate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditEstimate(e.target.value)
            }
          />

          <Input
            label="Tags (comma-separated)"
            value={editTags}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTags(e.target.value)}
          />
        </div>

        <DialogFooter className="mt-6 pt-4 border-t border-slate-800 gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" leftIcon={<Check className="h-4 w-4" />}>
            Save Changes
          </Button>
        </DialogFooter>
      </form>
    )
  }

  return (
    <>
      <DialogHeader className="text-left space-y-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getStatusVariant(task.status)} size="sm">
              {task.status}
            </Badge>
            <Badge variant={getPriorityVariant(task.priority)} size="sm">
              {task.priority} Priority
            </Badge>
            {task.evidenceStatus && (
              <Badge
                variant={
                  task.evidenceStatus === 'Verified'
                    ? 'success'
                    : task.evidenceStatus === 'Evidence Submitted'
                    ? 'warning'
                    : task.evidenceStatus === 'Changes Requested'
                    ? 'destructive'
                    : 'outline'
                }
                size="sm"
              >
                Evidence: {task.evidenceStatus}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {task.status === 'Todo' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleStartTask}
                leftIcon={<Play className="h-3 w-3 text-emerald-400" />}
                className="h-7 text-xs px-2.5 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/10"
              >
                Start Task
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              leftIcon={<Edit2 className="h-3 w-3" />}
              className="h-7 text-xs px-2"
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleting(true)}
              className="h-7 w-7 p-0 text-slate-400 hover:text-red-400"
              aria-label="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <DialogTitle className="text-lg sm:text-xl font-bold text-white">
          {task.title}
        </DialogTitle>
        <DialogDescription className="text-xs text-slate-400">
          Created on {task.createdAt}
        </DialogDescription>

        {/* Dialog Sub-Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview & Discussion
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('checkins')}
            className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'checkins'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Check-ins</span>
            {workUpdates.length > 0 && (
              <span className="bg-slate-800 text-[10px] px-1.5 rounded-full font-bold">
                {workUpdates.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('evidence')}
            className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'evidence'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>GitHub & Evidence</span>
            {evidenceList.length > 0 && (
              <span className="bg-slate-800 text-[10px] px-1.5 rounded-full font-bold">
                {evidenceList.length}
              </span>
            )}
          </button>
        </div>
      </DialogHeader>

      <div className="py-3 text-left">
        {/* TAB 1: OVERVIEW & COMMENTS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Changes Requested Banner */}
            {task.evidenceStatus === 'Changes Requested' && (
              <div className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-950/20 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">Changes Requested by Reviewer</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('evidence')}
                      className="text-[11px] font-semibold text-amber-400 hover:underline flex items-center gap-1"
                    >
                      View Feedback &amp; Resubmit &rarr;
                    </button>
                  </div>
                  <p className="text-xs text-slate-300">
                    Reviewer feedback has been provided on your work proof. Switch to the &quot;GitHub &amp; Evidence&quot; tab to inspect comments and resubmit updated proof.
                  </p>
                </div>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-lg bg-slate-950/60 border border-slate-800/80 p-3.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="text-slate-400">Assignee:</span>
                {task.assignee ? (
                  <span className="flex items-center gap-1.5 font-medium text-white truncate">
                    <Avatar name={task.assignee.name} size="sm" className="h-4 w-4 text-[9px]" />
                    <span className="truncate">{task.assignee.name}</span>
                  </span>
                ) : (
                  <span className="text-slate-500 italic">Unassigned</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="text-slate-400">Due Date:</span>
                <span className="font-medium text-white">{task.dueDate || 'None'}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="text-slate-400">Estimate:</span>
                <span className="font-medium text-white">
                  {task.estimateHours ? `${task.estimateHours}h` : 'None'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Description
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed rounded-lg bg-slate-900/50 p-3 border border-slate-800/60">
                {task.description || 'No detailed description provided for this task.'}
              </p>
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Labels
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-800/90 px-2 py-0.5 text-xs text-slate-300 border border-slate-700/60"
                    >
                      <Tag className="h-3 w-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comment Thread */}
            <div className="space-y-4 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Task Discussion ({task.comments?.length || 0})
                </h4>
              </div>

              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {!task.comments || task.comments.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center">
                    No discussion comments on this task yet.
                  </p>
                ) : (
                  task.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start gap-2.5 rounded-lg bg-slate-950/60 p-3 border border-slate-800/70 text-xs"
                    >
                      <Avatar name={comment.user.name} size="sm" />
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white truncate">
                            {comment.user.name}
                          </span>
                          <span className="text-[10px] text-slate-500">{comment.createdAt}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handlePostComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment or update..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!commentText.trim() || isPostingComment}
                  isLoading={isPostingComment}
                  rightIcon={<Send className="h-3.5 w-3.5" />}
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: CHECK-INS & WORK UPDATES */}
        {activeTab === 'checkins' && (
          <div className="space-y-6">
            {/* New Check-in Form */}
            <form
              onSubmit={handlePostWorkUpdate}
              className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Post Work Check-in
                </h4>
                <span className="text-[11px] text-slate-400">Progress: {updateProgress}%</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={updateProgress}
                onChange={(e) => setUpdateProgress(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />

              <Textarea
                placeholder="What did you accomplish? Any next steps or context?"
                rows={2}
                value={updateContent}
                onChange={(e) => setUpdateContent(e.target.value)}
                required
              />

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="blocker-toggle"
                  checked={isBlocker}
                  onChange={(e) => setIsBlocker(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-rose-500 focus:ring-rose-500"
                />
                <label htmlFor="blocker-toggle" className="text-xs text-slate-300 font-medium">
                  Report as Blocker
                </label>
              </div>

              {isBlocker && (
                <Input
                  label="Blocker Reason / What is needed to proceed?"
                  placeholder="e.g. Waiting on API credentials or Figma design review"
                  value={blockerReason}
                  onChange={(e) => setBlockerReason(e.target.value)}
                  required
                />
              )}

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  variant={isBlocker ? 'destructive' : 'primary'}
                  size="sm"
                  disabled={!updateContent.trim() || isSubmittingUpdate}
                  isLoading={isSubmittingUpdate}
                >
                  {isBlocker ? 'Report Blocker' : 'Post Check-in'}
                </Button>
              </div>
            </form>

            {/* Check-ins Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Check-in History ({workUpdates.length})
              </h4>

              {workUpdates.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center border border-dashed border-slate-800 rounded-lg">
                  No check-ins posted yet. Use the form above to log progress.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {workUpdates.map((u) => (
                    <div
                      key={u.id}
                      className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                        u.isBlocker
                          ? 'border-rose-900/60 bg-rose-950/20'
                          : 'border-slate-800/80 bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar name={u.user.name} size="sm" className="h-4 w-4 text-[9px]" />
                          <span className="font-semibold text-white">{u.user.name}</span>
                          {u.progress !== undefined && (
                            <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded font-medium text-slate-300">
                              {u.progress}% Done
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500">{u.createdAt}</span>
                      </div>

                      <p className="text-slate-300 leading-relaxed">{u.content}</p>

                      {u.isBlocker && (
                        <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-medium pt-1">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          <span>Blocker: {u.blockerReason}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: GITHUB & EVIDENCE */}
        {activeTab === 'evidence' && (
          <div className="space-y-6">
            {/* Changes Requested Notice Banner */}
            {task.evidenceStatus === 'Changes Requested' && (
              <div className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-950/20 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-300">Modifications Requested by Reviewer</div>
                  <p className="text-xs text-slate-300">
                    Previous evidence was reviewed and changes were requested. Review the reviewer feedback below, update your code or pull request, and resubmit using the form below.
                  </p>
                </div>
              </div>
            )}

            {/* Submit / Resubmit Evidence Form */}
            <form
              onSubmit={handleSubmitEvidence}
              className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-blue-400" />
                  <span>
                    {task.evidenceStatus === 'Changes Requested'
                      ? 'Resubmit Work Evidence'
                      : 'Submit Verifiable Work Evidence'}
                  </span>
                </h4>
                <Badge variant={task.evidenceStatus === 'Changes Requested' ? 'warning' : 'outline'} size="sm">
                  {task.evidenceStatus === 'Changes Requested' ? 'Re-Review Required' : 'Peer Review Required'}
                </Badge>
              </div>

              <Textarea
                label="Evidence Description *"
                placeholder={
                  task.evidenceStatus === 'Changes Requested'
                    ? 'Explain how you addressed the requested changes and what was updated...'
                    : 'Describe what you built, fixed, or delivered...'
                }
                rows={2}
                value={evidenceDescription}
                onChange={(e) => setEvidenceDescription(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="GitHub Repository"
                  placeholder="e.g. collabflow/web-app"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                />
                <Input
                  label="Branch"
                  placeholder="e.g. feature/navbar"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Pull Request URL"
                  placeholder="https://github.com/.../pull/42"
                  value={prUrl}
                  onChange={(e) => setPrUrl(e.target.value)}
                />
                <Input
                  label="Commit SHA / URL"
                  placeholder="e.g. 7f8a9b or commit URL"
                  value={commitSha}
                  onChange={(e) => setCommitSha(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!evidenceDescription.trim() || isSubmittingEvidence}
                  isLoading={isSubmittingEvidence}
                  leftIcon={<GitPullRequest className="h-3.5 w-3.5" />}
                >
                  {task.evidenceStatus === 'Changes Requested'
                    ? 'Resubmit Evidence & Request Re-Review'
                    : 'Submit Evidence & Request Review'}
                </Button>
              </div>
            </form>

            {/* Submitted Evidence Records */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Submitted Work Proofs ({evidenceList.length})
              </h4>

              {evidenceList.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center border border-dashed border-slate-800 rounded-lg">
                  No work evidence submitted yet for this task.
                </p>
              ) : (
                <div className="space-y-4">
                  {evidenceList.map((ev) => {
                    const isSubmitter = user?.id === ev.submittedBy.id
                    const isPending = ev.status === 'Evidence Submitted'
                    const isVerified = ev.status === 'Verified'
                    const isChangesReq = ev.status === 'Changes Requested'

                    return (
                      <div
                        key={ev.id}
                        className={`p-4 rounded-xl border text-xs space-y-3 ${
                          isVerified
                            ? 'border-emerald-500/40 bg-emerald-950/10'
                            : isChangesReq
                            ? 'border-amber-500/40 bg-amber-950/10'
                            : 'border-slate-800 bg-slate-900/80'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar
                              name={ev.submittedBy.name}
                              size="sm"
                              className="h-5 w-5 text-[10px]"
                            />
                            <span className="font-semibold text-white">
                              {ev.submittedBy.name}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              submitted on {ev.createdAt}
                            </span>
                          </div>

                          <Badge
                            variant={
                              isVerified
                                ? 'success'
                                : isChangesReq
                                ? 'warning'
                                : isPending
                                ? 'warning'
                                : 'default'
                            }
                            size="sm"
                          >
                            {ev.status}
                          </Badge>
                        </div>

                        <p className="text-slate-200 leading-relaxed">{ev.description}</p>

                        {/* GitHub Evidence & Automated Verification Proof Card */}
                        {ev.githubLinks && ev.githubLinks.length > 0 && (
                          <div className="space-y-3 pt-1">
                            {ev.githubLinks.map((gh) => {
                              const isVerified = gh.verificationStatus === 'VERIFIED'
                              const isPending = gh.verificationStatus === 'PENDING_VERIFICATION'
                              const isFailed = gh.verificationStatus === 'VERIFICATION_FAILED'

                              return (
                                <div
                                  key={gh.id}
                                  className="rounded-xl border border-slate-800 bg-slate-950/90 p-3.5 space-y-2.5"
                                >
                                  {/* Top Bar: Repo & Verification Status */}
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="p-1.5 rounded-md bg-purple-950/40 text-purple-400 border border-purple-800/40">
                                        {gh.prUrl ? (
                                          <GitPullRequest className="h-4 w-4" />
                                        ) : (
                                          <GitCommit className="h-4 w-4" />
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-semibold text-white font-mono text-xs flex items-center gap-1.5">
                                          <span>{gh.repoName}</span>
                                          {gh.branch && (
                                            <span className="text-slate-400 font-normal">({gh.branch})</span>
                                          )}
                                        </div>
                                        {gh.prTitle && (
                                          <div className="text-[11px] text-slate-300 font-medium">
                                            {gh.prTitle}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      {isVerified && (
                                        <Badge variant="success" size="sm" className="flex items-center gap-1">
                                          <CheckCircle2 className="h-3 w-3" />
                                          <span>Verified</span>
                                        </Badge>
                                      )}
                                      {isPending && (
                                        <Badge variant="warning" size="sm" className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          <span>Pending Verification</span>
                                        </Badge>
                                      )}
                                      {isFailed && (
                                        <Badge variant="destructive" size="sm" className="flex items-center gap-1">
                                          <AlertTriangle className="h-3 w-3" />
                                          <span>Verification Failed</span>
                                        </Badge>
                                      )}
                                      {(!gh.verificationStatus || gh.verificationStatus === 'NOT_VERIFIED') && (
                                        <Badge variant="outline" size="sm">
                                          <span>Not Verified</span>
                                        </Badge>
                                      )}

                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-[11px] text-slate-400 hover:text-white"
                                        onClick={() => handleReverify(ev.id)}
                                        disabled={reverifyingId === ev.id}
                                        isLoading={reverifyingId === ev.id}
                                        title="Re-verify GitHub evidence"
                                      >
                                        <RefreshCw className={`h-3 w-3 ${reverifyingId === ev.id ? 'animate-spin' : ''}`} />
                                        <span className="ml-1 hidden sm:inline">Re-verify</span>
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Snapshot Details Grid */}
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                                    {gh.prUrl && (
                                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/60">
                                        <span className="text-slate-500 block text-[10px]">Pull Request</span>
                                        <a
                                          href={gh.prUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-blue-400 hover:underline inline-flex items-center gap-1 font-medium mt-0.5"
                                        >
                                          <span>PR Link</span>
                                          <ExternalLink className="h-2.5 w-2.5" />
                                        </a>
                                      </div>
                                    )}

                                    {gh.commitSha && (
                                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/60">
                                        <span className="text-slate-500 block text-[10px]">Commit SHA</span>
                                        <span className="font-mono text-slate-200 mt-0.5 block">
                                          {gh.commitSha.slice(0, 7)}
                                        </span>
                                      </div>
                                    )}

                                    {(gh.prAuthor || gh.commitAuthor) && (
                                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/60">
                                        <span className="text-slate-500 block text-[10px]">Author</span>
                                        <span className="text-slate-200 font-medium mt-0.5 block truncate">
                                          {gh.prAuthor || gh.commitAuthor}
                                        </span>
                                      </div>
                                    )}

                                    {(gh.sourceBranch || gh.targetBranch) && (
                                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/60">
                                        <span className="text-slate-500 block text-[10px]">Branches</span>
                                        <span className="font-mono text-slate-300 mt-0.5 block truncate">
                                          {gh.sourceBranch || 'head'} &rarr; {gh.targetBranch || 'base'}
                                        </span>
                                      </div>
                                    )}

                                    {(gh.additions !== null && gh.additions !== undefined || gh.deletions !== null && gh.deletions !== undefined) && (
                                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/60">
                                        <span className="text-slate-500 block text-[10px]">Lines Changed</span>
                                        <div className="flex items-center gap-1.5 mt-0.5 font-mono">
                                          <span className="text-emerald-400">+{gh.additions ?? 0}</span>
                                          <span className="text-rose-400">-{gh.deletions ?? 0}</span>
                                          {gh.changedFilesCount !== null && gh.changedFilesCount !== undefined && (
                                            <span className="text-slate-400 text-[10px]">({gh.changedFilesCount} files)</span>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {gh.isMerged !== undefined && gh.isMerged !== null && (
                                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/60">
                                        <span className="text-slate-500 block text-[10px]">Merge Status</span>
                                        <span className={`font-semibold mt-0.5 block ${gh.isMerged ? 'text-purple-400' : 'text-blue-400'}`}>
                                          {gh.isMerged ? 'Merged' : 'Open'}
                                        </span>
                                      </div>
                                    )}

                                    {gh.verifiedAt && (
                                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/60 col-span-2">
                                        <span className="text-slate-500 block text-[10px]">Last Verified</span>
                                        <span className="text-slate-400 mt-0.5 block">
                                          {new Date(gh.verifiedAt).toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Commit Message if available */}
                                  {gh.commitMessage && (
                                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/50 text-[11px] text-slate-300 font-mono">
                                      <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-sans">Commit Message</span>
                                      <p className="mt-0.5 truncate">{gh.commitMessage}</p>
                                    </div>
                                  )}

                                  {/* Verification Error Notice */}
                                  {gh.verificationError && (
                                    <div className="p-2.5 rounded-lg border border-rose-900/60 bg-rose-950/20 text-rose-300 text-[11px] flex items-start gap-2">
                                      <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                                      <div>
                                        <span className="font-semibold block">Verification Note:</span>
                                        <p className="text-slate-300 mt-0.5">{gh.verificationError}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {/* Changes Requested Feedback Notice */}
                        {isChangesReq && (
                          <div className="p-3 rounded-lg border border-amber-900/50 bg-amber-950/30 text-amber-300 text-xs space-y-1">
                            <div className="flex items-center gap-1.5 font-semibold text-amber-200">
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                              <span>Reviewer Feedback / Requested Modifications:</span>
                            </div>
                            <p className="text-slate-200 italic pl-5">&ldquo;{ev.feedback || 'Changes requested by reviewer.'}&rdquo;</p>
                          </div>
                        )}

                        {/* Verified Banner */}
                        {isVerified && (
                          <div className="flex items-center gap-2 text-emerald-400 text-xs bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-900/50">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            <span>
                              Verified by {ev.verifiedBy?.name || 'Manager'} on {ev.verifiedAt}
                              {ev.feedback && `: "${ev.feedback}"`}
                            </span>
                          </div>
                        )}

                        {/* Persistent Review History Timeline */}
                        {ev.reviews && ev.reviews.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-slate-800/80">
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Review History ({ev.reviews.length})
                            </div>
                            <div className="space-y-1.5">
                              {ev.reviews.map((rev) => (
                                <div
                                  key={rev.id}
                                  className={`p-2.5 rounded-lg border text-xs flex flex-col gap-1 ${
                                    rev.decision === 'APPROVED'
                                      ? 'bg-emerald-950/20 border-emerald-900/40'
                                      : 'bg-amber-950/20 border-amber-900/40'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5">
                                      <Avatar name={rev.reviewer.name} size="sm" className="h-4 w-4 text-[9px]" />
                                      <span className="font-semibold text-white">{rev.reviewer.name}</span>
                                      <Badge
                                        variant={rev.decision === 'APPROVED' ? 'success' : 'warning'}
                                        size="sm"
                                        className="text-[10px] py-0 px-1.5"
                                      >
                                        {rev.decision === 'APPROVED' ? 'Approved' : 'Changes Requested'}
                                      </Badge>
                                    </div>
                                    <span className="text-[10px] text-slate-500">{rev.createdAt}</span>
                                  </div>
                                  {rev.comment && (
                                    <p className="text-slate-300 italic pl-5 text-[11px]">
                                      &ldquo;{rev.comment}&rdquo;
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Pending Review Controls & Anti-Self-Review Notice */}
                        {isPending && (
                          <div className="pt-2 border-t border-slate-800/80 space-y-2">
                            {isSubmitter ? (
                              <div className="flex items-center gap-2 text-amber-300/90 text-xs bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/40">
                                <Info className="h-4 w-4 shrink-0" />
                                <span>
                                  <strong>Anti-Self-Review Active:</strong> You submitted this evidence.
                                  Another manager or owner must review and approve your work.
                                </span>
                              </div>
                            ) : (
                              <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                                <div className="text-xs font-semibold text-white">
                                  Reviewer Actions &amp; Feedback
                                </div>
                                <input
                                  type="text"
                                  placeholder="Review comment (required when requesting changes, optional for approval)..."
                                  value={reviewFeedback}
                                  onChange={(e) => setReviewFeedback(e.target.value)}
                                  className="w-full rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <div className="flex items-center gap-2 justify-end pt-1">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isVerifying}
                                    onClick={() => handleRejectEvidence(ev.id)}
                                    className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                                  >
                                    Request Changes
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="primary"
                                    size="sm"
                                    disabled={isVerifying}
                                    onClick={() => handleVerifyEvidence(ev.id)}
                                    leftIcon={<Check className="h-3.5 w-3.5" />}
                                    className="bg-emerald-600 hover:bg-emerald-500"
                                  >
                                    Approve &amp; Complete Task
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export function TaskDetailDialog({
  task,
  open,
  members,
  onOpenChange,
  onUpdateTask,
  onDeleteTask,
  onAddComment,
}: TaskDetailDialogProps) {
  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        {open && (
          <TaskDetailContent
            key={`${task.id}-${task.status}-${task.priority}-${task.evidenceStatus}-${task.commentCount}-${task.assignee?.id}`}
            task={task}
            members={members}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onAddComment={onAddComment}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
