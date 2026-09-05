import { Avatar, Card } from '@/components/ui'
import { CheckSquare, MessageSquare, Clock, Sparkles, UserPlus } from 'lucide-react'
import { ProjectActivityItem } from '../types'

export interface ProjectActivityFeedProps {
  activities: ProjectActivityItem[]
}

export function ProjectActivityFeed({ activities }: ProjectActivityFeedProps) {
  const getActivityIcon = (type: ProjectActivityItem['type']) => {
    switch (type) {
      case 'task_completed':
        return <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />
      case 'status_changed':
        return <Clock className="h-3.5 w-3.5 text-blue-400" />
      case 'comment_added':
        return <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
      case 'member_added':
        return <UserPlus className="h-3.5 w-3.5 text-purple-400" />
      case 'task_created':
      case 'task_assigned':
      default:
        return <Sparkles className="h-3.5 w-3.5 text-slate-400" />
    }
  }

  return (
    <Card className="border-slate-800/90 bg-slate-900/60 p-6 text-left shadow-sm">
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Project Activity History
          </h3>
          <p className="text-xs text-slate-400">
            Real-time audit log of task status changes, team assignments, and comments.
          </p>
        </div>

        {activities.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">
            No activity recorded for this project yet.
          </p>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {activities.map((item) => (
              <div key={item.id} className="relative flex items-start gap-3">
                {/* Timeline Node Icon */}
                <div className="absolute -left-6 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 border border-slate-700">
                  {getActivityIcon(item.type)}
                </div>

                <Avatar name={item.user.name} size="sm" className="mt-0.5" />

                <div className="space-y-0.5 flex-1 min-w-0 text-xs">
                  <p className="text-slate-300 leading-snug">
                    <strong className="font-semibold text-white">{item.user.name}</strong>{' '}
                    <span className="text-slate-400">{item.action}</span>{' '}
                    <strong className="text-blue-300 font-medium">{item.target}</strong>
                  </p>
                  <span className="text-[11px] text-slate-500 block">
                    {item.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
