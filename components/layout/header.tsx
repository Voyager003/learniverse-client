'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { MobileNav } from '@/components/layout/mobile-nav';
import { UserMenu } from '@/components/layout/user-menu';
import { useAuthStore } from '@/lib/store/auth-store';

const NAV_ITEMS = [
  { label: '강의 탐색', href: '/courses' },
];

export function Header() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* Mobile nav */}
        <MobileNav items={NAV_ITEMS} />

        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center gap-2 font-bold">
          Learniverse
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">회원가입</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
