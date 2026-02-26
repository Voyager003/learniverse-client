import { CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AssignmentResponse } from '@/lib/types';

interface AssignmentCardProps {
  assignment: AssignmentResponse;
  actions?: React.ReactNode;
}

function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return '마감 없음';
  return new Date(dueDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

export function AssignmentCard({ assignment, actions }: AssignmentCardProps) {
  const overdue = isOverdue(assignment.dueDate);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">{assignment.title}</CardTitle>
          {overdue && <Badge variant="destructive">마감</Badge>}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {assignment.description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>{formatDueDate(assignment.dueDate)}</span>
          </div>
          {actions}
        </div>
      </CardContent>
    </Card>
  );
}
