import { describe, expect, it } from 'vitest';
import { buildCourseQueryString, buildQueryString } from '@/lib/utils/query-string';

describe('buildQueryString', () => {
  it('string, number, boolean 값을 query string으로 직렬화한다', () => {
    expect(
      buildQueryString({
        page: 2,
        limit: 20,
        search: 'admin',
        isActive: false,
      }),
    ).toBe('?page=2&limit=20&search=admin&isActive=false');
  });

  it('undefined, null, 빈 문자열은 제외한다', () => {
    expect(
      buildQueryString({
        page: 1,
        search: '',
        role: undefined,
        from: null,
      }),
    ).toBe('?page=1');
  });
});

describe('buildCourseQueryString', () => {
  it('기존 강좌 query builder도 공통 함수를 재사용해 동작한다', () => {
    expect(
      buildCourseQueryString({
        page: 1,
        limit: 12,
        category: 'backend',
        difficulty: 'beginner',
      }),
    ).toBe('?page=1&limit=12&category=backend&difficulty=beginner');
  });
});
