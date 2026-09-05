import { apiClient } from './client'
import type { HealthCheckResponse } from '@/types'

export const healthApi = {
  check: async (): Promise<HealthCheckResponse> => {
    return apiClient.get<HealthCheckResponse>('/health')
  },
}
