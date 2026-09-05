import { Skeleton, Card } from '@/components/ui'

export function ProjectWorkspaceSkeleton() {
  return (
    <div className="space-y-6 text-left">
      {/* Header Skeleton */}
      <div className="space-y-4 border-b border-slate-800 pb-5">
        <Skeleton className="w-48 h-4" />
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="w-80 h-7" />
            <Skeleton className="w-full max-w-lg h-4" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="w-24 h-8 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Progress Summary Skeleton */}
      <Card className="border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </Card>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <Skeleton className="w-20 h-8 rounded-lg" />
        <Skeleton className="w-20 h-8 rounded-lg" />
        <Skeleton className="w-20 h-8 rounded-lg" />
        <Skeleton className="w-20 h-8 rounded-lg" />
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-slate-800 bg-slate-900/30 p-4 space-y-3">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-full h-20 rounded-lg" />
            <Skeleton className="w-full h-20 rounded-lg" />
          </Card>
        ))}
      </div>
    </div>
  )
}
