import * as React from 'react'
import { AuthUser, LoginCredentials, RegisterData } from '@/lib/api'

export interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)
