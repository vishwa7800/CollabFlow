import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
  description?: React.ReactNode
  error?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      error,
      id,
      checked,
      disabled,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const checkboxId = id || generatedId

    return (
      <div className="flex flex-col gap-1 text-left">
        <label
          htmlFor={checkboxId}
          className={cn(
            'flex items-start gap-3 select-none cursor-pointer',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              type="checkbox"
              id={checkboxId}
              ref={ref}
              checked={checked}
              disabled={disabled}
              onChange={onChange}
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                'h-4 w-4 shrink-0 rounded border transition-all duration-150',
                'border-slate-700 bg-slate-900',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-slate-950',
                'peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:text-white',
                'flex items-center justify-center',
                error && 'border-red-500',
                className
              )}
            >
              <Check className="h-3 w-3 opacity-0 transition-opacity peer-checked:opacity-100 stroke-[3]" />
            </div>
          </div>
          {(label || description) && (
            <div className="flex flex-col">
              {label && (
                <span className="text-sm font-medium text-slate-200 leading-tight">
                  {label}
                </span>
              )}
              {description && (
                <span className="text-xs text-slate-400 mt-0.5">
                  {description}
                </span>
              )}
            </div>
          )}
        </label>
        {error && <p className="text-xs text-red-400 ml-7">{error}</p>}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
