'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseForm } from '@/components/courses/course-form';
import { useCreateCourse, useUpdateCourse } from '@/lib/hooks/use-courses';
import type { CourseFormValues } from '@/lib/utils/validators';

export default function NewCoursePage() {
  const router = useRouter();
  const { mutateAsync: createCourse, isPending: isCreating } = useCreateCourse();
  const { mutateAsync: updateCourse, isPending: isPublishing } = useUpdateCourse();

  async function handleSubmit(values: CourseFormValues) {
    try {
      const created = await createCourse(values);
      try {
        await updateCourse({ id: created.id, body: { isPublished: true } });
        toast.success('강의가 생성되고 즉시 공개되었습니다.');
      } catch {
        toast.error('강의는 생성되었지만 공개에 실패했습니다. 강의 편집에서 공개해주세요.');
      }

      router.push('/dashboard/tutor');
    } catch {
      toast.error('강의 생성에 실패했습니다');
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

      <h1 className="mb-8 text-2xl font-bold">새 강의 만들기</h1>

      <CourseForm
        onSubmit={handleSubmit}
        submitLabel="강의 생성"
        isPending={isCreating || isPublishing}
      />
    </div>
  );
}
