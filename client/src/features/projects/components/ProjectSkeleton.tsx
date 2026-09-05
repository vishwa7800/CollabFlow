import { Skeleton, Card } from '@/components/ui'
import { ProjectViewMode } from '../types'

export interface ProjectSkeletonProps {
  viewMode?: ProjectViewMode
}

export function ProjectSkeleton({ viewMode = 'grid' }: ProjectSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/40"
          >
            <div className="space-y-2 flex-1 max-w-md">
              <Skeleton className="w-48 h-5" />
              <Skeleton className="w-full h-3" />
            </div>
            <div className="flex items-center gap-6">
              <Skeleton className="w-24 h-3 hidden sm:block" />
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-14 h-7 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="border-slate-800 bg-slate-900/40 p-5 space-y-4 text-left">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Skeleton className="w-20 h-5 rounded-full" />
              <Skeleton className="w-16 h-5 rounded-full" />
            </div>
            <Skeleton className="w-24 h-3" />
          </div>

          <div className="space-y-2">
            <Skeleton className="w-3/4 h-5" />
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-4/5 h-3" />
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between">
              <Skeleton className="w-16 h-3" />
              <Skeleton className="w-8 h-3" />
            </div>
            <Skeleton className="w-full h-1.5 rounded-full" />
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-800">
            <Skeleton className="w-28 h-3" />
            <div className="flex -space-x-2">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="w-7 h-7 rounded-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
