'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { AssignmentCard } from '@/components/assignments/assignment-card';
import { SubmissionForm } from '@/components/submissions/submission-form';
import { SubmissionCard } from '@/components/submissions/submission-card';
import { useAssignments } from '@/lib/hooks/use-assignments';
import { useSubmissions, useCreateSubmission } from '@/lib/hooks/use-submissions';
import { getUserFacingErrorMessage } from '@/lib/errors/get-user-facing-error-message';
import type { SubmissionFormValues } from '@/lib/utils/validators';

interface AssignmentsPageProps {
  params: Promise<{ id: string }>;
}

function AssignmentWithSubmission({
  assignmentId,
}: {
  assignmentId: string;
}) {
  const { data: submissions } = useSubmissions(assignmentId);
  const { mutateAsync: createSubmission, isPending } = useCreateSubmission(assignmentId);
  const [showForm, setShowForm] = useState(false);

  const mySubmission = submissions?.[0] ?? null;

  async function handleSubmit(values: SubmissionFormValues) {
    try {
      await createSubmission(values);
      toast.success('과제가 제출되었습니다');
      setShowForm(false);
    } catch (error) {
      toast.error(getUserFacingErrorMessage(error, 'assignment.submit'));
    }
  }

  return (
    <div className="mt-3 space-y-3">
      {mySubmission ? (
        <SubmissionCard submission={mySubmission} />
      ) : (
        <>
          {showForm ? (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">과제 제출</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <SubmissionForm
                  onSubmit={handleSubmit}
                  isPending={isPending}
                  onCancel={() => setShowForm(false)}
                />
              </CardContent>
            </Card>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(true)}
            >
              과제 제출하기
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default function AssignmentsPage({ params }: AssignmentsPageProps) {
  const { id: courseId } = use(params);
  const router = useRouter();
  const { data: assignments, isLoading } = useAssignments(courseId);

  if (isLoading) {
    return <LoadingSpinner className="min-h-[50vh]" size="lg" />;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => router.push(`/courses/${courseId}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        강의로 돌아가기
      </Button>

      <h1 className="mb-8 text-2xl font-bold">과제</h1>

      {!assignments || assignments.length === 0 ? (
        <EmptyState
          title="등록된 과제가 없습니다"
          description="아직 출제된 과제가 없습니다"
        />
      ) : (
        <div className="space-y-6">
          {assignments.map((assignment) => (
            <div key={assignment.id}>
              <AssignmentCard assignment={assignment} />
              <AssignmentWithSubmission assignmentId={assignment.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
