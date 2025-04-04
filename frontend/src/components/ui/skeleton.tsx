import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    variant?: 'default' | 'card' | 'circle';
}

export function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse bg-gray-300/70 dark:bg-muted-dark/50 rounded-md',
                {
                    'rounded-full': variant === 'circle',
                    'rounded-xl border-2 border-gray-300 dark:border-muted-dark/30':
                        variant === 'card',
                },
                className
            )}
            {...props}
        />
    );
}
