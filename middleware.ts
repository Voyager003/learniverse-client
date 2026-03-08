import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { resolveAuthRedirect } from '@/lib/utils/auth-route';

const COOKIE_NAME = 'learniverse_has_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.get(COOKIE_NAME)?.value === 'true';
  const redirect = resolveAuthRedirect(pathname, hasSession);

  if (!redirect) {
    return NextResponse.next();
  }

  const redirectUrl = new URL(redirect.pathname, request.url);

  if (redirect.callbackUrl) {
    redirectUrl.searchParams.set('callbackUrl', redirect.callbackUrl);
  }

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/admin/:path*',
    '/profile/:path*',
    '/courses/:path*',
    '/login',
    '/register',
  ],
};
