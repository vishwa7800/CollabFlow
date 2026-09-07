import { apiClient } from './client'
import {
  TaskWorkUpdate,
  TaskEvidence,
  TaskReview,
  ProjectAccountabilityData,
  EvidenceStatus,
  ReviewDecision,
} from '@/features/projects/types'

function mapEvidenceStatus(status: string): EvidenceStatus {
  switch (status) {
    case 'NOT_STARTED':
      return 'Not Started'
    case 'IN_PROGRESS':
      return 'In Progress'
    case 'EVIDENCE_SUBMITTED':
      return 'Evidence Submitted'
    case 'CHANGES_REQUESTED':
      return 'Changes Requested'
    case 'VERIFIED':
      return 'Verified'
    case 'COMPLETED':
      return 'Completed'
    case 'BLOCKED':
      return 'Blocked'
    default:
      return 'Not Started'
  }
}

export const accountabilityApi = {
  startTask: async (taskId: string) => {
    const res = await apiClient.post<{ data: any }>(`/tasks/${taskId}/start`)
    return res.data
  },

  addWorkUpdate: async (
    taskId: string,
    data: { content: string; progress?: number; isBlocker?: boolean; blockerReason?: string }
  ) => {
    const res = await apiClient.post<{ data: any }>(`/tasks/${taskId}/work-updates`, data)
    return res.data
  },

  getWorkUpdates: async (taskId: string): Promise<TaskWorkUpdate[]> => {
    const res = await apiClient.get<{ data: any[] }>(`/tasks/${taskId}/work-updates`)
    return (res.data || []).map((u) => ({
      id: u.id,
      taskId: u.taskId,
      user: {
        id: u.user.id,
        name: u.user.name,
        email: u.user.email,
        avatar: u.user.avatar,
      },
      progress: u.progress,
      content: u.content,
      isBlocker: u.isBlocker,
      blockerReason: u.blockerReason,
      createdAt: new Date(u.createdAt).toLocaleDateString(),
    }))
  },

  submitEvidence: async (
    taskId: string,
    data: {
      description: string
      github?: {
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
      }
    }
  ) => {
    const res = await apiClient.post<{ data: any }>(`/tasks/${taskId}/evidence`, data)
    return res.data
  },

  resubmitEvidence: async (
    taskId: string,
    data: {
      description: string
      github?: {
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
      }
    }
  ) => {
    const res = await apiClient.post<{ data: any }>(`/tasks/${taskId}/evidence/resubmit`, data)
    return res.data
  },

  getTaskEvidence: async (taskId: string): Promise<TaskEvidence[]> => {
    const res = await apiClient.get<{ data: any[] }>(`/tasks/${taskId}/evidence`)
    return (res.data || []).map((e) => ({
      id: e.id,
      taskId: e.taskId,
      submittedBy: {
        id: e.submittedBy.id,
        name: e.submittedBy.name,
        email: e.submittedBy.email,
        avatar: e.submittedBy.avatar,
      },
      description: e.description,
      status: mapEvidenceStatus(e.status),
      verifiedBy: e.verifiedBy
        ? {
            id: e.verifiedBy.id,
            name: e.verifiedBy.name,
            email: e.verifiedBy.email,
            avatar: e.verifiedBy.avatar,
          }
        : undefined,
      verifiedAt: e.verifiedAt ? new Date(e.verifiedAt).toLocaleDateString() : undefined,
      feedback: e.feedback,
      reviews: (e.reviews || []).map((r: any) => ({
        id: r.id,
        taskId: r.taskId,
        evidenceId: r.evidenceId,
        reviewer: {
          id: r.reviewer.id,
          name: r.reviewer.name,
          email: r.reviewer.email,
          avatar: r.reviewer.avatar,
        },
        decision: r.decision as ReviewDecision,
        comment: r.comment,
        createdAt: new Date(r.createdAt).toLocaleString(),
      })),
      githubLinks: e.githubLinks || [],
      createdAt: new Date(e.createdAt).toLocaleDateString(),
    }))
  },

  reviewEvidence: async (
    evidenceId: string,
    decision: ReviewDecision,
    comment?: string
  ) => {
    const res = await apiClient.post<{ data: any }>(`/evidence/${evidenceId}/reviews`, {
      decision,
      comment,
    })
    return res.data
  },

  getTaskReviews: async (taskId: string): Promise<TaskReview[]> => {
    const res = await apiClient.get<{ data: any[] }>(`/tasks/${taskId}/reviews`)
    return (res.data || []).map((r) => ({
      id: r.id,
      taskId: r.taskId,
      evidenceId: r.evidenceId,
      reviewer: {
        id: r.reviewer.id,
        name: r.reviewer.name,
        email: r.reviewer.email,
        avatar: r.reviewer.avatar,
      },
      decision: r.decision as ReviewDecision,
      comment: r.comment,
      createdAt: new Date(r.createdAt).toLocaleString(),
    }))
  },

  verifyEvidence: async (evidenceId: string, feedback?: string) => {
    const res = await apiClient.post<{ data: any }>(`/evidence/${evidenceId}/verify`, { feedback })
    return res.data
  },

  rejectEvidence: async (evidenceId: string, feedback: string) => {
    const res = await apiClient.post<{ data: any }>(`/evidence/${evidenceId}/reject`, { feedback })
    return res.data
  },

  getProjectAccountability: async (projectId: string): Promise<ProjectAccountabilityData> => {
    const res = await apiClient.get<{ data: any }>(`/projects/${projectId}/accountability`)
    const d = res.data
    return {
      projectId: d.projectId,
      totalTasks: d.totalTasks,
      completedTasks: d.completedTasks,
      onTimeTasks: d.onTimeTasks,
      verifiedEvidenceTasks: d.verifiedEvidenceTasks,
      submittedEvidenceTasks: d.submittedEvidenceTasks,
      tasksAwaitingReview: d.tasksAwaitingReview ?? d.submittedEvidenceTasks,
      tasksWithChangesRequested: d.tasksWithChangesRequested ?? 0,
      overdueTasks: d.overdueTasks,
      blockedTasks: d.blockedTasks,
      overallScore: d.overallScore,
      scoreBreakdown: d.scoreBreakdown,
      members: d.members || [],
      waitingVerificationTasks: (d.waitingVerificationTasks || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        status: t.status === 'DONE' ? 'Done' : t.status === 'REVIEW' ? 'Review' : 'In Progress',
        priority: t.priority === 'HIGH' ? 'High' : t.priority === 'LOW' ? 'Low' : 'Medium',
        assignee: t.assignee,
        reviewsCount: t.reviewsCount,
        evidence: t.evidence
          ? {
              id: t.evidence.id,
              taskId: t.id,
              submittedBy: t.evidence.submittedBy || t.assignee,
              description: t.evidence.description || '',
              status: mapEvidenceStatus(t.evidence.status || 'EVIDENCE_SUBMITTED'),
              githubLinks: t.evidence.githubLinks || [],
              createdAt: t.evidence.createdAt
                ? new Date(t.evidence.createdAt).toLocaleDateString()
                : '',
            }
          : undefined,
      })),
      changesRequestedTasks: (d.changesRequestedTasks || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        status: t.status === 'DONE' ? 'Done' : t.status === 'REVIEW' ? 'Review' : 'In Progress',
        priority: t.priority === 'HIGH' ? 'High' : t.priority === 'LOW' ? 'Low' : 'Medium',
        assignee: t.assignee,
        evidence: t.evidence
          ? {
              id: t.evidence.id,
              taskId: t.id,
              submittedBy: t.evidence.submittedBy || t.assignee,
              description: t.evidence.description || '',
              status: mapEvidenceStatus(t.evidence.status || 'CHANGES_REQUESTED'),
              githubLinks: t.evidence.githubLinks || [],
              createdAt: t.evidence.createdAt
                ? new Date(t.evidence.createdAt).toLocaleDateString()
                : '',
            }
          : undefined,
        lastReview: t.lastReview
          ? {
              id: t.lastReview.id,
              taskId: t.lastReview.taskId,
              evidenceId: t.lastReview.evidenceId,
              reviewer: t.lastReview.reviewer,
              decision: t.lastReview.decision,
              comment: t.lastReview.comment,
              createdAt: new Date(t.lastReview.createdAt).toLocaleString(),
            }
          : undefined,
      })),
      recentReviews: (d.recentReviews || []).map((r: any) => ({
        id: r.id,
        taskId: r.taskId,
        taskTitle: r.taskTitle,
        evidenceId: r.evidenceId,
        reviewer: r.reviewer,
        decision: r.decision,
        comment: r.comment,
        createdAt: new Date(r.createdAt).toLocaleString(),
      })),
      recentWorkUpdates: (d.recentWorkUpdates || []).map((u: any) => ({
        id: u.id,
        taskId: u.taskId,
        taskTitle: u.taskTitle,
        user: u.user,
        progress: u.progress,
        content: u.content,
        isBlocker: u.isBlocker,
        blockerReason: u.blockerReason,
        createdAt: new Date(u.createdAt).toLocaleDateString(),
      })),
      connectedGitHubRepo: d.connectedGitHubRepo || null,
      githubMetrics: d.githubMetrics || undefined,
    }
  },
}
