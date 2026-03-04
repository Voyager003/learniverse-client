import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    prefetch,
    ...props
  }: React.ComponentProps<'a'> & { prefetch?: boolean }) => (
    <a href={href} data-prefetch={prefetch === false ? 'false' : 'true'} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import { MobileNav } from '@/components/layout/mobile-nav';

describe('MobileNav', () => {
  it('보호 라우트 링크는 prefetch를 비활성화할 수 있다', () => {
    render(
      <MobileNav
        items={[{ label: '강의 탐색', href: '/courses', prefetch: false }]}
      />,
    );

    const coursesLink = screen.getByRole('link', { name: '강의 탐색' });
    expect(coursesLink).toHaveAttribute('data-prefetch', 'false');
  });

  it('prefetch 값이 없으면 기본 prefetch 동작을 유지한다', () => {
    render(
      <MobileNav
        items={[{ label: '프로필', href: '/profile' }]}
      />,
    );

    const profileLink = screen.getByRole('link', { name: '프로필' });
    expect(profileLink).toHaveAttribute('data-prefetch', 'true');
  });
});
