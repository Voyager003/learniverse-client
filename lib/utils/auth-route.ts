export const PROTECTED_PREFIXES = ['/dashboard', '/admin', '/profile', '/courses'];
export const AUTH_PREFIXES = ['/login', '/register', '/admin/login', '/admin/register'];

export type MiddlewareRedirect = {
  pathname: '/dashboard' | '/login' | '/admin/login';
  callbackUrl?: string;
};

export function resolveAuthRedirect(
  pathname: string,
  hasSession: boolean,
): MiddlewareRedirect | null {
  if (hasSession && pathname === '/') {
    return { pathname: '/dashboard' };
  }

  if (hasSession && AUTH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return { pathname: '/dashboard' };
  }

  if (
    !hasSession &&
    pathname !== '/admin/login' &&
    pathname !== '/admin/register' &&
    pathname.startsWith('/admin')
  ) {
    return {
      pathname: '/admin/login',
      callbackUrl: pathname,
    };
  }

  if (
    !hasSession &&
    PROTECTED_PREFIXES.filter((prefix) => prefix !== '/admin').some((prefix) =>
      pathname.startsWith(prefix),
    )
  ) {
    return {
      pathname: '/login',
      callbackUrl: pathname,
    };
  }

  return null;
}
