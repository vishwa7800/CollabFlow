import React from 'react'
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  HelpCircle,
} from 'lucide-react'

export interface NavItemConfig {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  description?: string
}

export interface NavGroupConfig {
  label?: string
  items: NavItemConfig[]
}

export const MAIN_NAV_ITEMS: NavItemConfig[] = [
  {
    label: 'Overview',
    href: '/app/dashboard',
    icon: LayoutDashboard,
    description: 'Workspace summary and recent activity',
  },
  {
    label: 'Projects',
    href: '/app/projects',
    icon: FolderKanban,
    description: 'Manage and explore team projects',
  },
  {
    label: 'Tasks',
    href: '/app/tasks',
    icon: CheckSquare,
    description: 'Track and organize task execution',
  },
  {
    label: 'Team',
    href: '/app/team',
    icon: Users,
    description: 'Project members and access permissions',
  },
]

export const SECONDARY_NAV_ITEMS: NavItemConfig[] = [
  {
    label: 'Settings',
    href: '/app/settings',
    icon: Settings,
    description: 'Workspace and account configuration',
  },
  {
    label: 'Help & Docs',
    href: '#help',
    icon: HelpCircle,
    description: 'Guides and product documentation',
  },
]

export interface RouteMeta {
  title: string
  breadcrumb: string[]
  description?: string
}

export const ROUTE_META_MAP: Record<string, RouteMeta> = {
  '/app/dashboard': {
    title: 'Workspace Overview',
    breadcrumb: ['Workspace', 'Overview'],
    description: 'High-level summary of active projects, assigned work, and team progress.',
  },
  '/app/projects': {
    title: 'Projects',
    breadcrumb: ['Workspace', 'Projects'],
    description: 'Manage your team’s project workspaces and track overall progress.',
  },
  '/app/projects/new': {
    title: 'Create Project',
    breadcrumb: ['Workspace', 'Projects', 'New'],
    description: 'Initialize a new project workspace for your team.',
  },
  '/app/tasks': {
    title: 'Tasks',
    breadcrumb: ['Workspace', 'Tasks'],
    description: 'Track, filter, and organize task execution across all projects.',
  },
  '/app/team': {
    title: 'Team Members',
    breadcrumb: ['Workspace', 'Team'],
    description: 'Collaborate with team members and manage project role assignments.',
  },
  '/app/settings': {
    title: 'Workspace Settings',
    breadcrumb: ['Workspace', 'Settings'],
    description: 'Configure workspace preferences, roles, and account preferences.',
  },
}

export function getRouteMeta(pathname: string): RouteMeta {
  if (ROUTE_META_MAP[pathname]) {
    return ROUTE_META_MAP[pathname]
  }

  // Handle dynamic project routes e.g. /app/projects/:id
  if (pathname.startsWith('/app/projects/')) {
    return {
      title: 'Project Workspace',
      breadcrumb: ['Workspace', 'Projects', 'Project Details'],
      description: 'Project tasks, Kanban workflow, and discussion threads.',
    }
  }

  return {
    title: 'CollabFlow Workspace',
    breadcrumb: ['Workspace'],
    description: 'Collaborative project management platform.',
  }
}
