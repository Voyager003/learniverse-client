'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProgressBar } from '@/components/enrollments/progress-bar';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { useEnrollment, useUpdateProgress } from '@/lib/hooks/use-enrollments';
import { useCourse } from '@/lib/hooks/use-courses';
import { ENROLLMENT_STATUS_LABELS, EnrollmentStatus } from '@/lib/types';

interface EnrollmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EnrollmentDetailPage({ params }: EnrollmentDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: enrollment, isLoading: enrollmentLoading } = useEnrollment(id);
  const { data: course, isLoading: courseLoading } = useCourse(enrollment?.courseId ?? '');
  const { mutateAsync: updateProgress, isPending } = useUpdateProgress(id);

  if (enrollmentLoading || courseLoading) {
    return <LoadingSpinner className="min-h-[50vh]" size="lg" />;
  }

  if (!enrollment) {
    return (
      <div className="container mx-auto px-4 py-10">
        <EmptyState
          title="수강 정보를 찾을 수 없습니다"
          description="존재하지 않거나 접근 권한이 없는 수강 정보입니다"
        />
      </div>
    );
  }

  const lectures = course?.lectures
    ? [...course.lectures].sort((a, b) => a.order - b.order)
    : [];
  const totalLectures = lectures.length;
  const completedCount = totalLectures > 0
    ? Math.round((enrollment.progress / 100) * totalLectures)
    : 0;

  async function handleLectureToggle(lectureIndex: number) {
    if (!enrollment || totalLectures === 0) return;

    const newCompleted = lectureIndex + 1;
    const newProgress = Math.round((newCompleted / totalLectures) * 100);

    try {
      await updateProgress({ progress: newProgress });
      if (newProgress >= 100) {
        toast.success('축하합니다! 강의를 완료했습니다');
      }
    } catch {
      toast.error('진도 업데이트에 실패했습니다');
    }
  }

  const isCompleted = enrollment.status === EnrollmentStatus.COMPLETED;

  return (
    <div className="container mx-auto px-4 py-10">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => router.push('/dashboard/student')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        내 학습으로
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{enrollment.courseTitle ?? '강의'}</h1>
          <Badge variant={isCompleted ? 'secondary' : 'default'}>
            {ENROLLMENT_STATUS_LABELS[enrollment.status]}
          </Badge>
        </div>
        <div className="mt-4 max-w-md">
          <ProgressBar progress={enrollment.progress} />
        </div>
      </div>

      <Separator className="mb-8" />

      <h2 className="mb-4 text-xl font-semibold">레슨 목록</h2>

      {lectures.length === 0 ? (
        <p className="text-muted-foreground">등록된 레슨이 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {lectures.map((lecture, index) => {
            const isDone = index < completedCount;
            return (
              <Card key={lecture.id}>
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isDone ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <CardTitle className="text-base">{lecture.title}</CardTitle>
                    </div>
                    {!isDone && !isCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLectureToggle(index)}
                        disabled={isPending || index !== completedCount}
                      >
                        완료
                      </Button>
                    )}
                  </div>
                </CardHeader>
                {isDone && lecture.content && (
                  <CardContent className="pt-0 pb-3">
                    <p className="pl-8 text-sm text-muted-foreground">{lecture.content}</p>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
