/** Routes that require authentication */
export const PROTECTED_ROUTES = ['/dashboard', '/admin', '/profile', '/courses'];

/** Routes only for unauthenticated users */
export const AUTH_ROUTES = ['/login', '/register'];

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
