import { describe, it, expect } from 'vitest';
import { isProtectedRoute, isAuthRoute } from '@/lib/constants/routes';

describe('isProtectedRoute', () => {
  it.each([
    '/dashboard',
    '/dashboard/student',
    '/dashboard/tutor/courses/new',
    '/admin',
    '/admin/users',
    '/profile',
  ])('%s는 보호 라우트이다', (path) => {
    expect(isProtectedRoute(path)).toBe(true);
  });

  it.each([
    '/',
    '/courses',
    '/courses/123',
    '/login',
    '/register',
  ])('%s는 보호 라우트가 아니다', (path) => {
    expect(isProtectedRoute(path)).toBe(false);
  });
});

describe('isAuthRoute', () => {
  it.each([
    '/login',
    '/register',
  ])('%s는 인증 라우트이다', (path) => {
    expect(isAuthRoute(path)).toBe(true);
  });

  it.each([
    '/',
    '/courses',
    '/dashboard',
    '/profile',
  ])('%s는 인증 라우트가 아니다', (path) => {
    expect(isAuthRoute(path)).toBe(false);
  });
});
