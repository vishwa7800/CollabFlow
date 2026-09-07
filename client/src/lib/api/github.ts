import { apiClient } from './client'
import { ProjectGitHubRepo } from '@/features/projects/types'

export const githubApi = {
  connectRepo: async (
    projectId: string,
    data: { repoUrl: string; defaultBranch?: string }
  ): Promise<ProjectGitHubRepo> => {
    const res = await apiClient.post<{ data: ProjectGitHubRepo }>(
      `/projects/${projectId}/github/connect`,
      data
    )
    return res.data
  },

  disconnectRepo: async (projectId: string): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.delete<{ message: string }>(
      `/projects/${projectId}/github/disconnect`
    )
    return { success: true, message: res.message }
  },

  getConnectedRepo: async (projectId: string): Promise<ProjectGitHubRepo | null> => {
    try {
      const res = await apiClient.get<{ data: ProjectGitHubRepo | null }>(
        `/projects/${projectId}/github/repo`
      )
      return res.data || null
    } catch {
      return null
    }
  },

  reverifyEvidence: async (evidenceId: string): Promise<any> => {
    const res = await apiClient.post<{ data: any }>(`/evidence/${evidenceId}/reverify`)
    return res.data
  },
}
