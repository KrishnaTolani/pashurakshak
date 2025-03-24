'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { HeroUIProvider } from '@heroui/react';
import { useEffect } from 'react';
import { setNgoAuthToken, setAuthToken } from '@/utils/auth';

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize authentication state
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