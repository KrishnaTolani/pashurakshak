'use client';

import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isNgoAuthenticated } from '@/utils/auth';

// Higher Order Component for protecting routes
export function withAuth<P extends object>(Component: ComponentType<P>, type: 'admin' | 'ngo') {
    return function WithAuth(props: P) {
        const router = useRouter();

        useEffect(() => {
            const checkAuth = () => {
                if (type === 'admin' && !isAuthenticated()) {
                    router.push('/admin/login');
                } else if (type === 'ngo' && !isNgoAuthenticated()) {
                    router.push('/login');
                }
            };

            checkAuth();
        }, [router]);

        return <Component {...props} />;
    };
}

// Example usage:
// const ProtectedComponent = withAuth(MyComponent, 'admin');
