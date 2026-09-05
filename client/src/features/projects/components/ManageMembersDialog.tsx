import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Avatar,
  Badge,
} from '@/components/ui'
import { Users, Check } from 'lucide-react'
import { ProjectMember } from '../types'
import { WORKSPACE_MEMBERS } from '../data/mockProjects'

export interface ManageMembersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  members: ProjectMember[]
  onUpdateMembers: (members: ProjectMember[]) => void
}

function ManageMembersContent({
  members,
  onUpdateMembers,
  onClose,
}: {
  members: ProjectMember[]
  onUpdateMembers: (members: ProjectMember[]) => void
  onClose: () => void
}) {
  const [currentMembers, setCurrentMembers] = React.useState<ProjectMember[]>(members)

  const handleToggleMember = (member: ProjectMember) => {
    const exists = currentMembers.some((m) => m.id === member.id)
    if (exists) {
      if (member.role === 'Owner') return
      setCurrentMembers(currentMembers.filter((m) => m.id !== member.id))
    } else {
      setCurrentMembers([...currentMembers, member])
    }
  }

  const handleSave = () => {
    onUpdateMembers(currentMembers)
    onClose()
  }

  return (
    <>
      <div className="space-y-2 py-2 text-left max-h-72 overflow-y-auto">
        {WORKSPACE_MEMBERS.map((member) => {
          const isSelected = currentMembers.some((m) => m.id === member.id)
          const isOwner = member.role === 'Owner'

          return (
            <div
              key={member.id}
              onClick={() => !isOwner && handleToggleMember(member)}
              className={`flex items-center justify-between p-2.5 rounded-lg transition-colors ${
                isOwner
                  ? 'bg-slate-900/40 border border-slate-800 cursor-not-allowed'
                  : isSelected
                  ? 'bg-blue-950/40 border border-blue-800/50 cursor-pointer text-white'
                  : 'hover:bg-slate-800/50 border border-transparent cursor-pointer text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar name={member.name} size="sm" />
                <div className="space-y-0.5 truncate">
                  <p className="text-xs font-semibold text-white truncate">
                    {member.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={isOwner ? 'info' : 'default'} size="sm" className="text-[9px]">
                  {member.role || 'Member'}
                </Badge>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-blue-400" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <DialogFooter className="mt-4 pt-4 border-t border-slate-800">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </DialogFooter>
    </>
  )
}

export function ManageMembersDialog({
  open,
  onOpenChange,
  members,
  onUpdateMembers,
}: ManageMembersDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/40 mb-2">
            <Users className="h-5 w-5" />
          </div>
          <DialogTitle>Manage Project Members</DialogTitle>
          <DialogDescription>
            Assign or remove workspace collaborators for this project.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <ManageMembersContent
            key={members.map((m) => m.id).join(',')}
            members={members}
            onUpdateMembers={onUpdateMembers}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
