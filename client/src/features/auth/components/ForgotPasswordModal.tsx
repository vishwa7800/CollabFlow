import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from '@/components/ui'
import { KeyRound, Info } from 'lucide-react'

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
  const handleClose = () => {
    onOpenChange(false)
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
            Password recovery and reset functionality.
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 text-left space-y-3">
          <div className="flex items-start gap-2.5 rounded-lg border border-amber-800/50 bg-amber-950/30 p-3 text-xs text-amber-300">
            <Info className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <p className="font-semibold text-amber-200">Email service not configured</p>
              <p className="text-amber-300/80">
                Self-service password reset via email dispatch is currently disabled in this environment.
                For development accounts, please contact your workspace owner or sign in with your designated credentials.
              </p>
            </div>
          </div>

          {defaultEmail && (
            <p className="text-xs text-slate-400">
              Account: <strong className="text-slate-200">{defaultEmail}</strong>
            </p>
          )}
        </div>

        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="w-full"
            onClick={handleClose}
          >
            Understood
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
