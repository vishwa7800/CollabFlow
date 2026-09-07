import * as React from 'react'
import { Link } from 'react-router-dom'
import { PageContainer, PageHeader } from '@/components/layout'
import { Button, EmptyState } from '@/components/ui'
import { Plus, FolderKanban, SearchX } from 'lucide-react'
import {
  ProjectToolbar,
  ProjectCard,
  ProjectListItem,
  ProjectStatsBanner,
  ProjectSkeleton,
} from '../components'
import { MOCK_PROJECTS } from '../data/mockProjects'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '@/lib/api'
import {
  ProjectFiltersState,
} from '../types'

export function ProjectsPage() {

  const { data: apiProjects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getProjects(),
  })

  const projects = apiProjects || MOCK_PROJECTS

  const [filters, setFilters] = React.useState<ProjectFiltersState>({
    search: '',
    status: 'All',
    priority: 'All',
    sortBy: 'updated',
    viewMode: 'grid',
  })


  // Filter & Sort Logic
  const filteredProjects = React.useMemo(() => {
    return projects
      .filter((project) => {
        // Search Filter
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase()
          const matchesName = project.name.toLowerCase().includes(q)
          const matchesDesc = project.description.toLowerCase().includes(q)
          const matchesTag = project.tags?.some((t) => t.toLowerCase().includes(q))
          if (!matchesName && !matchesDesc && !matchesTag) return false
        }

        // Status Filter
        if (filters.status !== 'All' && project.status !== filters.status) {
          return false
        }

        // Priority Filter
        if (filters.priority !== 'All' && project.priority !== filters.priority) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name)
          case 'dueDate':
            return a.dueDateTimestamp - b.dueDateTimestamp
          case 'progress':
            return b.progress - a.progress
          case 'updated':
          default:
            return b.updatedAtTimestamp - a.updatedAtTimestamp
        }
      })
  }, [projects, filters])

  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      search: '',
      status: 'All',
      priority: 'All',
      sortBy: 'updated',
    }))
  }

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        title="Projects"
        description="Manage your team's projects, progress, and delivery timelines."
        breadcrumbs={[{ label: 'Workspace', href: '/app/dashboard' }, { label: 'Projects' }]}
        primaryAction={
          <Link to="/app/projects/new">
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              New Project
            </Button>
          </Link>
        }
      />

      {/* Workspace Project Statistics Banner */}
      <ProjectStatsBanner projects={projects} />

      {/* Interactive Search & Filter Toolbar */}
      <ProjectToolbar
        filters={filters}
        onSearchChange={(search) => setFilters((f) => ({ ...f, search }))}
        onStatusChange={(status) => setFilters((f) => ({ ...f, status }))}
        onPriorityChange={(priority) => setFilters((f) => ({ ...f, priority }))}
        onSortChange={(sortBy) => setFilters((f) => ({ ...f, sortBy }))}
        onViewModeChange={(viewMode) => setFilters((f) => ({ ...f, viewMode }))}
        onResetFilters={handleResetFilters}
        totalCount={projects.length}
        filteredCount={filteredProjects.length}
      />

      {/* Main Content Area */}
      {isLoading ? (
        <ProjectSkeleton viewMode={filters.viewMode} />
      ) : projects.length === 0 ? (
        <div className="py-12">
          <EmptyState
            icon={<FolderKanban className="h-7 w-7 text-blue-400" />}
            title="No projects yet"
            description="Create your first project to organize work and collaborate with your team."
            primaryAction={
              <Link to="/app/projects/new">
                <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                  Create project
                </Button>
              </Link>
            }
          />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-12">
          <EmptyState
            icon={<SearchX className="h-7 w-7 text-amber-400" />}
            title="No projects found"
            description="No projects match your current search and filter criteria. Try adjusting your query or resetting filters."
            primaryAction={
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Clear filters
              </Button>
            }
          />
        </div>
      ) : filters.viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <ProjectListItem key={project.id} project={project} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
