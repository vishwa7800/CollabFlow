import { apiClient } from './client'
import {
  TeamPerformanceData,
  MemberScorecardData,
  ProjectAnalyticsData,
  TeamPerformanceMember,
} from '@/features/projects/types'

export const analyticsApi = {
  /**
   * Fetches workspace-wide team performance metrics, overview cards, and attention items.
   */
  getTeamPerformance: async (): Promise<TeamPerformanceData> => {
    const res = await apiClient.get<{ data: TeamPerformanceData }>('/team/performance')
    return res.data
  },

  /**
   * Fetches individual member scorecard including metrics, score breakdown, current work, review history, and GitHub contributions.
   */
  getMemberPerformance: async (memberId: string): Promise<MemberScorecardData> => {
    const res = await apiClient.get<{ data: MemberScorecardData }>(
      `/team/members/${memberId}/performance`
    )
    return res.data
  },

  /**
   * Fetches chronological member activity events.
   */
  getMemberActivity: async (memberId: string): Promise<any[]> => {
    const res = await apiClient.get<{ data: any[] }>(`/team/members/${memberId}/activity`)
    return res.data
  },

  /**
   * Fetches complete project-level analytics, task breakdowns, turnaround times, and attention items.
   */
  getProjectAnalytics: async (projectId: string): Promise<ProjectAnalyticsData> => {
    const res = await apiClient.get<{ data: ProjectAnalyticsData }>(
      `/projects/${projectId}/analytics`
    )
    return res.data
  },

  /**
   * Fetches project-scoped team member performance rankings and scores.
   */
  getProjectTeamPerformance: async (
    projectId: string
  ): Promise<{ projectId: string; projectName: string; members: TeamPerformanceMember[] }> => {
    const res = await apiClient.get<{
      data: { projectId: string; projectName: string; members: TeamPerformanceMember[] }
    }>(`/projects/${projectId}/team-performance`)
    return res.data
  },
}
