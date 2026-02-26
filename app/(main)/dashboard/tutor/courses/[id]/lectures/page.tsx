'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { LectureForm } from '@/components/lectures/lecture-form';
import {
  useCourse,
  useCreateLecture,
  useUpdateLecture,
  useDeleteLecture,
} from '@/lib/hooks/use-courses';
import type { LectureFormValues } from '@/lib/utils/validators';
import type { LectureResponse } from '@/lib/types';

interface LecturesPageProps {
  params: Promise<{ id: string }>;
}

export default function LecturesPage({ params }: LecturesPageProps) {
  const { id: courseId } = use(params);
  const router = useRouter();
  const { data: course, isLoading } = useCourse(courseId);
  const { mutateAsync: createLecture, isPending: isCreating } = useCreateLecture(courseId);
  const { mutateAsync: updateLecture, isPending: isUpdating } = useUpdateLecture(courseId);
  const { mutateAsync: deleteLecture } = useDeleteLecture(courseId);

  const [showForm, setShowForm] = useState(false);
  const [editingLecture, setEditingLecture] = useState<LectureResponse | null>(null);

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

  const lectures = course.lectures
    ? [...course.lectures].sort((a, b) => a.order - b.order)
    : [];

  async function handleCreate(values: LectureFormValues) {
    try {
      await createLecture({
        title: values.title,
        content: values.content,
        order: values.order,
        videoUrl: values.videoUrl || undefined,
      });
      toast.success('레슨이 추가되었습니다');
      setShowForm(false);
    } catch {
      toast.error('레슨 추가에 실패했습니다');
    }
  }

  async function handleUpdate(values: LectureFormValues) {
    if (!editingLecture) return;
    try {
      await updateLecture({
        lectureId: editingLecture.id,
        body: {
          title: values.title,
          content: values.content,
          order: values.order,
          videoUrl: values.videoUrl || undefined,
        },
      });
      toast.success('레슨이 수정되었습니다');
      setEditingLecture(null);
    } catch {
      toast.error('레슨 수정에 실패했습니다');
    }
  }

  async function handleDelete(lectureId: string) {
    try {
      await deleteLecture(lectureId);
      toast.success('레슨이 삭제되었습니다');
    } catch {
      toast.error('레슨 삭제에 실패했습니다');
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
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
        <div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="mt-1 text-muted-foreground">레슨 관리</p>
        </div>
        {!showForm && !editingLecture && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            레슨 추가
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">새 레슨</CardTitle>
          </CardHeader>
          <CardContent>
            <LectureForm
              defaultValues={{ order: lectures.length + 1 }}
              onSubmit={handleCreate}
              submitLabel="추가"
              isPending={isCreating}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {lectures.length === 0 && !showForm ? (
        <EmptyState
          title="아직 레슨이 없습니다"
          description="레슨을 추가하여 강의를 구성해보세요"
        />
      ) : (
        <div className="space-y-3">
          {lectures.map((lecture) => (
            <Card key={lecture.id}>
              {editingLecture?.id === lecture.id ? (
                <CardContent className="pt-6">
                  <LectureForm
                    defaultValues={{
                      title: lecture.title,
                      content: lecture.content,
                      videoUrl: lecture.videoUrl ?? '',
                      order: lecture.order,
                    }}
                    onSubmit={handleUpdate}
                    submitLabel="수정 저장"
                    isPending={isUpdating}
                    onCancel={() => setEditingLecture(null)}
                  />
                </CardContent>
              ) : (
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {lecture.order}
                      </span>
                      <div>
                        <CardTitle className="text-base">{lecture.title}</CardTitle>
                        <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                          {lecture.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingLecture(lecture);
                          setShowForm(false);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>레슨을 삭제하시겠습니까?</AlertDialogTitle>
                            <AlertDialogDescription>
                              &quot;{lecture.title}&quot; 레슨이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(lecture.id)}>
                              삭제
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
