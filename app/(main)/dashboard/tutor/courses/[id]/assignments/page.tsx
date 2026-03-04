'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { AssignmentCard } from '@/components/assignments/assignment-card';
import { AssignmentForm } from '@/components/assignments/assignment-form';
import { useAssignments, useCreateAssignment } from '@/lib/hooks/use-assignments';
import type { AssignmentFormValues } from '@/lib/utils/validators';

interface TutorAssignmentsPageProps {
  params: Promise<{ id: string }>;
}

export default function TutorAssignmentsPage({ params }: TutorAssignmentsPageProps) {
  const { id: courseId } = use(params);
  const router = useRouter();
  const { data: assignments, isLoading } = useAssignments(courseId);
  const { mutateAsync: createAssignment, isPending } = useCreateAssignment(courseId);
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return <LoadingSpinner className="min-h-[50vh]" size="lg" />;
  }

  async function handleCreate(values: AssignmentFormValues) {
    try {
      await createAssignment({
        title: values.title,
        description: values.description,
        dueDate: values.dueDate || undefined,
      });
      toast.success('과제가 출제되었습니다');
      setShowForm(false);
    } catch {
      toast.error('과제 출제에 실패했습니다');
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
        <h1 className="text-2xl font-bold">과제 관리</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            과제 출제
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">새 과제</CardTitle>
          </CardHeader>
          <CardContent>
            <AssignmentForm
              onSubmit={handleCreate}
              submitLabel="출제"
              isPending={isPending}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {!assignments || assignments.length === 0 ? (
        !showForm && (
          <EmptyState
            title="아직 출제한 과제가 없습니다"
            description="과제를 출제하여 학생들의 학습을 도와보세요"
          />
        )
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              actions={
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/tutor/courses/${courseId}/submissions?assignmentId=${assignment.id}`}>
                    제출물 보기
                  </Link>
                </Button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
