import { ProjectStatus } from '../types'
import { cn } from '@/lib/utils'

export interface ProjectProgressProps {
  progress: number
  status: ProjectStatus
  showLabel?: boolean
  className?: string
}

export function ProjectProgress({
  progress,
  status,
  showLabel = true,
  className,
}: ProjectProgressProps) {
  const getProgressColor = () => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500'
      case 'On Hold':
        return 'bg-slate-500'
      case 'Planning':
        return 'bg-amber-500'
      case 'In Progress':
      default:
        return 'bg-blue-500'
    }
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span className="font-semibold text-slate-200">{progress}%</span>
        </div>
      )}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Project progress ${progress}%`}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-300', getProgressColor())}
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
    </div>
  )
}
