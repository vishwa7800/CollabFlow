import { Card, Avatar } from '@/components/ui'
import { ActivityItem } from '../types'

export interface RecentActivityProps {
  activities: ActivityItem[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="space-y-4 text-left">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
          Recent Activity
        </h2>
        <p className="text-xs text-slate-400">
          Latest updates across your workspace projects.
        </p>
      </div>

      <Card className="border-slate-800/90 bg-slate-900/60 p-4 divide-y divide-slate-800/70 shadow-sm">
        {activities.map((item) => (
          <div key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <Avatar name={item.user.name} size="sm" className="mt-0.5" />
            <div className="space-y-0.5 flex-1 min-w-0">
              <p className="text-xs text-slate-300 leading-snug">
                <strong className="font-semibold text-white">{item.user.name}</strong>{' '}
                <span className="text-slate-400">{item.action}</span>{' '}
                <span className="font-medium text-blue-300">{item.target}</span>
              </p>
              <span className="text-[10px] text-slate-500 block">
                {item.timestamp}
              </span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
