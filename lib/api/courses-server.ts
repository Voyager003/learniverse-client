import type { CourseResponse, CourseQuery, PaginatedData, ApiResponse } from '@/lib/types';
import { buildCourseQueryString } from '@/lib/utils/query-string';

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? '';
}

export async function fetchCourses(query?: CourseQuery): Promise<PaginatedData<CourseResponse>> {
  const res = await fetch(`${getBaseUrl()}/courses${buildCourseQueryString(query)}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch courses: ${res.status}`);
  }

  const json: ApiResponse<PaginatedData<CourseResponse>> = await res.json();
  return json.data;
}

export async function fetchCourse(id: string): Promise<CourseResponse> {
  const res = await fetch(`${getBaseUrl()}/courses/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch course: ${res.status}`);
  }

  const json: ApiResponse<CourseResponse> = await res.json();
  return json.data;
}
