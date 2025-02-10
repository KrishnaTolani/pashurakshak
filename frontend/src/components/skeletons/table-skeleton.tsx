import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  showHeader = true,
}: TableSkeletonProps) {
  return (
    <div className="w-full">
      <div className="rounded-xl border-2 border-gray-200 dark:border-muted-dark/30 overflow-hidden">
        {showHeader && (
          <div className="bg-gray-100 dark:bg-muted-dark/20 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-[250px]" />
                <Skeleton className="h-9 w-[100px]" />
              </div>
            </div>
          </div>
        )}
        
        <div className="divide-y divide-gray-200 dark:divide-muted-dark/30">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="flex items-center gap-4 p-4"
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="flex-1"
                >
                  <Skeleton
                    className={`h-4 ${
                      colIndex === columns - 1 ? "w-24" : "w-full"
                    }`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
      </div>

      {/* List */}
      <TableSkeleton />
    </div>
  );
} 