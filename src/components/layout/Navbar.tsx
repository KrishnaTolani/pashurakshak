'use client';

import { useTheme } from 'next-themes';
import { Button } from '@heroui/react';
import { FiSun, FiMoon } from 'react-icons/fi';

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-0 w-full border-b border-gray-200 bg-white/75 dark:border-gray-800 dark:bg-gray-900/75 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold">Pashu Rakshak Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
} 