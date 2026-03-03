import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard', '/admin', '/profile', '/courses'];
const AUTH_PREFIXES = ['/login', '/register'];
const COOKIE_NAME = 'learniverse_has_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.get(COOKIE_NAME)?.value === 'true';

  // Authenticated user visiting auth pages → redirect to dashboard
  if (hasSession && AUTH_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Unauthenticated user visiting protected pages → redirect to login
  if (!hasSession && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/profile/:path*', '/courses/:path*', '/login', '/register'],
};
