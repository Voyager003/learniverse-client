import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchCourse } from '@/lib/api/courses-server';
import { CourseDetailHero } from '@/components/courses/course-detail-hero';
import { LectureList } from '@/components/lectures/lecture-list';
import { EnrollButton } from '@/components/enrollments/enroll-button';
import { Separator } from '@/components/ui/separator';

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const course = await fetchCourse(id);
    return {
      title: course.title,
      description: course.description,
    };
  } catch {
    return { title: '강의를 찾을 수 없습니다' };
  }
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;

  let course;
  try {
    course = await fetchCourse(id);
  } catch {
    notFound();
  }

  return (
    <>
      <CourseDetailHero course={course} />

      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Sidebar — mobile first, desktop right */}
          <div className="order-first lg:order-last lg:col-span-1">
            <div className="sticky top-20 rounded-xl border p-6">
              <h3 className="text-lg font-semibold">수강 신청</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                지금 바로 학습을 시작하세요
              </p>
              <div className="mt-6">
                <EnrollButton courseId={course.id} />
              </div>
            </div>
          </div>

          {/* Lecture list */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold">커리큘럼</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              총 {course.lectures?.length ?? 0}개 레슨
            </p>
            <Separator className="my-4" />
            <LectureList lectures={course.lectures ?? []} />
          </div>
        </div>
      </div>
    </>
  );
}
