export default function VolunteersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-theme-heart via-theme-paw to-primary-dark bg-clip-text text-transparent">
          Volunteer Heroes
        </h1>
      </div>

      <div className="card dark:bg-gradient-to-br dark:from-card-dark dark:to-card-dark/90 hover-lift">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium text-foreground dark:text-foreground-dark">Volunteer Management</h2>
          <p className="text-sm text-muted-foreground dark:text-foreground-dark/60">
            Here&apos;s where you&apos;ll manage all volunteer information.
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground dark:text-foreground-dark/60 space-y-1 ml-4">
            <li>Manage volunteer profiles and availability</li>
            <li>Track volunteer experience and specialties</li>
            <li>Coordinate rescue teams</li>
            <li>Recognize outstanding contributions</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 