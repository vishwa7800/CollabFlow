import { Card, Badge } from '@/components/ui'
import { UpcomingDeadlineItem } from '../types'

export interface UpcomingDeadlinesProps {
  deadlines: UpcomingDeadlineItem[]
}

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  return (
    <div className="space-y-4 text-left">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
          Upcoming Deadlines
        </h2>
        <p className="text-xs text-slate-400">
          Prioritized work due in the next 14 days.
        </p>
      </div>

      <Card className="border-slate-800/90 bg-slate-900/60 p-4 divide-y divide-slate-800/70 shadow-sm">
        {deadlines.map((dl) => (
          <div
            key={dl.id}
            className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="space-y-0.5 min-w-0 flex-1">
              <h4 className="text-xs font-semibold text-white truncate">
                {dl.title}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                {dl.projectName}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant={dl.daysRemaining <= 2 ? 'warning' : 'default'}
                size="sm"
                className="text-[10px]"
              >
                {dl.dueDate}
              </Badge>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
