export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold'
export type ProjectPriority = 'High' | 'Medium' | 'Low'
export type ProjectViewMode = 'grid' | 'list'
export type ProjectSortOption = 'updated' | 'dueDate' | 'name' | 'progress'

export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Done'
export type TaskPriority = 'High' | 'Medium' | 'Low'
export type EvidenceStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Evidence Submitted'
  | 'Changes Requested'
  | 'Verified'
  | 'Completed'
  | 'Blocked'

export type ReviewDecision = 'APPROVED' | 'CHANGES_REQUESTED'

export interface TaskReview {
  id: string
  taskId: string
  evidenceId: string
  reviewer: ProjectMember
  decision: ReviewDecision
  comment?: string
  createdAt: string
  updatedAt?: string
}

export interface ProjectMember {
  id: string
  name: string
  email: string
  avatar?: string
  role?: 'Owner' | 'Manager' | 'Member' | 'Viewer'
}

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  progress: number
  completedTasks: number
  totalTasks: number
  startDate?: string
  dueDate: string
  dueDateTimestamp: number
  updatedAt: string
  updatedAtTimestamp: number
  createdAt: string
  owner: ProjectMember
  members: ProjectMember[]
  tags?: string[]
}

export interface TaskComment {
  id: string
  taskId: string
  user: ProjectMember
  content: string
  createdAt: string
}

export type GitHubVerificationStatus =
  | 'VERIFIED'
  | 'NOT_VERIFIED'
  | 'VERIFICATION_FAILED'
  | 'PENDING_VERIFICATION'

export interface ProjectGitHubRepo {
  id: string
  projectId: string
  owner: string
  repoName: string
  repoUrl: string
  defaultBranch: string
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR'
  connectedBy?: {
    id: string
    name: string
    email: string
    avatar?: string | null
  }
  lastSyncedAt?: string
  createdAt: string
}

export interface GitHubEvidence {
  id: string
  taskId: string
  evidenceId?: string
  repoName: string
  branch?: string
  prUrl?: string
  prNumber?: number
  prTitle?: string
  prStatus?: string
  commitUrl?: string
  commitSha?: string
  commitMessage?: string
  commitsCount?: number
  lastCommitAt?: string
  verificationStatus?: GitHubVerificationStatus
  prAuthor?: string
  sourceBranch?: string
  targetBranch?: string
  isMerged?: boolean
  changedFilesCount?: number
  additions?: number
  deletions?: number
  commitAuthor?: string
  verifiedAt?: string
  verificationError?: string
  rawSnapshot?: string
  createdAt: string
}

export interface TaskEvidence {
  id: string
  taskId: string
  submittedBy: ProjectMember
  description: string
  status: EvidenceStatus
  verifiedBy?: ProjectMember
  verifiedAt?: string
  feedback?: string
  reviews?: TaskReview[]
  githubLinks?: GitHubEvidence[]
  createdAt: string
}

export interface TaskWorkUpdate {
  id: string
  taskId: string
  user: ProjectMember
  progress?: number
  content: string
  isBlocker: boolean
  blockerReason?: string
  createdAt: string
  taskTitle?: string
}

export interface ProjectTask {
  id: string
  projectId: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: ProjectMember
  dueDate?: string
  dueDateTimestamp?: number
  estimateHours?: number
  actualHours?: number
  evidenceStatus?: EvidenceStatus
  completedAt?: string
  lastActivityAt?: string
  tags?: string[]
  commentCount: number
  comments?: TaskComment[]
  evidence?: TaskEvidence[]
  reviews?: TaskReview[]
  workUpdates?: TaskWorkUpdate[]
  createdAt: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId?: string
  dueDate?: string
  estimateHours?: number
  tags?: string[]
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: string
  dueDate?: string
  estimateHours?: number
  actualHours?: number
  evidenceStatus?: EvidenceStatus
  tags?: string[]
}

export interface MemberAccountability {
  member: ProjectMember
  assigned: number
  completed: number
  onTime: number
  evidenceSubmitted: number
  evidenceVerified: number
  overdue: number
  blocked: number
  score: number
  scoreBreakdown: {
    completionScore: number
    onTimeScore: number
    evidenceScore: number
    penalty: number
  }
}

export interface ProjectAccountabilityData {
  projectId: string
  totalTasks: number
  completedTasks: number
  onTimeTasks: number
  verifiedEvidenceTasks: number
  submittedEvidenceTasks: number
  tasksAwaitingReview?: number
  tasksWithChangesRequested?: number
  overdueTasks: number
  blockedTasks: number
  overallScore: number
  scoreBreakdown: {
    completionScore: number
    onTimeScore: number
    evidenceScore: number
    penalty: number
  }
  members: MemberAccountability[]
  waitingVerificationTasks: {
    id: string
    title: string
    status: TaskStatus
    priority: TaskPriority
    assignee?: ProjectMember
    evidence?: TaskEvidence
    reviewsCount?: number
  }[]
  changesRequestedTasks?: {
    id: string
    title: string
    status: TaskStatus
    priority: TaskPriority
    assignee?: ProjectMember
    evidence?: TaskEvidence
    lastReview?: TaskReview
  }[]
  recentReviews?: (TaskReview & { taskId: string; taskTitle: string })[]
  recentWorkUpdates: TaskWorkUpdate[]
  connectedGitHubRepo?: ProjectGitHubRepo | null
  githubMetrics?: {
    verifiedCount: number
    pendingCount: number
    failedCount: number
    totalCount: number
    verificationRate: number
  }
}

