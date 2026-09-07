export type WorkspaceRole = 'OWNER' | 'MANAGER' | 'MEMBER' | 'VIEWER'

export type Permission =
  // Workspace permissions
  | 'workspace.read'
  | 'workspace.update'
  | 'workspace.delete'
  | 'workspace.manage_members'
  | 'workspace.manage_roles'
  // Project permissions
  | 'project.read'
  | 'project.create'
  | 'project.update'
  | 'project.delete'
  | 'project.manage_members'
  // Task permissions
  | 'task.read'
  | 'task.create'
  | 'task.update'
  | 'task.delete'
  | 'task.assign'
  | 'task.review'
  // Work permissions
  | 'work.submit'
  | 'work.approve'
  | 'work.request_changes'
  // Activity & Pulse permissions
  | 'activity.read'
  | 'pulse.read'

export const ROLE_PERMISSIONS: Record<WorkspaceRole, ReadonlySet<Permission>> = {
  OWNER: new Set<Permission>([
    'workspace.read',
    'workspace.update',
    'workspace.delete',
    'workspace.manage_members',
    'workspace.manage_roles',
    'project.read',
    'project.create',
    'project.update',
    'project.delete',
    'project.manage_members',
    'task.read',
    'task.create',
    'task.update',
    'task.delete',
    'task.assign',
    'task.review',
    'work.submit',
    'work.approve',
    'work.request_changes',
    'activity.read',
    'pulse.read',
  ]),

  MANAGER: new Set<Permission>([
    'workspace.read',
    'workspace.manage_members',
    'project.read',
    'project.create',
    'project.update',
    'project.manage_members',
    'task.read',
    'task.create',
    'task.update',
    'task.delete',
    'task.assign',
    'task.review',
    'work.submit',
    'work.approve',
    'work.request_changes',
    'activity.read',
    'pulse.read',
  ]),

  MEMBER: new Set<Permission>([
    'workspace.read',
    'project.read',
    'task.read',
    'task.create',
    'task.update',
    'work.submit',
    'activity.read',
  ]),

  VIEWER: new Set<Permission>([
    'workspace.read',
    'project.read',
    'task.read',
    'activity.read',
    'pulse.read',
  ]),
}

/**
 * Checks if a role has the given permission (client-side UI helper).
 * Note: The backend remains the strict authority and security boundary.
 */
export function hasPermission(role: WorkspaceRole | null | undefined, permission: Permission): boolean {
  if (!role) return false
  const permissions = ROLE_PERMISSIONS[role]
  return permissions ? permissions.has(permission) : false
}
