import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, Button, Input, Checkbox } from '@/components/ui'
import {
  AuthHeader,
  PasswordInput,
  AuthErrorAlert,
} from '@/features/auth/components'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { UserPlus, ArrowRight } from 'lucide-react'

export function SignupPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [agreeTerms, setAgreeTerms] = React.useState(false)

  // Validation errors
  const [errors, setErrors] = React.useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    terms?: string
  }>({})
  const [authError, setAuthError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!name.trim()) {
      newErrors.name = 'Full name is required.'
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.'
    }

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
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password.'
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the Terms of Service to create an account.'
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
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      })

      // Navigate to app dashboard after account creation
      navigate('/app/dashboard', { replace: true })
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message || 'Failed to create account.'
      setAuthError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-slate-800/90 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
      <CardContent className="p-6 sm:p-8">
        {/* Header */}
        <AuthHeader
          title="Create your account"
          subtitle="Get started with structured project collaboration for your team."
        />

        {/* Form-Level Error Alert Banner */}
        <AuthErrorAlert
          message={authError}
          onClear={() => setAuthError(null)}
        />

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
          <Input
            label="Full Name"
            placeholder="Alex Rivera"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value)
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
            }}
            error={errors.name}
            autoComplete="name"
            required
            disabled={isLoading}
          />

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

          <PasswordInput
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value)
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
            }}
            error={errors.password}
            helperText={!errors.password ? 'Must be at least 8 characters.' : undefined}
            autoComplete="new-password"
            required
            disabled={isLoading}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setConfirmPassword(e.target.value)
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
              }
            }}
            error={errors.confirmPassword}
            autoComplete="new-password"
            required
            disabled={isLoading}
          />

          {/* Terms Agreement */}
          <div className="pt-1">
            <Checkbox
              label={
                <span className="text-xs text-slate-300">
                  I agree to the{' '}
                  <span className="text-blue-400 hover:underline cursor-pointer">
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span className="text-blue-400 hover:underline cursor-pointer">
                    Privacy Policy
                  </span>
                  .
                </span>
              }
              checked={agreeTerms}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAgreeTerms(e.target.checked)
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }))
              }}
              error={errors.terms}
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<UserPlus className="h-4 w-4" />}
            >
              Create account
            </Button>
          </div>
        </form>

        {/* Switch to Login */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors inline-flex items-center gap-1"
          >
            <span>Sign in</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
