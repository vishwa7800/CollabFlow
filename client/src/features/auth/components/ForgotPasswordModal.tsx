import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
} from '@/components/ui'
import { KeyRound, CheckCircle2 } from 'lucide-react'

export interface ForgotPasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultEmail?: string
}

export function ForgotPasswordModal({
  open,
  onOpenChange,
  defaultEmail = '',
}: ForgotPasswordModalProps) {
  const [email, setEmail] = React.useState(defaultEmail)
  const [error, setError] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleClose = () => {
    onOpenChange(false)
    // Reset state on close
    setTimeout(() => {
      setError('')
      setSubmitted(false)
      setLoading(false)
    }, 200)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 800)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/40 mb-2">
            <KeyRound className="h-5 w-5" />
          </div>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            Enter the email associated with your CollabFlow account, and we’ll send you password recovery instructions.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-4 text-left space-y-3 animate-in fade-in-50">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Password recovery link dispatched</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If an account matches <strong className="text-white">{email}</strong>, you will receive an email with instructions to reset your password shortly.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={handleClose}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError('')
              }}
              error={error}
              autoFocus
              required
            />
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={loading}
              >
                Send recovery link
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
