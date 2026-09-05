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
} from 'lucide-react'
import {
  ProjectTask,
  TaskStatus,
  TaskPriority,
  ProjectMember,
  UpdateTaskInput,
} from '../types'

export interface TaskDetailDialogProps {
  task: ProjectTask | null
  open: boolean
  members: ProjectMember[]
  onOpenChange: (open: boolean) => void
  onUpdateTask?: (taskId: string, input: UpdateTaskInput) => void
  onDeleteTask?: (taskId: string) => void
  onAddComment?: (taskId: string, content: string) => void
}

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
      case 'Todo':
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
      case 'Low':
      default:
        return 'default'
    }
  }

  const statusOptions = [
    { value: 'Todo', label: 'To Do' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Review', label: 'In Review' },
    { value: 'Done', label: 'Completed' },
  ]

  const priorityOptions = [
    { value: 'Low', label: 'Low Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'High', label: 'High Priority' },
  ]

  const memberOptions = [
    { value: '', label: 'Unassigned' },
    ...members.map((m) => ({
      value: m.id,
      label: `${m.name} (${m.role || 'Member'})`,
    })),
  ]

  if (isDeleting) {
    return (
      <div className="space-y-4 py-3 text-left">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-950/70 text-red-400 border border-red-800/50">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <DialogTitle className="text-lg font-bold text-white">
          Delete Task?
        </DialogTitle>
        <p className="text-xs text-slate-300 leading-relaxed">
          Are you sure you want to delete <strong>"{task.title}"</strong>? This will permanently remove the task and all associated comments.
        </p>

        <DialogFooter className="mt-4 pt-4 border-t border-slate-800 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsDeleting(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Delete Task
          </Button>
        </DialogFooter>
      </div>
    )
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSaveEdit} className="space-y-4 py-2 text-left" noValidate>
        <DialogHeader className="border-b border-slate-800/80 pb-3">
          <DialogTitle className="text-lg font-bold text-white">
            Edit Task
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Update task details, assignment, status, and effort estimate.
          </DialogDescription>
        </DialogHeader>

        <Input
          label="Task Title"
          value={editTitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTitle(e.target.value)}
          required
          autoFocus
        />

        <Textarea
          label="Description"
          value={editDescription}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setEditDescription(e.target.value)
          }
          rows={2}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Status"
            options={statusOptions}
            value={editStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setEditStatus(e.target.value as TaskStatus)
            }
          />

          <Select
            label="Priority"
            options={priorityOptions}
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditDueDate(e.target.value)
            }
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditTags(e.target.value)
            }
          />
        </div>

        <DialogFooter className="mt-6 pt-4 border-t border-slate-800 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            leftIcon={<Check className="h-4 w-4" />}
          >
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
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(task.status)} size="sm">
              {task.status}
            </Badge>
            <Badge variant={getPriorityVariant(task.priority)} size="sm">
              {task.priority} Priority
            </Badge>
          </div>

          <div className="flex items-center gap-1">
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
      </DialogHeader>

      <div className="space-y-6 py-3 text-left">
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

          {/* Existing Comments */}
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
                      <span className="text-[10px] text-slate-500">
                        {comment.createdAt}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Post Comment Input */}
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
            key={`${task.id}-${task.status}-${task.priority}-${task.commentCount}-${task.assignee?.id}`}
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
