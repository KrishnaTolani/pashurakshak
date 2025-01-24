'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiUsers, FiList } from 'react-icons/fi';
import { PiDogFill, PiPawPrintFill } from 'react-icons/pi';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', Icon: FiHome },
  { name: 'Rescue Requests', href: '/requests', Icon: PiPawPrintFill },
  { name: 'Volunteers', href: '/volunteers', Icon: FiUsers },
  { name: 'Animals', href: '/animals', Icon: PiDogFill },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sticky left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border/50 bg-gradient-to-b from-white via-white to-theme-nature/5 dark:border-border-dark dark:from-card-dark dark:via-card-dark dark:to-theme-heart/5">
      <nav className="flex flex-col gap-2 p-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.Icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-theme-nature/20 to-primary-100 text-primary-700 shadow-sm dark:from-theme-heart/20 dark:to-theme-heart/5 dark:text-theme-heart'
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-theme-nature/10 hover:to-transparent hover:text-primary-600 dark:text-gray-400 dark:hover:from-theme-heart/10 dark:hover:to-transparent dark:hover:text-theme-heart'
              }`}
            >
              <IconComponent 
                className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive 
                    ? 'text-primary-600 dark:text-theme-heart' 
                    : 'text-gray-500 group-hover:text-primary-500 dark:text-gray-400 dark:group-hover:text-theme-heart'
                }`} 
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="rounded-xl bg-gradient-to-r from-theme-nature/20 to-primary-50 p-4 dark:from-theme-heart/20 dark:to-theme-heart/5">
          <p className="text-xs font-medium text-primary-700 dark:text-theme-heart">Need Help?</p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Contact our support team for assistance with the admin panel.</p>
        </div>
      </div>
    </div>
  );
} 