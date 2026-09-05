import * as React from 'react'
import { Plus, X, Tag } from 'lucide-react'
import { AVAILABLE_TAGS } from '../data/mockProjects'

export interface ProjectTagSelectorProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  disabled?: boolean
}

export function ProjectTagSelector({
  selectedTags,
  onChange,
  disabled = false,
}: ProjectTagSelectorProps) {
  const [customTag, setCustomTag] = React.useState('')
  const [isAdding, setIsAdding] = React.useState(false)

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag))
    } else {
      onChange([...selectedTags, tag])
    }
  }

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = customTag.trim()
    if (trimmed && !selectedTags.includes(trimmed)) {
      onChange([...selectedTags, trimmed])
      setCustomTag('')
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-slate-300">
          Project Tags
        </label>
        <span className="text-[11px] text-slate-500">Optional tags for filtering</span>
      </div>

      {/* Tags Grid / Pills */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 p-3 min-h-[46px]">
        {AVAILABLE_TAGS.map((tag) => {
          const isSelected = selectedTags.includes(tag)
          return (
            <button
              key={tag}
              type="button"
              onClick={() => !disabled && handleToggleTag(tag)}
              disabled={disabled}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
              {isSelected && <X className="h-3 w-3 ml-0.5" />}
            </button>
          )
        })}

        {/* Custom selected tags not in available list */}
        {selectedTags
          .filter((t) => !AVAILABLE_TAGS.includes(t))
          .map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-blue-600 text-white px-2.5 py-1 text-xs font-semibold"
            >
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleToggleTag(tag)}
                className="hover:text-slate-200"
                aria-label={`Remove tag ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

        {/* Add custom tag input */}
        {isAdding ? (
          <form onSubmit={handleAddCustomTag} className="inline-flex items-center gap-1">
            <input
              type="text"
              placeholder="Tag name..."
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              className="h-7 w-28 rounded-md border border-blue-500 bg-slate-950 px-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="h-7 px-2 rounded-md bg-blue-600 text-xs font-medium text-white hover:bg-blue-500"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false)
                setCustomTag('')
              }}
              className="h-7 px-1 text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            disabled={disabled}
            className="inline-flex items-center gap-1 rounded-md border border-dashed border-slate-700 bg-slate-950/60 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors"
          >
            <Plus className="h-3 w-3" />
            <span>Custom tag</span>
          </button>
        )}
      </div>
    </div>
  )
}
