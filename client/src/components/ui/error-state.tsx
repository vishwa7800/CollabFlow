import * as React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title?: string
  description?: string
  onRetry?: () => void
  retryText?: string
  isRetrying?: boolean
}

export function ErrorState({
  className,
  icon,
  title = 'Something went wrong',
  description = 'An error occurred while loading this content. Please try again.',
  onRetry,
  retryText = 'Try Again',
  isRetrying = false,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-red-900/30 bg-red-950/10 p-8 text-center animate-in fade-in-50 duration-200',
        className
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-950/60 text-red-400 mb-4 border border-red-800/40">
        {icon || <AlertTriangle className="h-6 w-6" />}
      </div>
      <h3 className="text-base font-semibold text-white tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-xs text-slate-400 leading-relaxed">
          {description}
        </p>
      )}
      {onRetry && (
        <div className="mt-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            isLoading={isRetrying}
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          >
            {retryText}
          </Button>
        </div>
      )}
    </div>
  )
}
