import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info' | 'outline'
  size?: 'sm' | 'md'
  dot?: boolean
  pulseDot?: boolean
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  pulseDot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default:
      'bg-slate-800 text-slate-200 border-slate-700/80',
    secondary:
      'bg-slate-900/80 text-slate-300 border-slate-800',
    success:
      'bg-emerald-950/60 text-emerald-300 border-emerald-800/50',
    warning:
      'bg-amber-950/60 text-amber-300 border-amber-800/50',
    destructive:
      'bg-red-950/60 text-red-300 border-red-800/50',
    info:
      'bg-blue-950/60 text-blue-300 border-blue-800/50',
    outline:
      'bg-transparent text-slate-300 border-slate-700',
  }

  const dotColors = {
    default: 'bg-slate-400',
    secondary: 'bg-slate-500',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    destructive: 'bg-red-400',
    info: 'bg-blue-400',
    outline: 'bg-slate-400',
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] font-medium tracking-wide',
    md: 'px-2.5 py-1 text-xs font-medium',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border leading-none transition-colors select-none font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'inline-block h-1.5 w-1.5 rounded-full shrink-0',
            dotColors[variant],
            pulseDot && 'animate-pulse'
          )}
        />
      )}
      {children}
    </span>
  )
}
