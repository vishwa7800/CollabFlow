import { Link } from 'react-router-dom'
import { Button, EmptyState, Card, CardHeader, CardTitle, CardDescription, Input, Badge, Avatar } from '@/components/ui'
import { PageContainer, PageHeader } from '@/components/layout'
import { Plus, CheckSquare, ArrowRight, TrendingUp } from 'lucide-react'

export { ProjectsPage, ProjectDetailPage, NewProjectPage } from '@/features/projects'

export function TasksPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Tasks"
        description="Track, filter, and organize task execution across all workspace projects."
        breadcrumbs={[{ label: 'Workspace', href: '/app/dashboard' }, { label: 'Tasks' }]}
        primaryAction={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
            New Task
          </Button>
        }
      />

      <EmptyState
        icon={<CheckSquare className="h-6 w-6 text-indigo-400" />}
        title="No tasks assigned yet"
        description="Tasks from your projects will appear here with statuses, priority tags, and due dates."
        primaryAction={
          <Link to="/app/projects">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3 w-3" />}>
              Explore Projects
            </Button>
          </Link>
        }
      />
    </PageContainer>
  )
}

export function TeamPage() {
  const sampleMembers = [
    { name: 'Alex Morgan', email: 'alex@example.com', role: 'Owner' },
    { name: 'Sarah Connor', email: 'sarah@example.com', role: 'Manager' },
    { name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Member' },
    { name: 'Priya Patel', email: 'priya@example.com', role: 'Viewer' },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Team Members"
        description="Collaborate with teammates and manage role-based project permissions."
        breadcrumbs={[{ label: 'Workspace', href: '/app/dashboard' }, { label: 'Team' }]}
        primaryAction={
          <div className="flex items-center gap-2">
            <Link to="/app/team/performance">
              <Button variant="outline" size="sm" leftIcon={<TrendingUp className="h-4 w-4" />}>
                Performance Analytics
              </Button>
            </Link>
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              Invite Member
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        {sampleMembers.map((member) => (
          <Card key={member.email} className="border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Avatar name={member.name} size="md" />
              <Badge
                variant={
                  member.role === 'Owner'
                    ? 'info'
                    : member.role === 'Manager'
                    ? 'warning'
                    : member.role === 'Member'
                    ? 'success'
                    : 'default'
                }
                size="sm"
              >
                {member.role}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">{member.name}</h4>
              <p className="text-xs text-slate-400 truncate">{member.email}</p>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}

export function SettingsPage() {
  return (
    <PageContainer maxWidth="2xl">
      <PageHeader
        title="Workspace Settings"
        description="Manage workspace preferences, notification rules, and account details."
        breadcrumbs={[{ label: 'Workspace', href: '/app/dashboard' }, { label: 'Settings' }]}
      />

      <Card className="border-slate-800 bg-slate-900/60 p-6 sm:p-8 text-left space-y-6">
        <CardHeader className="p-0 border-0">
          <CardTitle className="text-base">Workspace Profile</CardTitle>
          <CardDescription>General information about your team workspace.</CardDescription>
        </CardHeader>

        <div className="space-y-4">
          <Input
            label="Workspace Name"
            defaultValue="Acme Core Team"
            helperText="The visible name of this CollabFlow organization."
          />
          <Input
            label="Workspace URL"
            defaultValue="collabflow.dev/acme-team"
            disabled
          />
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-slate-800">
          <Button variant="primary" size="sm">
            Save Changes
          </Button>
        </div>
      </Card>
    </PageContainer>
  )
}

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-20 text-center">
      <h1 className="text-6xl font-bold text-slate-600">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-white">Page Not Found</h2>
      <p className="mt-2 text-sm text-slate-400">The requested route does not exist.</p>
      <div className="mt-6">
        <Link to="/">
          <Button variant="secondary">Return Home</Button>
        </Link>
      </div>
    </div>
  )
}
