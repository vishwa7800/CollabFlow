import { Card, CardContent } from '@/components/ui'
import { FolderKanban, Play, Clock, CheckCircle2 } from 'lucide-react'
import { Project } from '../types'

export interface ProjectStatsBannerProps {
  projects: Project[]
}

export function ProjectStatsBanner({ projects }: ProjectStatsBannerProps) {
  const total = projects.length
  const inProgress = projects.filter((p) => p.status === 'In Progress').length
  const planning = projects.filter((p) => p.status === 'Planning').length
  const completed = projects.filter((p) => p.status === 'Completed').length

  const stats = [
    { label: 'Total Projects', value: total, icon: FolderKanban, color: 'text-blue-400' },
    { label: 'In Flight', value: inProgress, icon: Play, color: 'text-indigo-400' },
    { label: 'Planning', value: planning, icon: Clock, color: 'text-amber-400' },
    { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-emerald-400' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <Card key={idx} className="border-slate-800/80 bg-slate-900/40 p-3.5">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  {stat.label}
                </span>
                <span className="text-xl font-bold text-white tracking-tight">
                  {stat.value}
                </span>
              </div>
              <div className={`p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 ${stat.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
