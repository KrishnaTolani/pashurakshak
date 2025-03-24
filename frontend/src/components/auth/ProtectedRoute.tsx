'use client';

import { useEffect, ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isNgoAuthenticated } from '@/utils/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  type: 'admin' | 'ngo';
  fallback?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  type, 
  fallback = <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-nature"></div>
  </div> 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check authorization
    const checkAuth = async () => {
      try {
        let authorized = false;

        if (type === 'admin') {
          authorized = isAuthenticated();
          if (!authorized) {
            console.log('Admin authentication failed, redirecting to admin login');
            router.push('/admin/login');
          }
        } else if (type === 'ngo') {
          authorized = isNgoAuthenticated();
          if (!authorized) {
            console.log('NGO authentication failed, redirecting to login');
            router.push('/login');
          }
        }

        setIsAuthorized(authorized);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthorized(false);
        // Default to NGO login if there's an error, unless explicitly on admin route
        if (type === 'admin') {
          router.push('/admin/login');
        } else {
          router.push('/login');
        }
      }
    };
    
    checkAuth();
  }, [router, type]);

  // Show nothing while checking auth status
  if (isAuthorized === null) {
    return <>{fallback}</>;
  }

  // If authorized, render children
  return isAuthorized ? <>{children}</> : <>{fallback}</>;
} 