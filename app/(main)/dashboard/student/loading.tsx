import { Skeleton } from '@/components/ui/skeleton';

export default function StudentDashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="mt-2 h-5 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
