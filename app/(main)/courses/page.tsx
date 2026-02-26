import { Suspense } from 'react';
import type { Metadata } from 'next';
import { fetchCourses } from '@/lib/api/courses-server';
import { CourseGrid } from '@/components/courses/course-grid';
import { CourseFilters } from '@/components/courses/course-filters';
import { CoursePagination } from '@/components/courses/course-pagination';
import { EmptyState } from '@/components/shared/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import type { CourseCategory, CourseDifficulty } from '@/lib/types';

export const metadata: Metadata = {
  title: '강의 탐색',
  description: '다양한 분야의 강의를 탐색하고 원하는 강의를 수강하세요.',
};

interface CoursesPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    difficulty?: string;
  }>;
}

function CoursesLoading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-48 rounded-xl" />
      ))}
    </div>
  );
}

async function CourseList({
  page,
  category,
  difficulty,
}: {
  page: number;
  category?: string;
  difficulty?: string;
}) {
  const data = await fetchCourses({
    page,
    limit: 9,
    category: category as CourseCategory | undefined,
    difficulty: difficulty as CourseDifficulty | undefined,
  });

  if (data.data.length === 0) {
    return <EmptyState title="강의가 없습니다" description="다른 필터 조건으로 검색해보세요" />;
  }

  return (
    <>
      <CourseGrid courses={data.data} />
      <div className="mt-8">
        <CoursePagination currentPage={data.page} totalPages={data.totalPages} />
      </div>
    </>
  );
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">강의 탐색</h1>
        <p className="mt-2 text-muted-foreground">관심 분야의 강의를 찾아보세요</p>
      </div>

      <div className="mb-6">
        <Suspense>
          <CourseFilters />
        </Suspense>
      </div>

      <Suspense fallback={<CoursesLoading />}>
        <CourseList
          page={page}
          category={params.category}
          difficulty={params.difficulty}
        />
      </Suspense>
    </div>
  );
}
