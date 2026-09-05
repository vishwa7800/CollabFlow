import { Input, Select, Button } from '@/components/ui'
import { Search, LayoutGrid, List, X, Filter } from 'lucide-react'
import { ProjectFiltersState, ProjectStatus, ProjectPriority, ProjectSortOption, ProjectViewMode } from '../types'

export interface ProjectToolbarProps {
  filters: ProjectFiltersState
  onSearchChange: (search: string) => void
  onStatusChange: (status: 'All' | ProjectStatus) => void
  onPriorityChange: (priority: 'All' | ProjectPriority) => void
  onSortChange: (sort: ProjectSortOption) => void
  onViewModeChange: (mode: ProjectViewMode) => void
  onResetFilters: () => void
  totalCount: number
  filteredCount: number
}

export function ProjectToolbar({
  filters,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSortChange,
  onViewModeChange,
  onResetFilters,
  totalCount,
  filteredCount,
}: ProjectToolbarProps) {
  const isFiltered =
    filters.search.trim() !== '' ||
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.sortBy !== 'updated'

  const statusOptions = [
    { value: 'All', label: 'All Statuses' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Planning', label: 'Planning' },
    { value: 'Completed', label: 'Completed' },
    { value: 'On Hold', label: 'On Hold' },
  ]

  const priorityOptions = [
    { value: 'All', label: 'All Priorities' },
    { value: 'High', label: 'High Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'Low', label: 'Low Priority' },
  ]

  const sortOptions = [
    { value: 'updated', label: 'Recently Updated' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'name', label: 'Project Name' },
    { value: 'progress', label: 'Progress (%)' },
  ]

  return (
    <div className="space-y-3 text-left">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Input
            placeholder="Search projects by name, description, or tag..."
            value={filters.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-slate-500" />}
            rightIcon={
              filters.search ? (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="text-slate-400 hover:text-white p-1"
                  aria-label="Clear search query"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : undefined
            }
          />
        </div>

        {/* Filters & View Toggles */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Select */}
          <div className="w-36">
            <Select
              options={statusOptions}
              value={filters.status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                onStatusChange(e.target.value as 'All' | ProjectStatus)
              }
            />
          </div>

          {/* Priority Select */}
          <div className="w-36">
            <Select
              options={priorityOptions}
              value={filters.priority}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                onPriorityChange(e.target.value as 'All' | ProjectPriority)
              }
            />
          </div>

          {/* Sort By Select */}
          <div className="w-40">
            <Select
              options={sortOptions}
              value={filters.sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                onSortChange(e.target.value as ProjectSortOption)
              }
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900 p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                filters.viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Switch to grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                filters.viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Switch to list view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Row */}
      {isFiltered && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
          <span className="text-slate-500 flex items-center gap-1">
            <Filter className="h-3 w-3" />
            <span>Showing {filteredCount} of {totalCount} projects:</span>
          </span>

          {filters.search && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200 border border-slate-700">
              <span>Query: "{filters.search}"</span>
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="hover:text-white"
                aria-label="Remove search filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.status !== 'All' && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200 border border-slate-700">
              <span>Status: {filters.status}</span>
              <button
                type="button"
                onClick={() => onStatusChange('All')}
                className="hover:text-white"
                aria-label="Remove status filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.priority !== 'All' && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200 border border-slate-700">
              <span>Priority: {filters.priority}</span>
              <button
                type="button"
                onClick={() => onPriorityChange('All')}
                className="hover:text-white"
                aria-label="Remove priority filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-6 px-2 text-[11px] text-blue-400 hover:text-blue-300 hover:bg-slate-800"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
