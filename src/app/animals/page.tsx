export default function AnimalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-theme-paw via-theme-nature to-theme-sky bg-clip-text text-transparent">
          Animal Friends
        </h1>
      </div>

      <div className="card dark:bg-gradient-to-br dark:from-card-dark dark:to-card-dark/90 hover-lift">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium text-foreground dark:text-foreground-dark">Animal Registry</h2>
          <p className="text-sm text-muted-foreground dark:text-foreground-dark/60">
            Animal management system coming soon. Here you'll be able to:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground dark:text-foreground-dark/60 space-y-1 ml-4">
            <li>Maintain profiles of rescued animals</li>
            <li>Track medical history and treatments</li>
            <li>Manage adoption listings</li>
            <li>Monitor recovery progress</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 