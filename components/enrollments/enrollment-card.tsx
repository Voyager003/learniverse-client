import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/enrollments/progress-bar';
import { ENROLLMENT_STATUS_LABELS, EnrollmentStatus } from '@/lib/types';
import type { EnrollmentResponse } from '@/lib/types';

interface EnrollmentCardProps {
  enrollment: EnrollmentResponse;
}

const statusVariantMap: Record<EnrollmentStatus, 'default' | 'secondary' | 'outline'> = {
  [EnrollmentStatus.ACTIVE]: 'default',
  [EnrollmentStatus.COMPLETED]: 'secondary',
  [EnrollmentStatus.DROPPED]: 'outline',
};

export function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  return (
    <Link href={`/dashboard/student/enrollments/${enrollment.id}`}>
      <Card className="transition-colors hover:border-primary/50">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="line-clamp-1 text-lg">
              {enrollment.courseTitle ?? '강의'}
            </CardTitle>
            <Badge variant={statusVariantMap[enrollment.status]}>
              {ENROLLMENT_STATUS_LABELS[enrollment.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ProgressBar progress={enrollment.progress} />
        </CardContent>
      </Card>
    </Link>
  );
}
