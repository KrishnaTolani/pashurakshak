export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card hover-lift">
          <h2 className="text-sm font-medium text-muted-foreground">Total Requests</h2>
          <p className="mt-2 text-3xl font-bold text-primary-600 dark:text-primary-400">0</p>
        </div>
        <div className="card hover-lift">
          <h2 className="text-sm font-medium text-muted-foreground">Active Volunteers</h2>
          <p className="mt-2 text-3xl font-bold text-secondary-600 dark:text-secondary-400">0</p>
        </div>
        <div className="card hover-lift">
          <h2 className="text-sm font-medium text-muted-foreground">Animals Listed</h2>
          <p className="mt-2 text-3xl font-bold text-accent-600 dark:text-accent-400">0</p>
        </div>
        <div className="card hover-lift">
          <h2 className="text-sm font-medium text-muted-foreground">Completed Rescues</h2>
          <p className="mt-2 text-3xl font-bold text-primary-600 dark:text-primary-400">0</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-medium text-foreground">Recent Activity</h2>
        <p className="mt-4 text-sm text-muted-foreground">No recent activity</p>
      </div>
    </div>
  );
} 