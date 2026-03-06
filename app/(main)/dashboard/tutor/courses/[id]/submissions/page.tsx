'use client';

import { use, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { FeedbackForm } from '@/components/submissions/feedback-form';
import { useSubmissions, useAddFeedback } from '@/lib/hooks/use-submissions';
import { SUBMISSION_STATUS_LABELS, SubmissionStatus } from '@/lib/types';
import type { FeedbackFormValues } from '@/lib/utils/validators';

interface TutorSubmissionsPageProps {
  params: Promise<{ id: string }>;
}

const statusVariantMap: Record<SubmissionStatus, 'default' | 'secondary' | 'outline'> = {
  [SubmissionStatus.SUBMITTED]: 'default',
  [SubmissionStatus.REVIEWED]: 'secondary',
  [SubmissionStatus.RETURNED]: 'outline',
};

export default function TutorSubmissionsPage({ params }: TutorSubmissionsPageProps) {
  const { id: courseId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get('assignmentId') ?? '';
  const { data: submissions, isLoading } = useSubmissions(assignmentId);
  const { mutateAsync: addFeedback, isPending } = useAddFeedback(assignmentId);
  const [feedbackTarget, setFeedbackTarget] = useState<string | null>(null);

  if (!assignmentId) {
    return (
      <div className="container mx-auto px-4 py-10">
        <EmptyState
          title="과제를 선택해주세요"
          description="과제 관리 페이지에서 제출물 보기를 클릭하세요"
        />
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner className="min-h-[50vh]" size="lg" />;
  }

  async function handleFeedback(submissionId: string, values: FeedbackFormValues) {
    try {
      await addFeedback({
        submissionId,
        body: {
          feedback: values.feedback,
          score: values.score,
        },
      });
      toast.success('피드백이 저장되었습니다');
      setFeedbackTarget(null);
    } catch {
      toast.error('피드백 저장에 실패했습니다');
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => router.push(`/dashboard/tutor/courses/${courseId}/assignments`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        과제 목록으로
      </Button>

      <h1 className="mb-8 text-2xl font-bold">제출물 관리</h1>

      {!submissions || submissions.length === 0 ? (
        <EmptyState
          title="아직 제출된 과제가 없습니다"
          description="학생들이 과제를 제출하면 여기에 표시됩니다"
        />
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {submission.studentName
                      ? `학생: ${submission.studentName}`
                      : `학생 ID: ${submission.studentId.slice(0, 8)}...`}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {submission.score !== null && (
                      <span className="text-sm font-medium">{submission.score}점</span>
                    )}
                    <Badge variant={statusVariantMap[submission.status]}>
                      {SUBMISSION_STATUS_LABELS[submission.status]}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="whitespace-pre-wrap text-sm">{submission.content}</p>

                {submission.feedback && (
                  <div className="mt-3 rounded-md bg-muted p-3">
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">내 피드백</p>
                    <p className="whitespace-pre-wrap text-sm">{submission.feedback}</p>
                  </div>
                )}

                {submission.status === SubmissionStatus.SUBMITTED && (
                  <div className="mt-3">
                    {feedbackTarget === submission.id ? (
                      <FeedbackForm
                        onSubmit={(values) => handleFeedback(submission.id, values)}
                        isPending={isPending}
                        onCancel={() => setFeedbackTarget(null)}
                      />
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFeedbackTarget(submission.id)}
                      >
                        피드백 작성
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
