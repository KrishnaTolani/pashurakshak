import { Skeleton } from "@/components/ui/skeleton";

interface CardSkeletonProps {
  variant?: "default" | "profile" | "stats";
  showFooter?: boolean;
}

export function CardSkeleton({
  variant = "default",
  showFooter = false,
}: CardSkeletonProps) {
  if (variant === "profile") {
    return (
      <Skeleton variant="card" className="w-full">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton variant="circle" className="w-16 h-16" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          {showFooter && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-muted-dark/30">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          )}
        </div>
      </Skeleton>
    );
  }

  if (variant === "stats") {
    return (
      <Skeleton variant="card" className="w-full">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton variant="circle" className="w-12 h-12" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </div>
      </Skeleton>
    );
  }

  return (
    <Skeleton variant="card" className="w-full">
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        {showFooter && (
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-muted-dark/30">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        )}
      </div>
    </Skeleton>
  );
} 