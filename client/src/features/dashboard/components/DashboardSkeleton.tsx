import { Skeleton, Card } from '@/components/ui'

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 text-left">
      {/* Greeting Skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-3">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-64 h-8" />
        <Skeleton className="w-full max-w-xl h-4" />
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="w-24 h-3" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
            <Skeleton className="w-16 h-7" />
            <Skeleton className="w-28 h-3" />
          </Card>
        ))}
      </div>

      {/* Projects Overview Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="w-36 h-5" />
          <Skeleton className="w-16 h-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="border-slate-800 bg-slate-900/40 p-5 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="w-48 h-5" />
                <Skeleton className="w-16 h-5 rounded-full" />
              </div>
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-full h-2 rounded-full" />
              <div className="flex justify-between pt-2 border-t border-slate-800">
                <Skeleton className="w-24 h-3" />
                <Skeleton className="w-6 h-6 rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-800 bg-slate-900/40 p-5 space-y-3">
          <Skeleton className="w-32 h-5 mb-4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between py-2 border-b border-slate-800/60">
              <Skeleton className="w-44 h-4" />
              <Skeleton className="w-14 h-4 rounded" />
            </div>
          ))}
        </Card>
        <Card className="border-slate-800 bg-slate-900/40 p-5 space-y-3">
          <Skeleton className="w-32 h-5 mb-4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 py-2 border-b border-slate-800/60">
              <Skeleton className="w-7 h-7 rounded-full shrink-0" />
              <div className="space-y-1 flex-1">
                <Skeleton className="w-3/4 h-3" />
                <Skeleton className="w-1/4 h-2" />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
