import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "default" | "card" | "circle";
}

export function Skeleton({
  className,
  variant = "default",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted/50 dark:bg-muted-dark/50 rounded-md",
        {
          "rounded-full": variant === "circle",
          "rounded-xl border-2 border-muted/30 dark:border-muted-dark/30": variant === "card",
        },
        className
      )}
      {...props}
    />
  );
} 