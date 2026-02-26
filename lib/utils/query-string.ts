import type { CourseQuery } from '@/lib/types';

export function buildCourseQueryString(query?: CourseQuery): string {
  if (!query) return '';

  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.category) params.set('category', query.category);
  if (query.difficulty) params.set('difficulty', query.difficulty);

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}
