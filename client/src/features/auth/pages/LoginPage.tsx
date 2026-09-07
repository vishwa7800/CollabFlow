import * as React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, Button, Input, Checkbox } from '@/components/ui'
import {
  AuthHeader,
  PasswordInput,
  AuthErrorAlert,
  ForgotPasswordModal,
} from '@/features/auth/components'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { LogIn, ArrowRight } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [rememberMe, setRememberMe] = React.useState(false)

  // Validation errors
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({})
  const [authError, setAuthError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [forgotPasswordOpen, setForgotPasswordOpen] = React.useState(false)

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required.'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address.'
      }
    }

    if (!password) {
      newErrors.password = 'Password is required.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await login({
        email: email.trim(),
        password,
      })

      // Navigate to intended destination or default to app dashboard
      const destination =
        (location.state as { from?: { pathname?: string } })?.from?.pathname || '/app/dashboard'
      navigate(destination, { replace: true })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : (err as { message?: string })?.message || 'Invalid email or password.'
      setAuthError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className="border-slate-800/90 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
        <CardContent className="p-6 sm:p-8">
          {/* Header */}
          <AuthHeader
            title="Welcome back"
            subtitle="Sign in to continue to your project workspace."
          />

          {/* Form-Level Error Alert Banner */}
          <AuthErrorAlert
            message={authError}
            onClear={() => setAuthError(null)}
          />

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
            <Input
              label="Work Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              error={errors.email}
              autoComplete="email"
              required
              disabled={isLoading}
            />

            <div className="space-y-1">
              <PasswordInput
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                }}
                error={errors.password}
                autoComplete="current-password"
                required
                disabled={isLoading}
              />
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between pt-1">
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-xs font-medium text-blue-400 hover:text-blue-300 focus:outline-none focus:underline transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isLoading}
                rightIcon={<LogIn className="h-4 w-4" />}
              >
                Sign in
              </Button>
            </div>
          </form>

          {/* Switch to Signup */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
            <span>Don't have an account? </span>
            <Link
              to="/signup"
              className="font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors inline-flex items-center gap-1"
            >
              <span>Create one</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Forgot Password Dialog */}
      <ForgotPasswordModal
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
        defaultEmail={email}
      />
    </>
  )
}
