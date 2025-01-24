export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Requests</h2>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Volunteers</h2>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Animals Listed</h2>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Rescues</h2>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-medium">Recent Activity</h2>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
      </div>
    </div>
  );
} 