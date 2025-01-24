'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { RiSunLine, RiMoonClearLine } from 'react-icons/ri';

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border dark:border-border-dark bg-card/95 backdrop-blur-lg dark:bg-gradient-to-r dark:from-card-dark dark:to-muted-dark/95">
      <div className="w-full">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 pl-6">
            <Link href="/" prefetch={true} className="brand-link group">
              <div className="flex flex-col leading-none font-montserrat">
                <span className="text-3xl font-black tracking-wide bg-gradient-to-r from-theme-nature via-primary-500 to-theme-heart bg-clip-text text-transparent dark:from-theme-paw dark:via-theme-sky dark:to-theme-heart">
                  PASHU
                </span>
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 via-theme-paw to-theme-heart bg-clip-text text-transparent dark:from-theme-heart dark:via-theme-nature dark:to-theme-paw -mt-1">
                  RAKSHAK
                </span>
              </div>
            </Link>
            <div className="h-8 w-[1px] bg-border dark:bg-border-dark mx-2" />
            <span className="text-sm font-medium text-muted-foreground/70 dark:text-foreground-dark/50">Admin</span>
          </div>
          <div className="flex items-center gap-4 pr-6">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="relative w-8 h-8 rounded-full flex items-center justify-center group"
              aria-label="Toggle theme"
            >
              <div className="absolute inset-0 rounded-full bg-primary-50/80 dark:bg-theme-heart/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
              <div className="relative">
                {theme === 'dark' ? (
                  <RiSunLine className="w-5 h-5 text-theme-heart transform transition-transform duration-150 ease-out group-hover:scale-110" />
                ) : (
                  <RiMoonClearLine className="w-5 h-5 text-primary-600 transform transition-transform duration-150 ease-out group-hover:scale-110" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 