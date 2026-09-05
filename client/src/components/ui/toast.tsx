import * as React from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToastContext, type ToastItem } from './use-toast'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback(
    ({ title, description, variant = 'default', duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: ToastItem = { id, title, description, variant, duration }

      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id)
        }, duration)
      }
    },
    [dismiss]
  )

  const icons = {
    default: <Info className="h-4 w-4 text-slate-400" />,
    success: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-400" />,
    destructive: <AlertCircle className="h-4 w-4 text-red-400" />,
    info: <Info className="h-4 w-4 text-blue-400" />,
  }

  const borderStyles = {
    default: 'border-slate-800 bg-slate-900/95 text-slate-100',
    success: 'border-emerald-800/60 bg-slate-900/95 text-slate-100',
    warning: 'border-amber-800/60 bg-slate-900/95 text-slate-100',
    destructive: 'border-red-800/60 bg-slate-900/95 text-slate-100',
    info: 'border-blue-800/60 bg-slate-900/95 text-slate-100',
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-200',
              borderStyles[t.variant || 'default']
            )}
          >
            <div className="shrink-0 mt-0.5">{icons[t.variant || 'default']}</div>
            <div className="flex-1 text-left space-y-0.5">
              <h4 className="text-xs font-semibold leading-tight">{t.title}</h4>
              {t.description && (
                <p className="text-xs text-slate-400 leading-snug">{t.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="shrink-0 rounded p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
