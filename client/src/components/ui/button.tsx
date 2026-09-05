import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]'

    const variantStyles = {
      primary:
        'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 shadow-sm hover:shadow shadow-blue-900/20 border border-blue-500/30',
      secondary:
        'bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-850 border border-slate-700/60 shadow-sm',
      outline:
        'border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800/80 hover:text-white hover:border-slate-600',
      ghost:
        'bg-transparent text-slate-300 hover:bg-slate-800/70 hover:text-white',
      destructive:
        'bg-red-600/90 text-white hover:bg-red-500 active:bg-red-700 shadow-sm shadow-red-950/40 border border-red-500/30',
    }

    const sizeStyles = {
      sm: 'h-8 px-3 text-xs font-medium',
      md: 'h-9 px-4 py-2 text-sm',
      lg: 'h-11 px-5 text-base',
      icon: 'h-9 w-9 p-0',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
