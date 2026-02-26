import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SUBMISSION_STATUS_LABELS, SubmissionStatus } from '@/lib/types';
import type { SubmissionResponse } from '@/lib/types';

interface SubmissionCardProps {
  submission: SubmissionResponse;
}

const statusVariantMap: Record<SubmissionStatus, 'default' | 'secondary' | 'outline'> = {
  [SubmissionStatus.SUBMITTED]: 'default',
  [SubmissionStatus.REVIEWED]: 'secondary',
  [SubmissionStatus.RETURNED]: 'outline',
};

export function SubmissionCard({ submission }: SubmissionCardProps) {
  return (
    <Card>
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">내 제출</CardTitle>
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
          <div className="mt-4 rounded-md bg-muted p-3">
            <p className="mb-1 text-xs font-semibold text-muted-foreground">튜터 피드백</p>
            <p className="whitespace-pre-wrap text-sm">{submission.feedback}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
