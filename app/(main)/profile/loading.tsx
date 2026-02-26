import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
  return (
    <div className="container mx-auto max-w-lg px-4 py-10">
      <Skeleton className="mb-8 h-8 w-28" />
      <Skeleton className="mb-6 h-40 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}
