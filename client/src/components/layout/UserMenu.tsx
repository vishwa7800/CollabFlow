import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  Avatar,
} from '@/components/ui'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { User, Settings, LogOut, Shield } from 'lucide-react'

export function UserMenu() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const displayName = user?.name || 'Workspace User'
  const displayEmail = user?.email || 'user@collabflow.dev'
  const displayAvatar = user?.avatar || undefined

  const handleSignOut = async () => {
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2.5 rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:opacity-90 transition-opacity"
        aria-label="Open user menu"
      >
        <Avatar name={displayName} src={displayAvatar} size="sm" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="right" className="w-56">
        <DropdownMenuLabel>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white normal-case truncate">{displayName}</p>
            </div>
            <p className="text-[11px] font-normal text-slate-400 normal-case truncate">
              {displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          icon={<User className="h-3.5 w-3.5" />}
          onClick={() => navigate('/app/settings')}
        >
          My Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          icon={<Settings className="h-3.5 w-3.5" />}
          onClick={() => navigate('/app/settings')}
        >
          Workspace Settings
        </DropdownMenuItem>

        <DropdownMenuItem
          icon={<Shield className="h-3.5 w-3.5" />}
          onClick={() => navigate('/dev/design-system')}
        >
          UI System Showcase
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          destructive
          icon={<LogOut className="h-3.5 w-3.5" />}
          onClick={handleSignOut}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
