import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  primaryAction?: React.ReactNode
  secondaryActions?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  primaryAction,
  secondaryActions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-b border-slate-800/80 pb-5 md:flex-row md:items-center md:justify-between',
        className
      )}
      {...props}
    >
      <div className="space-y-1 text-left">
        {/* Breadcrumb Row */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-slate-400 mb-1"
          >
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <React.Fragment key={index}>
                  {item.href && !isLast ? (
                    <Link
                      to={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        isLast ? 'text-slate-200 font-medium' : 'text-slate-400'
                      )}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                  {!isLast && (
                    <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
                  )}
                </React.Fragment>
              )
            })}
          </nav>
        )}

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Action Area */}
      {(primaryAction || secondaryActions) && (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
          {secondaryActions}
          {primaryAction}
        </div>
      )}
    </div>
  )
}
