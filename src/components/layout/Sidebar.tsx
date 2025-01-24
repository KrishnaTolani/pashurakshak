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
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.Icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50'
              }`}
            >
              <IconComponent className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 