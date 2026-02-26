'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CourseForm } from '@/components/courses/course-form';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { useCourse, useUpdateCourse, useDeleteCourse } from '@/lib/hooks/use-courses';
import type { CourseFormValues } from '@/lib/utils/validators';

interface EditCoursePageProps {
  params: Promise<{ id: string }>;
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: course, isLoading } = useCourse(id);
  const { mutateAsync: updateCourse, isPending: isUpdating } = useUpdateCourse();
  const { mutateAsync: deleteCourse, isPending: isDeleting } = useDeleteCourse();

  if (isLoading) {
    return <LoadingSpinner className="min-h-[50vh]" size="lg" />;
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-10">
        <EmptyState
          title="강의를 찾을 수 없습니다"
          description="존재하지 않거나 접근 권한이 없는 강의입니다"
        />
      </div>
    );
  }

  async function handleSubmit(values: CourseFormValues) {
    try {
      await updateCourse({ id, body: values });
      toast.success('강의가 수정되었습니다');
      router.push('/dashboard/tutor');
    } catch {
      toast.error('강의 수정에 실패했습니다');
    }
  }

  async function handleTogglePublish() {
    try {
      await updateCourse({ id, body: { isPublished: !course!.isPublished } });
      toast.success(course!.isPublished ? '강의가 비공개로 전환되었습니다' : '강의가 공개되었습니다');
    } catch {
      toast.error('상태 변경에 실패했습니다');
    }
  }

  async function handleDelete() {
    try {
      await deleteCourse(id);
      toast.success('강의가 삭제되었습니다');
      router.push('/dashboard/tutor');
    } catch {
      toast.error('강의 삭제에 실패했습니다');
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => router.push('/dashboard/tutor')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        내 강의로
      </Button>

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">강의 수정</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="publish"
              checked={course.isPublished}
              onCheckedChange={handleTogglePublish}
              disabled={isUpdating}
            />
            <Label htmlFor="publish">
              {course.isPublished ? '공개' : '비공개'}
            </Label>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>강의를 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 되돌릴 수 없습니다. 강의와 관련된 모든 데이터가 삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <CourseForm
        defaultValues={{
          title: course.title,
          description: course.description,
          category: course.category,
          difficulty: course.difficulty,
        }}
        onSubmit={handleSubmit}
        submitLabel="수정 저장"
        isPending={isUpdating}
      />
    </div>
  );
}
