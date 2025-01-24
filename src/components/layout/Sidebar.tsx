'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiUsers, FiList, FiHeart } from 'react-icons/fi';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', Icon: FiHome },
  { name: 'Requests', href: '/requests', Icon: FiList },
  { name: 'Volunteers', href: '/volunteers', Icon: FiUsers },
  { name: 'Animals', href: '/animals', Icon: FiHeart },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sticky left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border dark:border-border-dark bg-card dark:bg-gradient-to-b dark:from-card-dark dark:to-muted-dark">
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.Icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-600 dark:bg-theme-heart/10 dark:text-theme-heart'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground dark:text-foreground-dark/60 dark:hover:bg-muted-dark/50 dark:hover:text-theme-paw'
              }`}
            >
              <IconComponent className={`h-5 w-5 ${isActive ? 'text-primary-600 dark:text-theme-heart' : ''}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 