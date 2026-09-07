import { apiClient } from './client'
import type { ApiResponse } from '@/types'

export interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string | null
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: AuthUser
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
    if (!response.data) {
      throw new Error('Authentication failed: Missing response data.')
    }
    return response.data
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data)
    if (!response.data) {
      throw new Error('Registration failed: Missing response data.')
    }
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post<ApiResponse<{ message: string }>>('/auth/logout')
  },

  getMe: async (): Promise<AuthResponse> => {
    const response = await apiClient.get<ApiResponse<AuthResponse>>('/auth/me')
    if (!response.data) {
      throw new Error('Session retrieval failed.')
    }
    return response.data
  },
}
