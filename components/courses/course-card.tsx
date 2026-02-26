import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { DifficultyBadge } from '@/components/courses/difficulty-badge';
import { CATEGORY_LABELS } from '@/lib/types';
import type { CourseResponse } from '@/lib/types';

interface CourseCardProps {
  course: CourseResponse;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="h-full transition-colors hover:border-primary/50">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {CATEGORY_LABELS[course.category]}
            </span>
            <DifficultyBadge difficulty={course.difficulty} />
          </div>
          <CardTitle className="mt-2 line-clamp-2 text-lg">{course.title}</CardTitle>
          <CardDescription className="line-clamp-2">{course.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {course.tutorName && (
            <p className="text-sm text-muted-foreground">{course.tutorName}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
