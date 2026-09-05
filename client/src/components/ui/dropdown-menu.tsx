import * as React from 'react'
import { cn } from '@/lib/utils'

interface DropdownContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownContext = React.createContext<DropdownContextType | null>(null)

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={menuRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export function DropdownMenuTrigger({
  children,
  asChild: _asChild,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const context = React.useContext(DropdownContext)
  if (!context) throw new Error('DropdownMenuTrigger must be inside DropdownMenu')

  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      aria-expanded={context.open}
      className={cn('inline-flex items-center justify-center', className)}
      {...props}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({
  className,
  align = 'right',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { align?: 'left' | 'right' }) {
  const context = React.useContext(DropdownContext)
  if (!context || !context.open) return null

  return (
    <div
      role="menu"
      className={cn(
        'absolute z-50 mt-2 min-w-[12rem] rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-200 shadow-xl duration-150 animate-in fade-in-50 zoom-in-95',
        align === 'right' ? 'right-0' : 'left-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({
  className,
  destructive = false,
  disabled = false,
  icon,
  onClick,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  destructive?: boolean
  disabled?: boolean
  icon?: React.ReactNode
}) {
  const context = React.useContext(DropdownContext)

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={(e) => {
        if (disabled) return
        onClick?.(e)
        context?.setOpen(false)
      }}
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors select-none text-left',
        destructive
          ? 'text-red-400 hover:bg-red-950/50 hover:text-red-300'
          : 'text-slate-200 hover:bg-slate-800 hover:text-white',
        disabled && 'pointer-events-none opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
      <span className="flex-1">{children}</span>
    </button>
  )
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn('my-1 h-[1px] bg-slate-800', className)} />
}

export function DropdownMenuLabel({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider', className)}>
      {children}
    </div>
  )
}
