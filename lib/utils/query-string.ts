import type { CourseQuery } from '@/lib/types';

type QueryPrimitive = string | number | boolean | null | undefined;

export function buildQueryString<T extends object>(params?: T): string {
  if (!params) return '';

  const searchParams = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(params as Record<string, unknown>)) {
    const value = rawValue as QueryPrimitive;

    if (value === undefined || value === null || value === '') {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export function buildCourseQueryString(query?: CourseQuery): string {
  if (!query) return '';

  return buildQueryString({
    page: query.page,
    limit: query.limit,
    category: query.category,
    difficulty: query.difficulty,
  });
}
