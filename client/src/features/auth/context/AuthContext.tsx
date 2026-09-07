import * as React from 'react'
import { authApi, LoginCredentials, RegisterData, AuthUser } from '@/lib/api'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Restore authenticated session on application startup
  React.useEffect(() => {
    let isMounted = true

    authApi
      .getMe()
      .then((data) => {
        if (isMounted) {
          setUser(data.user)
        }
      })
      .catch(() => {
        if (isMounted) {
          setUser(null)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const refreshUser = React.useCallback(async () => {
    try {
      const data = await authApi.getMe()
      setUser(data.user)
    } catch {
      setUser(null)
    }
  }, [])

  const login = React.useCallback(async (credentials: LoginCredentials) => {
    const data = await authApi.login(credentials)
    setUser(data.user)
  }, [])

  const register = React.useCallback(async (data: RegisterData) => {
    const res = await authApi.register(data)
    setUser(res.user)
  }, [])

  const logout = React.useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
    }
  }, [])

  const value = React.useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
