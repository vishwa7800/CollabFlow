import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Textarea,
  Select,
} from '@/components/ui'
import { Plus } from 'lucide-react'
import { TaskStatus, TaskPriority, ProjectMember, CreateTaskInput } from '../types'

export interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  members: ProjectMember[]
  defaultStatus?: TaskStatus
  onTaskCreated: (input: CreateTaskInput) => void
}

function AddTaskForm({
  members,
  defaultStatus,
  onTaskCreated,
  onClose,
}: {
  members: ProjectMember[]
  defaultStatus: TaskStatus
  onTaskCreated: (input: CreateTaskInput) => void
  onClose: () => void
}) {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [status, setStatus] = React.useState<TaskStatus>(defaultStatus)
  const [priority, setPriority] = React.useState<TaskPriority>('Medium')
  const [assigneeId, setAssigneeId] = React.useState<string>(members[0]?.id || '')
  const [dueDate, setDueDate] = React.useState('')
  const [estimateHours, setEstimateHours] = React.useState<string>('')
  const [tagsInput, setTagsInput] = React.useState('Frontend')
  const [errors, setErrors] = React.useState<{ title?: string; estimate?: string }>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const validate = () => {
    const errs: typeof errors = {}
    if (!title.trim()) {
      errs.title = 'Task title is required.'
    } else if (title.trim().length < 2) {
      errs.title = 'Task title must be at least 2 characters.'
    }

    if (estimateHours && (isNaN(Number(estimateHours)) || Number(estimateHours) < 0)) {
      errs.estimate = 'Estimate must be a positive number.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      onTaskCreated({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        assigneeId: assigneeId || undefined,
        dueDate: dueDate || undefined,
        estimateHours: estimateHours ? Number(estimateHours) : undefined,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
      })

      onClose()
    }, 400)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2 text-left" noValidate>
      <Input
        label="Task Title"
        placeholder="e.g. Implement API authentication error handling"
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setTitle(e.target.value)
          if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }))
        }}
        error={errors.title}
        required
        autoFocus
      />

      <Textarea
        label="Description"
        placeholder="Provide context, acceptance criteria, or relevant links..."
        value={description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
        rows={2}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Workflow Status"
          options={statusOptions}
          value={status}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setStatus(e.target.value as TaskStatus)
          }
        />

        <Select
          label="Priority"
          options={priorityOptions}
          value={priority}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setPriority(e.target.value as TaskPriority)
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Assignee"
          options={memberOptions}
          value={assigneeId}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setAssigneeId(e.target.value)
          }
        />

        <Input
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Estimated Effort (Hours)"
          type="number"
          min="0"
          step="0.5"
          placeholder="e.g. 4.5"
          value={estimateHours}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEstimateHours(e.target.value)
            if (errors.estimate) setErrors((prev) => ({ ...prev, estimate: undefined }))
          }}
          error={errors.estimate}
        />

        <Input
          label="Tags (comma-separated)"
          placeholder="e.g. Frontend, API, QA"
          value={tagsInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagsInput(e.target.value)}
        />
      </div>

      <DialogFooter className="mt-6 pt-4 border-t border-slate-800">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isSubmitting}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Create Task
        </Button>
      </DialogFooter>
    </form>
  )
}

export function AddTaskDialog({
  open,
  onOpenChange,
  projectId,
  members,
  defaultStatus = 'Todo',
  onTaskCreated,
}: AddTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create and assign a task to track work in this project workspace.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <AddTaskForm
            key={`${defaultStatus}-${projectId}`}
            members={members}
            defaultStatus={defaultStatus}
            onTaskCreated={onTaskCreated}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
