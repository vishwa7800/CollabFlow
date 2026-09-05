import { ProjectTask, ProjectActivityItem } from '../types'
import { WORKSPACE_MEMBERS } from './mockProjects'

export const INITIAL_PROJECT_TASKS: Record<string, ProjectTask[]> = {
  'proj-1': [
    {
      id: 'task-101',
      projectId: 'proj-1',
      title: 'Finalize homepage responsive layout & breakpoints',
      description: 'Ensure smooth scaling from 375px mobile through 1440px ultrawide displays with accessible touch targets.',
      status: 'In Progress',
      priority: 'High',
      assignee: WORKSPACE_MEMBERS[0], // Alex Morgan
      dueDate: 'Tomorrow',
      dueDateTimestamp: Date.now() + 24 * 60 * 60 * 1000,
      tags: ['Frontend', 'Design'],
      commentCount: 3,
      createdAt: 'Aug 22, 2026',
      comments: [
        {
          id: 'c-1',
          taskId: 'task-101',
          user: WORKSPACE_MEMBERS[1], // Sarah Connor
          content: 'I reviewed the tablet layout breakpoint at 768px. Looks clean and responsive!',
          createdAt: '2 hours ago',
        },
        {
          id: 'c-2',
          taskId: 'task-101',
          user: WORKSPACE_MEMBERS[0], // Alex Morgan
          content: 'Refining the mobile drawer animation right now. Will move to Review shortly.',
          createdAt: '45 mins ago',
        },
      ],
    },
    {
      id: 'task-102',
      projectId: 'proj-1',
      title: 'Configure Headless CMS GraphQL schema and API webhooks',
      description: 'Set up automated content synchronization with preview webhooks for marketing drafts.',
      status: 'Todo',
      priority: 'High',
      assignee: WORKSPACE_MEMBERS[2], // Rahul Sharma
      dueDate: 'Sep 06, 2026',
      dueDateTimestamp: new Date('2026-09-06').getTime(),
      tags: ['Backend', 'API'],
      commentCount: 1,
      createdAt: 'Aug 24, 2026',
      comments: [
        {
          id: 'c-3',
          taskId: 'task-102',
          user: WORKSPACE_MEMBERS[2],
          content: 'Waiting on CMS API keys from the infrastructure team.',
          createdAt: 'Yesterday',
        },
      ],
    },
    {
      id: 'task-103',
      projectId: 'proj-1',
      title: 'Audit Lighthouse performance and Core Web Vitals',
      description: 'Optimize image assets, reduce unused JavaScript bundles, and target 95+ performance scores.',
      status: 'Review',
      priority: 'Medium',
      assignee: WORKSPACE_MEMBERS[3], // Priya Patel
      dueDate: 'Sep 10, 2026',
      dueDateTimestamp: new Date('2026-09-10').getTime(),
      tags: ['Performance', 'Frontend'],
      commentCount: 2,
      createdAt: 'Aug 25, 2026',
    },
    {
      id: 'task-104',
      projectId: 'proj-1',
      title: 'Export standardized SVG icon kit and favicon bundle',
      description: 'Prepare high-resolution brand assets and web manifest definitions.',
      status: 'Done',
      priority: 'Low',
      assignee: WORKSPACE_MEMBERS[0],
      dueDate: 'Aug 28, 2026',
      dueDateTimestamp: new Date('2026-08-28').getTime(),
      tags: ['Design'],
      commentCount: 0,
      createdAt: 'Aug 18, 2026',
    },
    {
      id: 'task-105',
      projectId: 'proj-1',
      title: 'Write automated end-to-end navigation tests with Playwright',
      description: 'Cover login, project switching, and responsive mobile drawer interactions.',
      status: 'Todo',
      priority: 'Medium',
      assignee: WORKSPACE_MEMBERS[2],
      dueDate: 'Sep 14, 2026',
      dueDateTimestamp: new Date('2026-09-14').getTime(),
      tags: ['Testing', 'QA'],
      commentCount: 0,
      createdAt: 'Aug 26, 2026',
    },
    {
      id: 'task-106',
      projectId: 'proj-1',
      title: 'Implement Dark Mode CSS tokens and contrast ratio verification',
      description: 'Ensure WCAG AA contrast compliance across all text and border variables.',
      status: 'Done',
      priority: 'High',
      assignee: WORKSPACE_MEMBERS[1],
      dueDate: 'Aug 30, 2026',
      dueDateTimestamp: new Date('2026-08-30').getTime(),
      tags: ['Design System', 'Accessibility'],
      commentCount: 4,
      createdAt: 'Aug 15, 2026',
    },
  ],
}

