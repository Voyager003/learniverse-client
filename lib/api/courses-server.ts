import type { CourseResponse, CourseQuery, PaginatedData, ApiResponse } from '@/lib/types';

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? '';
}

function buildQueryString(query?: CourseQuery): string {
  if (!query) return '';

  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.category) params.set('category', query.category);
  if (query.difficulty) params.set('difficulty', query.difficulty);

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function fetchCourses(query?: CourseQuery): Promise<PaginatedData<CourseResponse>> {
  const res = await fetch(`${getBaseUrl()}/courses${buildQueryString(query)}`, {
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
