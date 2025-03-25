'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { HeroUIProvider } from '@heroui/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setNgoAuthToken, setAuthToken } from '@/utils/auth';

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    // Initialize authentication state and handle pending redirects
    useEffect(() => {
        // Sync tokens from localStorage to cookies for middleware access
        const syncTokens = () => {
            if (typeof window !== 'undefined') {
                // Sync NGO token
                const ngoToken = localStorage.getItem('ngoToken');
                if (ngoToken) {
                    setNgoAuthToken(ngoToken);
                }

                // Sync admin token
                const adminToken = localStorage.getItem('adminToken');
                if (adminToken) {
                    setAuthToken(adminToken);
                }

                // Handle any pending redirects
                const pendingRedirect = localStorage.getItem('pendingRedirect');
                if (pendingRedirect) {
                    console.log(`Found pending redirect to: ${pendingRedirect}`);

                    // Clear the pending redirect first to prevent loops
                    localStorage.removeItem('pendingRedirect');

                    // Prefetch and navigate
                    if (pendingRedirect === 'dashboard') {
                        console.log('Executing pending redirect to dashboard');
                        router.prefetch('/dashboard');

                        // Use setTimeout to ensure prefetching has a chance to complete
                        setTimeout(() => {
                            router.push('/dashboard');
                        }, 100);
                    }
                }
            }
        };

        syncTokens();
    }, [router]);

    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            <HeroUIProvider>{children}</HeroUIProvider>
        </NextThemesProvider>
    );
}
