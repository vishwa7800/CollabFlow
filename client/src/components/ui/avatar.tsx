import * as React from 'react'
import { cn } from '@/lib/utils'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

function getInitials(name?: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getBgColorFromName(name?: string): string {
  if (!name) return 'bg-slate-700 text-slate-200'
  const colors = [
    'bg-blue-900/60 text-blue-200 border-blue-700/50',
    'bg-emerald-900/60 text-emerald-200 border-emerald-700/50',
    'bg-purple-900/60 text-purple-200 border-purple-700/50',
    'bg-amber-900/60 text-amber-200 border-amber-700/50',
    'bg-rose-900/60 text-rose-200 border-rose-700/50',
    'bg-cyan-900/60 text-cyan-200 border-cyan-700/50',
    'bg-indigo-900/60 text-indigo-200 border-indigo-700/50',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

export function Avatar({
  className,
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  const sizeStyles = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-11 w-11 text-base',
    xl: 'h-14 w-14 text-lg font-semibold',
  }

  const showImage = src && !imageError

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden border border-slate-800 font-medium select-none',
        sizeStyles[size],
        !showImage && getBgColorFromName(name || alt),
        className
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || name || 'User avatar'}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{getInitials(name || alt)}</span>
      )}
    </div>
  )
}
