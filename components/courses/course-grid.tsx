import { CourseCard } from '@/components/courses/course-card';
import type { CourseResponse } from '@/lib/types';

interface CourseGridProps {
  courses: CourseResponse[];
}

export function CourseGrid({ courses }: CourseGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
