import { Link } from 'react-router-dom'
import { EmptyState, Button } from '@/components/ui'
import { FolderKanban, Plus } from 'lucide-react'

export function DashboardEmptyState() {
  return (
    <div className="py-8">
      <EmptyState
        icon={<FolderKanban className="h-7 w-7 text-blue-400" />}
        title="No projects in this workspace yet"
        description="Get started by creating your first project workspace to organize tasks, assign teammates, and track milestones."
        primaryAction={
          <Link to="/app/projects/new">
            <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />}>
              Create First Project
            </Button>
          </Link>
        }
      />
    </div>
  )
}
