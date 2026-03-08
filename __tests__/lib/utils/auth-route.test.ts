import { describe, expect, it } from 'vitest';
import { resolveAuthRedirect } from '@/lib/utils/auth-route';

describe('resolveAuthRedirect', () => {
  it('인증된 사용자가 홈에 접근하면 대시보드로 보낸다', () => {
    expect(resolveAuthRedirect('/', true)).toEqual({ pathname: '/dashboard' });
  });

  it('인증된 사용자가 관리자 로그인 페이지에 접근하면 대시보드로 보낸다', () => {
    expect(resolveAuthRedirect('/admin/login', true)).toEqual({ pathname: '/dashboard' });
  });

  it('비인증 사용자가 관리자 보호 경로에 접근하면 관리자 로그인으로 보낸다', () => {
    expect(resolveAuthRedirect('/admin/users', false)).toEqual({
      pathname: '/admin/login',
      callbackUrl: '/admin/users',
    });
  });

  it('비인증 사용자가 일반 보호 경로에 접근하면 일반 로그인으로 보낸다', () => {
    expect(resolveAuthRedirect('/courses/my', false)).toEqual({
      pathname: '/login',
      callbackUrl: '/courses/my',
    });
  });

  it('비인증 사용자는 관리자 로그인 페이지에 직접 접근할 수 있다', () => {
    expect(resolveAuthRedirect('/admin/login', false)).toBeNull();
  });
});
