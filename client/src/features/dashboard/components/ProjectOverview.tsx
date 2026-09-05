import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ProjectSummaryCard } from './ProjectSummaryCard'
import { ProjectSummary } from '../types'

export interface ProjectOverviewProps {
  projects: ProjectSummary[]
}

export function ProjectOverview({ projects }: ProjectOverviewProps) {
  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Your Projects
          </h2>
          <p className="text-xs text-slate-400">
            Active workspaces you own or collaborate on.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/app/projects"
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-medium"
          >
            <span>View all</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectSummaryCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
