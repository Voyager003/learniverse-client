'use client';

import { useMyEnrollments } from '@/lib/hooks/use-enrollments';
import { EnrollmentCard } from '@/components/enrollments/enrollment-card';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Skeleton } from '@/components/ui/skeleton';

function EnrollmentListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-36 rounded-xl" />
      ))}
    </div>
  );
}

export default function StudentDashboardPage() {
  const { data: enrollments, isLoading, error } = useMyEnrollments();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">내 학습</h1>
        <p className="mt-2 text-muted-foreground">수강 중인 강의와 학습 진도를 확인하세요</p>
      </div>

      {isLoading && <EnrollmentListSkeleton />}

      {error && (
        <LoadingSpinner className="min-h-[30vh]" size="lg" />
      )}

      {enrollments && enrollments.length === 0 && (
        <EmptyState
          title="수강 중인 강의가 없습니다"
          description="강의 탐색에서 관심있는 강의를 찾아보세요"
        />
      )}

      {enrollments && enrollments.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => (
            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      )}
    </div>
  );
}
