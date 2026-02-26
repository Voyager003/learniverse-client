'use client';

import Link from 'next/link';
import { PlusCircle, Pencil, BookOpen, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { useMyCourses } from '@/lib/hooks/use-courses';
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '@/lib/types';

function CourseListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-40 rounded-xl" />
      ))}
    </div>
  );
}

export default function TutorDashboardPage() {
  const { data: courses, isLoading, error } = useMyCourses();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">내 강의</h1>
          <p className="mt-2 text-muted-foreground">강의를 관리하고 새 강의를 만들어보세요</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tutor/courses/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            새 강의
          </Link>
        </Button>
      </div>

      {isLoading && <CourseListSkeleton />}

      {error && (
        <EmptyState
          title="데이터를 불러올 수 없습니다"
          description="잠시 후 다시 시도해주세요"
        />
      )}

      {courses && courses.length === 0 && (
        <EmptyState
          title="아직 생성한 강의가 없습니다"
          description="새 강의를 만들어 학생들과 지식을 나눠보세요"
        />
      )}

      {courses && courses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
                  <Badge variant={course.isPublished ? 'default' : 'outline'}>
                    {course.isPublished ? '공개' : '비공개'}
                  </Badge>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {course.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="secondary">{CATEGORY_LABELS[course.category]}</Badge>
                    <Badge variant="secondary">{DIFFICULTY_LABELS[course.difficulty]}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/tutor/courses/${course.id}/lectures`}>
                        <BookOpen className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/tutor/courses/${course.id}/assignments`}>
                        <ClipboardList className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/tutor/courses/${course.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
