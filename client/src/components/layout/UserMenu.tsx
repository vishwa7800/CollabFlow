import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  Avatar,
  Badge,
} from '@/components/ui'
import { User, Settings, LogOut, Shield } from 'lucide-react'

export interface UserMenuProps {
  user?: {
    name: string
    email: string
    avatar?: string
    role?: string
  }
}

export function UserMenu({
  user = {
    name: 'Alex Morgan',
    email: 'alex@example.com',
    role: 'Owner',
  },
}: UserMenuProps) {
  const navigate = useNavigate()

  const handleSignOut = () => {
    // Navigate to login (real auth logout will be connected in Phase 14)
    navigate('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2.5 rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:opacity-90 transition-opacity"
        aria-label="Open user menu"
      >
        <Avatar name={user.name} src={user.avatar} size="sm" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="right" className="w-56">
        <DropdownMenuLabel>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white normal-case">{user.name}</p>
              {user.role && (
                <Badge variant="info" size="sm" className="py-0 px-1.5 text-[10px]">
                  {user.role}
                </Badge>
              )}
            </div>
            <p className="text-[11px] font-normal text-slate-400 normal-case truncate">
              {user.email}
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
