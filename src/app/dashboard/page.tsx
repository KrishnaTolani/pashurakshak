export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-theme-nature via-theme-paw to-theme-heart bg-clip-text text-transparent">
          Rescue Center
        </h1>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card hover-lift dark:bg-gradient-to-br dark:from-card-dark dark:to-card-dark/90">
          <h2 className="text-sm font-medium text-muted-foreground dark:text-foreground-dark/60">Total Requests</h2>
          <p className="mt-2 text-3xl font-bold text-primary-600 dark:text-primary-dark">0</p>
        </div>
        <div className="card hover-lift dark:bg-gradient-to-br dark:from-card-dark dark:to-card-dark/90">
          <h2 className="text-sm font-medium text-muted-foreground dark:text-foreground-dark/60">Active Volunteers</h2>
          <p className="mt-2 text-3xl font-bold text-secondary-600 dark:text-theme-nature">0</p>
        </div>
        <div className="card hover-lift dark:bg-gradient-to-br dark:from-card-dark dark:to-card-dark/90">
          <h2 className="text-sm font-medium text-muted-foreground dark:text-foreground-dark/60">Animals Listed</h2>
          <p className="mt-2 text-3xl font-bold text-accent-600 dark:text-theme-paw">0</p>
        </div>
        <div className="card hover-lift dark:bg-gradient-to-br dark:from-card-dark dark:to-card-dark/90">
          <h2 className="text-sm font-medium text-muted-foreground dark:text-foreground-dark/60">Completed Rescues</h2>
          <p className="mt-2 text-3xl font-bold text-theme-heart dark:text-theme-heart">0</p>
        </div>
      </div>

      <div className="card dark:bg-gradient-to-br dark:from-card-dark dark:to-card-dark/90">
        <h2 className="text-lg font-medium text-foreground dark:text-foreground-dark">Recent Activity</h2>
        <p className="mt-4 text-sm text-muted-foreground dark:text-foreground-dark/60">No recent activity</p>
      </div>
    </div>
  );
} 