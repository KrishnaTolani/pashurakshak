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
    <div className="sticky left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border dark:border-border-dark bg-card dark:bg-card-dark">
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
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted-dark dark:hover:text-foreground-dark'
              }`}
            >
              <IconComponent className={`h-5 w-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 