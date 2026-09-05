import { Card, CardContent } from '@/components/ui'
import { FolderKanban, CheckSquare, Clock, CheckCircle2 } from 'lucide-react'
import { DashboardMetricsData } from '../types'

export interface DashboardMetricsProps {
  metrics: DashboardMetricsData
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  const cards = [
    {
      label: metrics.activeProjects.label,
      value: metrics.activeProjects.value,
      change: metrics.activeProjects.change,
      icon: FolderKanban,
      color: 'text-blue-400',
      bgColor: 'bg-blue-950/50 border-blue-800/40',
    },
    {
      label: metrics.openTasks.label,
      value: metrics.openTasks.value,
      change: metrics.openTasks.change,
      icon: CheckSquare,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/50 border-cyan-800/40',
    },
    {
      label: metrics.dueThisWeek.label,
      value: metrics.dueThisWeek.value,
      change: metrics.dueThisWeek.change,
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/50 border-amber-800/40',
    },
    {
      label: metrics.completedThisMonth.label,
      value: metrics.completedThisMonth.value,
      change: metrics.completedThisMonth.change,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/50 border-emerald-800/40',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <Card
            key={idx}
            className="border-slate-800/90 bg-slate-900/60 hover:border-slate-700/80 transition-all shadow-sm"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {card.label}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border ${card.bgColor} ${card.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {card.value}
                </div>
                {card.change && (
                  <p className="text-[11px] text-slate-400 font-medium truncate">
                    {card.change}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
