import { AlertCircle, X } from 'lucide-react'

export interface AuthErrorAlertProps {
  message: string | null
  onClear?: () => void
}

export function AuthErrorAlert({ message, onClear }: AuthErrorAlertProps) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="flex items-start justify-between gap-3 rounded-lg border border-red-900/60 bg-red-950/40 p-3.5 text-xs text-red-200 shadow-sm animate-in fade-in-50 duration-150 mb-5"
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
        <span className="leading-snug">{message}</span>
      </div>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 rounded p-0.5 text-red-400 hover:text-white hover:bg-red-900/50 transition-colors"
          aria-label="Dismiss error"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
