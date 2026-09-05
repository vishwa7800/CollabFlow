import * as React from 'react'
import { Link } from 'react-router-dom'
import { PageContainer, PageHeader } from '@/components/layout'
import { Button } from '@/components/ui'
import { Plus } from 'lucide-react'
import {
  DashboardGreeting,
  DashboardMetrics,
  ProjectOverview,
  MyWork,
  RecentActivity,
  UpcomingDeadlines,
  DashboardSkeleton,
  DashboardEmptyState,
  DashboardErrorState,
} from '../components'
import { MOCK_DASHBOARD_DATA } from '../data/mockDashboardData'

export function DashboardPage() {
  const [data] = React.useState(MOCK_DASHBOARD_DATA)
  const [viewState, setViewState] = React.useState<'default' | 'loading' | 'empty' | 'error'>('default')

  if (viewState === 'loading') {
    return (
      <PageContainer>
        <PageHeader
          title="Dashboard"
          description="Workspace overview, active project status, and task execution."
          breadcrumbs={[{ label: 'Workspace', href: '/app/dashboard' }, { label: 'Overview' }]}
        />
        <DashboardSkeleton />
      </PageContainer>
    )
  }

  if (viewState === 'error') {
    return (
      <PageContainer>
        <PageHeader
          title="Dashboard"
          description="Workspace overview, active project status, and task execution."
          breadcrumbs={[{ label: 'Workspace', href: '/app/dashboard' }, { label: 'Overview' }]}
        />
        <DashboardErrorState onRetry={() => setViewState('default')} />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="High-level summary of your team's project pipeline, assigned tasks, and recent activity."
        breadcrumbs={[{ label: 'Workspace', href: '/app/dashboard' }, { label: 'Overview' }]}
        primaryAction={
          <Link to="/app/projects/new">
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              New Project
            </Button>
          </Link>
        }
      />

      {viewState === 'empty' ? (
        <DashboardEmptyState />
      ) : (
        <div className="space-y-8">
          {/* Personalized Workspace Greeting */}
          <DashboardGreeting
            userName="Alex"
            totalProjects={data.metrics.activeProjects.value}
            openTasks={data.metrics.openTasks.value}
          />

          {/* Key Summary Metrics (4 cards) */}
          <DashboardMetrics metrics={data.metrics} />

          {/* Main Dashboard Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Primary Left Column: Projects & My Work (8 cols on desktop) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Project Overview */}
              <ProjectOverview projects={data.projects} />

              {/* My Work (Assigned Tasks) */}
              <MyWork tasks={data.myTasks} />
            </div>

            {/* Secondary Right Column: Upcoming Deadlines & Activity Feed (4 cols on desktop) */}
            <div className="lg:col-span-4 space-y-8">
              {/* Upcoming Deadlines */}
              <UpcomingDeadlines deadlines={data.upcomingDeadlines} />

              {/* Recent Activity Feed */}
              <RecentActivity activities={data.activities} />
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
