import { Skeleton } from '@/components/ui/skeleton';

export default function CourseDetailLoading() {
  return (
    <>
      <Skeleton className="h-64 w-full" />
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-48" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-40 rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
}
