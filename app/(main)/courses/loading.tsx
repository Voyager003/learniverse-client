import { Skeleton } from '@/components/ui/skeleton';

export default function CoursesLoading() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="mt-2 h-5 w-64" />
      </div>
      <Skeleton className="mb-6 h-10 w-full max-w-md" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
