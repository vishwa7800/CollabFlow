import * as React from 'react'
import { Input, type InputProps } from '@/components/ui'
import { Eye, EyeOff } from 'lucide-react'

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {
  showToggle?: boolean
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showToggle = true, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        disabled={disabled}
        rightIcon={
          showToggle ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              className="rounded p-1 text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:pointer-events-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          ) : undefined
        }
        {...props}
      />
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
