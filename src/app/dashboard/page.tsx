'use client';

import { FiActivity, FiHeart, FiUsers } from 'react-icons/fi';
import { PiDogFill, PiPawPrintFill } from 'react-icons/pi';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-theme-nature via-theme-paw to-theme-heart bg-clip-text text-transparent">
              Rescue Center
            </h1>
          </div>
          <div className="hidden sm:block absolute -top-12 -right-8 w-32 h-32 bg-gradient-to-br from-theme-nature/20 to-transparent rounded-full blur-3xl dark:from-theme-heart/10" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/requests" prefetch={true} className="group relative transform transition-transform duration-150 hover:-translate-y-1 hover:cursor-pointer">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-theme-nature to-primary-300 rounded-2xl blur opacity-20 group-hover:opacity-100 transition-opacity duration-150 dark:from-theme-heart dark:to-theme-heart/50" />
          <div className="card relative bg-white dark:bg-gradient-to-br dark:from-card-dark dark:to-card-dark/90">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-primary-50 text-primary-600 dark:bg-theme-heart/10 dark:text-theme-heart">
                <PiPawPrintFill className="w-6 h-6 transform transition-transform duration-150 group-hover:scale-110" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-muted-foreground dark:text-foreground-dark/60">Total Requests</h2>
                <p className="mt-1 text-3xl font-bold text-primary-600 dark:text-theme-heart">0</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/volunteers" prefetch={true} className="group relative transform transition-transform duration-150 hover:-translate-y-1 hover:cursor-pointer">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-theme-paw to-theme-nature rounded-2xl blur opacity-20 group-hover:opacity-100 transition-opacity duration-150 dark:from-theme-paw dark:to-theme-heart/50" />
          <div className="card relative bg-white dark:bg-gradient-to-br dark:from-card-dark dark:to-card-dark/90">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-secondary-50 text-secondary-600 dark:bg-theme-paw/10 dark:text-theme-paw">
                <FiUsers className="w-6 h-6 transform transition-transform duration-150 group-hover:scale-110" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-muted-foreground dark:text-foreground-dark/60">Active Volunteers</h2>
                <p className="mt-1 text-3xl font-bold text-secondary-600 dark:text-theme-paw">0</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/animals" prefetch={true} className="group relative transform transition-transform duration-150 hover:-translate-y-1 hover:cursor-pointer">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-theme-heart to-theme-paw rounded-2xl blur opacity-20 group-hover:opacity-100 transition-opacity duration-150 dark:from-theme-nature dark:to-theme-paw/50" />
          <div className="card relative bg-white dark:bg-gradient-to-br dark:from-card-dark dark:to-card-dark/90">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-accent-50 text-accent-600 dark:bg-theme-nature/10 dark:text-theme-nature">
                <PiDogFill className="w-6 h-6 transform transition-transform duration-150 group-hover:scale-110" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-muted-foreground dark:text-foreground-dark/60">Animals Listed</h2>
                <p className="mt-1 text-3xl font-bold text-accent-600 dark:text-theme-nature">0</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/requests" prefetch={true} className="group relative transform transition-transform duration-150 hover:-translate-y-1 hover:cursor-pointer">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-theme-heart to-theme-nature rounded-2xl blur opacity-20 group-hover:opacity-100 transition-opacity duration-150 dark:from-theme-heart dark:to-theme-paw/50" />
          <div className="card relative bg-white dark:bg-gradient-to-br dark:from-card-dark dark:to-card-dark/90">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-red-50 text-theme-heart dark:bg-theme-heart/10 dark:text-theme-heart">
                <FiHeart className="w-6 h-6 transform transition-transform duration-150 group-hover:scale-110" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-muted-foreground dark:text-foreground-dark/60">Completed Rescues</h2>
                <p className="mt-1 text-3xl font-bold text-theme-heart dark:text-theme-heart">0</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity Section */}
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-theme-nature via-theme-paw to-theme-heart rounded-2xl blur opacity-20 dark:from-theme-heart dark:via-theme-paw dark:to-theme-nature" />
        <div className="card relative bg-white/80 backdrop-blur-sm dark:bg-gradient-to-br dark:from-card-dark dark:to-card-dark/90">
          <div className="flex items-center gap-3 mb-6">
            <FiActivity className="w-5 h-5 text-primary-600 dark:text-theme-heart" />
            <h2 className="text-lg font-medium text-foreground dark:text-foreground-dark">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground dark:text-foreground-dark/60">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
} 