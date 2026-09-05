import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from '@/components/ui'
import { AlertTriangle } from 'lucide-react'

export interface DeleteProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName: string
  onConfirmDelete: () => void
}

export function DeleteProjectDialog({
  open,
  onOpenChange,
  projectName,
  onConfirmDelete,
}: DeleteProjectDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      setIsDeleting(false)
      onConfirmDelete()
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-950/70 text-red-400 border border-red-800/50 mb-2">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle>Delete Project Workspace</DialogTitle>
          <DialogDescription className="text-left leading-relaxed">
            Are you sure you want to delete <strong>{projectName}</strong>? All associated tasks, Kanban boards, milestones, and discussions will be permanently removed. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 pt-4 border-t border-slate-800 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
