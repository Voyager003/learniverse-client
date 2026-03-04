'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseForm } from '@/components/courses/course-form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCreateCourse, useUpdateCourse } from '@/lib/hooks/use-courses';
import type { CourseFormValues } from '@/lib/utils/validators';

export default function NewCoursePage() {
  const router = useRouter();
  const { mutateAsync: createCourse, isPending } = useCreateCourse();
  const { mutateAsync: updateCourse, isPending: isPublishing } = useUpdateCourse();
  const [publishAfterCreate, setPublishAfterCreate] = useState(true);

  async function handleSubmit(values: CourseFormValues) {
    try {
      const created = await createCourse(values);

      if (publishAfterCreate) {
        await updateCourse({ id: created.id, body: { isPublished: true } });
        toast.success('강의가 생성되고 즉시 공개되었습니다.');
      } else {
        toast.success('강의가 비공개(draft) 상태로 생성되었습니다.');
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

      <div className="mb-6 flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">
        <Label htmlFor="publish-after-create" className="text-sm font-medium">
          생성 후 바로 공개
        </Label>
        <Switch
          id="publish-after-create"
          checked={publishAfterCreate}
          onCheckedChange={setPublishAfterCreate}
          disabled={isPending || isPublishing}
        />
      </div>

      <CourseForm
        onSubmit={handleSubmit}
        submitLabel="강의 생성"
        isPending={isPending || isPublishing}
      />
    </div>
  );
}