export const INITIAL_PROJECT_ACTIVITIES: Record<string, ProjectActivityItem[]> = {
  'proj-1': [
    {
      id: 'act-101',
      projectId: 'proj-1',
      user: WORKSPACE_MEMBERS[1], // Sarah Connor
      action: 'moved task to Review',
      target: 'Audit Lighthouse performance and Core Web Vitals',
      timestamp: '18m ago',
      type: 'status_changed',
    },
    {
      id: 'act-102',
      projectId: 'proj-1',
      user: WORKSPACE_MEMBERS[0], // Alex Morgan
      action: 'added a comment on',
      target: 'Finalize homepage responsive layout & breakpoints',
      timestamp: '45m ago',
      type: 'comment_added',
    },
    {
      id: 'act-103',
      projectId: 'proj-1',
      user: WORKSPACE_MEMBERS[2], // Rahul Sharma
      action: 'created new task',
      target: 'Write automated end-to-end navigation tests with Playwright',
      timestamp: '3h ago',
      type: 'task_created',
    },
    {
      id: 'act-104',
      projectId: 'proj-1',
      user: WORKSPACE_MEMBERS[1], // Sarah Connor
      action: 'completed task',
      target: 'Implement Dark Mode CSS tokens and contrast ratio verification',
      timestamp: 'Yesterday',
      type: 'task_completed',
    },
    {
      id: 'act-105',
      projectId: 'proj-1',
      user: WORKSPACE_MEMBERS[0], // Alex Morgan
      action: 'added Priya Patel as',
      target: 'Viewer to project workspace',
      timestamp: '2 days ago',
      type: 'member_added',
    },
  ],
}

export function getProjectTasks(projectId: string): ProjectTask[] {
  if (INITIAL_PROJECT_TASKS[projectId]) {
    return INITIAL_PROJECT_TASKS[projectId]
  }

  // Generate sensible default mock tasks for any other project ID
  return [
    {
      id: `task-${projectId}-1`,
      projectId,
      title: 'Initial workspace discovery and technical specification',
      description: 'Define requirements, scope, architecture, and team delivery milestones.',
      status: 'Done',
      priority: 'High',
      assignee: WORKSPACE_MEMBERS[0],
      dueDate: 'Aug 25, 2026',
      dueDateTimestamp: new Date('2026-08-25').getTime(),
      tags: ['Planning'],
      commentCount: 2,
      createdAt: 'Aug 10, 2026',
    },
    {
      id: `task-${projectId}-2`,
      projectId,
      title: 'Design high-fidelity UI components and layout wireframes',
      description: 'Build interactive prototypes and align on product UX flows with stakeholders.',
      status: 'In Progress',
      priority: 'Medium',
      assignee: WORKSPACE_MEMBERS[1],
      dueDate: 'Tomorrow',
      dueDateTimestamp: Date.now() + 24 * 60 * 60 * 1000,
      tags: ['Design', 'Frontend'],
      commentCount: 1,
      createdAt: 'Aug 15, 2026',
    },
    {
      id: `task-${projectId}-3`,
      projectId,
      title: 'Implement database models and API endpoints',
      description: 'Configure Prisma schema migrations and REST route handlers.',
      status: 'Todo',
      priority: 'High',
      assignee: WORKSPACE_MEMBERS[2],
      dueDate: 'Sep 12, 2026',
      dueDateTimestamp: new Date('2026-09-12').getTime(),
      tags: ['Backend'],
      commentCount: 0,
      createdAt: 'Aug 20, 2026',
    },
    {
      id: `task-${projectId}-4`,
      projectId,
      title: 'Deploy staging preview environment and perform QA audit',
      description: 'Verify end-to-end functionality across desktop and mobile devices.',
      status: 'Review',
      priority: 'Low',
      assignee: WORKSPACE_MEMBERS[3],
      dueDate: 'Sep 20, 2026',
      dueDateTimestamp: new Date('2026-09-20').getTime(),
      tags: ['QA'],
      commentCount: 0,
      createdAt: 'Aug 22, 2026',
    },
  ]
}

export function getProjectActivities(projectId: string): ProjectActivityItem[] {
  if (INITIAL_PROJECT_ACTIVITIES[projectId]) {
    return INITIAL_PROJECT_ACTIVITIES[projectId]
  }

  return [
    {
      id: `act-${projectId}-1`,
      projectId,
      user: WORKSPACE_MEMBERS[0],
      action: 'initialized project workspace',
      target: 'with core configuration',
      timestamp: '2 days ago',
      type: 'project_updated',
    },
    {
      id: `act-${projectId}-2`,
      projectId,
      user: WORKSPACE_MEMBERS[1],
      action: 'assigned task to',
      target: 'Sarah Connor',
      timestamp: '1 day ago',
      type: 'task_assigned',
    },
  ]
}