export interface ProjectActivityItem {
  id: string
  projectId: string
  user: ProjectMember
  action: string
  target: string
  timestamp: string
  type:
    | 'task_created'
    | 'task_updated'
    | 'task_assigned'
    | 'status_changed'
    | 'priority_changed'
    | 'task_completed'
    | 'task_deleted'
    | 'comment_added'
    | 'member_added'
    | 'project_updated'
    | 'task_started'
    | 'work_update_added'
    | 'blocker_reported'
    | 'evidence_submitted'
    | 'evidence_verified'
    | 'evidence_rejected'
    | 'review_requested'
    | 'review_started'
    | 'changes_requested'
    | 'evidence_resubmitted'
    | 'evidence_approved'
    | 'github_pr_linked'
    | 'github_commit_linked'
    | 'github_repo_connected'
    | 'github_repo_disconnected'
    | 'github_verification_succeeded'
    | 'github_verification_failed'
}

export interface ProjectFiltersState {
  search: string
  status: 'All' | ProjectStatus
  priority: 'All' | ProjectPriority
  sortBy: ProjectSortOption
  viewMode: ProjectViewMode
}

export interface CreateProjectInput {
  name: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  startDate: string
  dueDate: string
  members: ProjectMember[]
  tags: string[]
}

export interface ScoreComponentDetail {
  score: number
  max: number
  explanation: string
}

export interface AccountabilityScoreBreakdown {
  taskCompletion: ScoreComponentDetail
  onTimeDelivery: ScoreComponentDetail
  reviewQuality: ScoreComponentDetail
  githubEvidence: ScoreComponentDetail
  workUpdates: ScoreComponentDetail
  penalties: {
    score: number
    max: number
    explanation: string
  }
}

export interface AttentionItem {
  id: string
  type:
    | 'TASK_OVERDUE'
    | 'TASK_STUCK'
    | 'REVIEW_BOTTLENECK'
    | 'REPEATED_CHANGES'
    | 'MISSING_GITHUB_EVIDENCE'
    | 'GITHUB_VERIFICATION_FAILED'
    | 'MEMBER_OVERLOADED'
    | 'PROJECT_DEADLINE_RISK'
  severity: 'high' | 'medium' | 'low'
  title: string
  description: string
  taskId?: string
  projectId?: string
  memberId?: string
  memberName?: string
  createdAt: string
}

export interface TeamPerformanceMember {
  member: {
    id: string
    name: string
    email: string
    avatar?: string | null
    role?: string
  }
  assignedTasks: number
  completedTasks: number
  inProgressTasks: number
  overdueTasks: number
  inReviewTasks: number
  approvedTasks: number
  changesRequestedTasks: number
  githubEvidenceSubmitted: number
  githubEvidenceVerified: number
  githubVerificationRate: number
  averageCompletionTimeHours: number
  accountabilityScore: number
  scoreBreakdown: AccountabilityScoreBreakdown
  attentionFlags: string[]
}

export interface TeamPerformanceOverview {
  teamAccountabilityScore: number
  tasksCompleted: number
  tasksTotal: number
  tasksOverdue: number
  githubVerificationRate: number
  reviewApprovalRate: number
}

export interface TeamPerformanceData {
  overview: TeamPerformanceOverview
  members: TeamPerformanceMember[]
  attentionItems: AttentionItem[]
}

export interface MemberScorecardData {
  member: {
    id: string
    name: string
    email: string
    avatar?: string | null
    role?: string
  }
  accountabilityScore: number
  scoreBreakdown: AccountabilityScoreBreakdown
  metrics: {
    assignedTasks: number
    completedTasks: number
    inProgressTasks: number
    inReviewTasks: number
    overdueTasks: number
    onTimeTasks: number
    approvedReviews: number
    changesRequestedReviews: number
    githubSubmitted: number
    githubVerified: number
    githubVerificationRate: number
    averageCompletionTimeHours: number
  }
  currentWork: {
    id: string
    title: string
    status: TaskStatus
    priority: TaskPriority
    dueDate?: string | null
    evidenceStatus: EvidenceStatus
    updatedAt: string
    workUpdatesCount: number
    lastWorkUpdate?: any
  }[]
  reviewHistory: {
    id: string
    taskId: string
    taskTitle: string
    decision: string
    comment?: string | null
    reviewer: {
      id: string
      name: string
      avatar?: string | null
    }
    createdAt: string
  }[]
  githubContributions: {
    id: string
    taskId: string
    taskTitle: string
    repoName: string
    branch?: string | null
    prUrl?: string | null
    prNumber?: number | null
    prTitle?: string | null
    commitUrl?: string | null
    commitSha?: string | null
    commitMessage?: string | null
    verificationStatus: string
    additions?: number | null
    deletions?: number | null
    changedFilesCount?: number | null
    createdAt: string
  }[]
  timeline: {
    id: string
    action: string
    target: string
    type: string
    projectName?: string
    createdAt: string
  }[]
}

export interface ProjectAnalyticsData {
  projectId: string
  projectName: string
  projectStatus: string
  dueDate?: string | null
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  reviewTasks: number
  changesRequestedTasks: number
  overdueTasks: number
  completionPercentage: number
  averageTaskCompletionHours: number
  totalEstimatedEffortHours: number
  completedEstimatedEffortHours: number
  githubEvidenceCount: number
  verifiedGithubEvidenceCount: number
  githubVerificationRate: number
  reviewCount: number
  approvedReviewCount: number
  changesRequestedReviewCount: number
  reviewApprovalRate: number
  changesRequestedRate: number
  averageReviewTurnaroundHours: number
  overallTeamScore: number
  scoreBreakdown: AccountabilityScoreBreakdown
  attentionItems: AttentionItem[]
  timeline: {
    id: string
    action: string
    target: string
    type: string
    user: {
      id: string
      name: string
      email: string
      avatar?: string | null
    }
    createdAt: string
  }[]
  connectedGitHubRepo?: ProjectGitHubRepo | null
}
