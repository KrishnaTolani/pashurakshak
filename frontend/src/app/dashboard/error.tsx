'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { PiWarningCircleFill } from 'react-icons/pi';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Dashboard error:', error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <PiWarningCircleFill className="h-16 w-16 text-theme-heart mb-6" />
            <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark mb-2">
                Something went wrong loading your dashboard
            </h2>
            <p className="text-muted-foreground dark:text-foreground-dark/60 max-w-md mb-8">
                {error.message ||
                    "We couldn't load your dashboard. This could be due to a network issue or a temporary server problem."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => reset()}
                    className="px-6 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-500 dark:bg-theme-heart dark:hover:bg-theme-heart/90 transition-all duration-200 font-medium ring-1 ring-primary-600/50 dark:ring-theme-heart/50"
                >
                    Try again
                </button>
                <Link
                    href="/dashboard"
                    className="px-6 py-2.5 rounded-lg bg-white text-primary-600 hover:bg-gray-50 dark:bg-card-dark dark:text-theme-heart dark:hover:bg-muted-dark transition-all duration-200 font-medium ring-1 ring-gray-200 dark:ring-border-dark"
                >
                    Reload Dashboard
                </Link>
            </div>
        </div>
    );
}
