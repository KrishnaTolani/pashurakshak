'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function RequestsPage() {
    return (
        <ProtectedRoute type="ngo">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-theme-nature via-primary-dark to-theme-heart bg-clip-text text-transparent">
                        Rescue Requests
                    </h1>
                </div>

                <div className="card dark:bg-gradient-to-br dark:from-card-dark dark:to-card-dark/90 hover-lift">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-medium text-foreground dark:text-foreground-dark">
                            Incoming Requests
                        </h2>
                        <p className="text-sm text-muted-foreground dark:text-foreground-dark/60">
                            Request management system coming soon. Here&apos;s where you&apos;ll
                            manage all rescue requests:
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground dark:text-foreground-dark/60 space-y-1 ml-4">
                            <li>View and manage incoming rescue requests</li>
                            <li>Assign volunteers to rescue missions</li>
                            <li>Track rescue progress in real-time</li>
                            <li>Coordinate with veterinary services</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
