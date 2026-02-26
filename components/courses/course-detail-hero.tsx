import { Badge } from '@/components/ui/badge';
import { DifficultyBadge } from '@/components/courses/difficulty-badge';
import { CATEGORY_LABELS } from '@/lib/types';
import type { CourseResponse } from '@/lib/types';

interface CourseDetailHeroProps {
  course: CourseResponse;
}

export function CourseDetailHero({ course }: CourseDetailHeroProps) {
  return (
    <section className="border-b bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{CATEGORY_LABELS[course.category]}</Badge>
          <DifficultyBadge difficulty={course.difficulty} />
        </div>
        <h1 className="mt-4 text-3xl font-bold md:text-4xl">{course.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{course.description}</p>
        {course.tutorName && (
          <p className="mt-4 text-sm text-muted-foreground">
            튜터: <span className="font-medium text-foreground">{course.tutorName}</span>
          </p>
        )}
      </div>
    </section>
  );
}
