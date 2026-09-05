import { Link } from 'react-router-dom'
import { Button, Badge } from '@/components/ui'
import { Plus, ArrowUpRight } from 'lucide-react'

export interface DashboardGreetingProps {
  userName?: string
  totalProjects?: number
  openTasks?: number
}

export function DashboardGreeting({
  userName = 'Alex',
  totalProjects = 6,
  openTasks = 28,
}: DashboardGreetingProps) {
  const currentHour = new Date().getHours()
  const greetingTime =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800/90 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-blue-950/20 p-6 sm:p-8 backdrop-blur shadow-sm md:flex-row md:items-center md:justify-between text-left">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Badge variant="info" size="sm" dot pulseDot>
            Workspace Active
          </Badge>
          <span className="text-xs text-slate-400">
            {totalProjects} active projects • {openTasks} total tasks
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {greetingTime}, {userName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Here’s a real-time summary of your team's project pipeline, assigned tasks, and upcoming milestones.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 md:pt-0">
        <Link to="/app/projects">
          <Button variant="outline" size="sm" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}>
            All Projects
          </Button>
        </Link>
        <Link to="/app/projects/new">
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
            New Project
          </Button>
        </Link>
      </div>
    </div>
  )
}
