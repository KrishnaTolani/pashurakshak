'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isNgoAuthenticated } from '@/utils/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  type: 'admin' | 'ngo';
}

export function ProtectedRoute({ children, type }: ProtectedRouteProps) {
  const router = useRouter();
  
  useEffect(() => {
    // Check authorization
    const checkAuth = async () => {
      if (type === 'admin' && !isAuthenticated()) {
        // Redirect to admin login
        router.push('/admin/login');
      } else if (type === 'ngo' && !isNgoAuthenticated()) {
        // Redirect to NGO login
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router, type]);

  return <>{children}</>;
} 