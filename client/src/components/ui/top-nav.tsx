import * as React from 'react'
import { Bell } from 'lucide-react'
import { Avatar } from './avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './dropdown-menu'
import { cn } from '@/lib/utils'

export interface TopNavProps {
  title?: React.ReactNode
  breadcrumbs?: React.ReactNode
  actions?: React.ReactNode
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onSignOut?: () => void
  notificationsCount?: number
  className?: string
}

export function TopNav({
  title,
  breadcrumbs,
  actions,
  user = { name: 'Vishwa Patel', email: 'vishwa@collabflow.dev' },
  onSignOut,
  notificationsCount = 0,
  className,
}: TopNavProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 backdrop-blur-md',
        className
      )}
    >
      {/* Title & Breadcrumbs */}
      <div className="flex items-center gap-4 pl-10 md:pl-0">
        {breadcrumbs ? (
          breadcrumbs
        ) : typeof title === 'string' ? (
          <h1 className="text-base font-semibold text-white tracking-tight">
            {title}
          </h1>
        ) : (
          title
        )}
      </div>

      {/* Actions & User Menu */}
      <div className="flex items-center gap-3">
        {actions && <div className="flex items-center gap-2">{actions}</div>}

        {/* Notifications Icon Button */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {notificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              {notificationsCount}
            </span>
          )}
        </button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Avatar name={user.name} src={user.avatar} size="sm" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="right">
            <DropdownMenuLabel>
              <p className="font-semibold text-white normal-case">{user.name}</p>
              <p className="text-[11px] font-normal text-slate-400 normal-case truncate max-w-[180px]">
                {user.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {}}>Account Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>Theme Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              destructive
              onClick={() => onSignOut?.()}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
