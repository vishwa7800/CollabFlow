export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  error?: string
}

export interface ApiError {
  message: string
  status?: number
  details?: unknown
}

export interface HealthCheckResponse {
  status: 'ok' | 'error'
  timestamp: string
  uptime?: number
  environment?: string
}
