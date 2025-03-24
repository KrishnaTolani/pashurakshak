'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { HeroUIProvider } from '@heroui/react';
import { useEffect } from 'react';
import { setNgoAuthToken } from '@/utils/auth';

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize authentication state
  useEffect(() => {
    // Check if we have a ngoToken in localStorage but not in cookie
    // This ensures middleware can access the token
    const syncTokens = () => {
      if (typeof window !== 'undefined') {
        const ngoToken = localStorage.getItem('ngoToken');
        if (ngoToken) {
          // Set the token to cookie for middleware access
          setNgoAuthToken(ngoToken);
        }
      }
    };
    
    syncTokens();
  }, []);
  
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <HeroUIProvider>
        {children}
      </HeroUIProvider>
    </NextThemesProvider>
  );
} 