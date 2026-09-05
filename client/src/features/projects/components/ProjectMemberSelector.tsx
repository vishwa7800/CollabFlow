import * as React from 'react'
import { Avatar, Badge } from '@/components/ui'
import { Plus, X, Check, Users } from 'lucide-react'
import { ProjectMember } from '../types'
import { WORKSPACE_MEMBERS } from '../data/mockProjects'

export interface ProjectMemberSelectorProps {
  selectedMembers: ProjectMember[]
  onChange: (members: ProjectMember[]) => void
  disabled?: boolean
}

export function ProjectMemberSelector({
  selectedMembers,
  onChange,
  disabled = false,
}: ProjectMemberSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggleMember = (member: ProjectMember) => {
    const isSelected = selectedMembers.some((m) => m.id === member.id)
    if (isSelected) {
      onChange(selectedMembers.filter((m) => m.id !== member.id))
    } else {
      onChange([...selectedMembers, member])
    }
  }

  const handleRemoveMember = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selectedMembers.filter((m) => m.id !== id))
  }

  return (
    <div className="space-y-2 text-left" ref={dropdownRef}>
      <label className="block text-xs font-medium text-slate-300">
        Project Members
      </label>

      {/* Selected Members Stack & Add Trigger */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 p-2.5 min-h-[46px]">
        {selectedMembers.length === 0 ? (
          <span className="text-xs text-slate-500 pl-1">
            No team members assigned yet
          </span>
        ) : (
          selectedMembers.map((member) => (
            <span
              key={member.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 pl-1 pr-2 py-0.5 text-xs text-slate-200 shadow-sm"
            >
              <Avatar name={member.name} size="sm" className="h-5 w-5 text-[10px]" />
              <span className="font-medium text-xs truncate max-w-[120px]">
                {member.name}
              </span>
              <button
                type="button"
                onClick={(e) => handleRemoveMember(member.id, e)}
                disabled={disabled}
                className="text-slate-400 hover:text-red-400 focus:outline-none transition-colors rounded-full p-0.5"
                aria-label={`Remove ${member.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        )}

        {/* Add/Select Members Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-slate-700 hover:border-slate-500 bg-slate-950/60 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ml-auto sm:ml-0"
        >
          <Plus className="h-3 w-3" />
          <span>Assign member</span>
        </button>
      </div>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="relative z-30">
          <div className="absolute top-1 left-0 w-full sm:w-80 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl p-2 space-y-1 animate-in fade-in-50 duration-150 max-h-64 overflow-y-auto">
            <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span>Workspace Members</span>
              </span>
              <span className="text-slate-500 text-[10px]">
                {selectedMembers.length} selected
              </span>
            </div>

            {WORKSPACE_MEMBERS.map((member) => {
              const isSelected = selectedMembers.some((m) => m.id === member.id)
              return (
                <div
                  key={member.id}
                  onClick={() => handleToggleMember(member)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-950/40 border border-blue-800/40 text-white'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={member.name} size="sm" />
                    <div className="space-y-0.5 truncate">
                      <p className="text-xs font-semibold truncate leading-tight">
                        {member.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate leading-none">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="default" size="sm" className="text-[9px] px-1.5 py-0">
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
        </div>
      )}
    </div>
  )
}
