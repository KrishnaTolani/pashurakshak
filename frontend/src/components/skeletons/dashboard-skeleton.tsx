import { Skeleton } from "@/components/ui/skeleton";

export function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 min-w-0">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="relative">
          <Skeleton variant="card" className="w-full h-[120px]" />
        </div>
      ))}
    </div>
  );
}

export function DashboardActivitySkeleton() {
  return (
    <div className="relative">
      <Skeleton variant="card" className="w-full">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Skeleton variant="circle" className="w-5 h-5" />
            <Skeleton className="h-6 w-32" />
          </div>
          
          {/* Activity Items */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton variant="circle" className="w-8 h-8" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Skeleton>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <DashboardStatsSkeleton />

      {/* Activity Section Skeleton */}
      <DashboardActivitySkeleton />
    </div>
  );
} 