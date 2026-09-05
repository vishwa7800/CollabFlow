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
import { Project, ProjectStatus, ProjectPriority } from '../types'

export interface EditProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
  onSave: (updated: Partial<Project>) => void
}

function EditProjectContent({
  project,
  onSave,
  onClose,
}: {
  project: Project
  onSave: (updated: Partial<Project>) => void
  onClose: () => void
}) {
  const [name, setName] = React.useState(project.name)
  const [description, setDescription] = React.useState(project.description)
  const [status, setStatus] = React.useState<ProjectStatus>(project.status)
  const [priority, setPriority] = React.useState<ProjectPriority>(project.priority)
  const [dueDate, setDueDate] = React.useState(project.dueDate)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSave({
      name: name.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate,
    })
    onClose()
  }

  const statusOptions = [
    { value: 'Planning', label: 'Planning' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'On Hold', label: 'On Hold' },
  ]

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
  ]

  return (
    <form onSubmit={handleSave} className="space-y-4 py-2 text-left" noValidate>
      <Input
        label="Project Name"
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        required
      />

      <Textarea
        label="Description"
        value={description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setDescription(e.target.value)
        }
        rows={3}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Status"
          options={statusOptions}
          value={status}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setStatus(e.target.value as ProjectStatus)
          }
        />

        <Select
          label="Priority"
          options={priorityOptions}
          value={priority}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setPriority(e.target.value as ProjectPriority)
          }
        />
      </div>

      <Input
        label="Target Due Date"
        value={dueDate}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
      />

      <DialogFooter className="mt-6 pt-4 border-t border-slate-800">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm">
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  )
}

export function EditProjectDialog({
  open,
  onOpenChange,
  project,
  onSave,
}: EditProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Project Workspace</DialogTitle>
          <DialogDescription>
            Update project metadata, status, priority, and timeline milestones.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <EditProjectContent
            key={`${project.id}-${project.updatedAt}`}
            project={project}
            onSave={onSave}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
