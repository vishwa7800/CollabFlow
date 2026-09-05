import * as React from 'react'
import { Bell, Check, Clock, MessageSquare, CheckSquare, Sparkles } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui'
import { cn } from '@/lib/utils'

export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  type: 'assignment' | 'comment' | 'status' | 'system'
  read: boolean
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'New task assigned',
    description: 'Sarah Connor assigned you "Configure PostgreSQL database migrations".',
    time: '5m ago',
    type: 'assignment',
    read: false,
  },
  {
    id: '2',
    title: 'New comment on task',
    description: 'Rahul Sharma commented on "Website Redesign & Launch".',
    time: '24m ago',
    type: 'comment',
    read: false,
  },
  {
    id: '3',
    title: 'Status changed',
    description: 'Alex Rivera moved "Implement payment webhook" to In Progress.',
    time: '1h ago',
    type: 'status',
    read: true,
  },
]

export function NotificationPopover() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'assignment':
        return <CheckSquare className="h-3.5 w-3.5 text-blue-400" />
      case 'comment':
        return <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
      case 'status':
        return <Clock className="h-3.5 w-3.5 text-amber-400" />
      default:
        return <Sparkles className="h-3.5 w-3.5 text-purple-400" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="right"
        className="w-80 sm:w-96 p-0 bg-slate-900 border-slate-800 shadow-2xl rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-blue-950 px-2 py-0.5 text-[10px] font-semibold text-blue-300 border border-blue-800/50">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              <Check className="h-3 w-3" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-800/60">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={cn(
                  'flex items-start gap-3 p-3.5 text-left transition-colors cursor-pointer hover:bg-slate-800/50',
                  !item.read ? 'bg-blue-950/20' : 'bg-transparent'
                )}
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800/90 border border-slate-700/60">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 space-y-0.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={cn(
                        'text-xs truncate',
                        !item.read
                          ? 'font-semibold text-white'
                          : 'font-medium text-slate-300'
                      )}
                    >
                      {item.title}
                    </p>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug line-clamp-2">
                    {item.description}
                  </p>
                </div>
                {!item.read && (
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800/80 px-4 py-2 bg-slate-950/40 text-center">
          <span className="text-[10px] text-slate-500">
            Simulated Notification UI — Phase 5 Application Shell
          </span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
