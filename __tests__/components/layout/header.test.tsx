import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const mockUseAuthStore = vi.fn();

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

vi.mock('@/lib/store/auth-store', () => ({
  useAuthStore: (selector: (state: { isAuthenticated: boolean; isAuthInitialized: boolean }) => unknown) =>
    selector(mockUseAuthStore()),
}));

vi.mock('@/components/layout/theme-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

vi.mock('@/components/layout/mobile-nav', () => ({
  MobileNav: () => <div data-testid="mobile-nav" />,
}));

vi.mock('@/components/layout/user-menu', () => ({
  UserMenu: () => <div data-testid="user-menu" />,
}));

import { Header } from '@/components/layout/header';

describe('Header', () => {
  beforeEach(() => {
    mockUseAuthStore.mockReset();
  });

  it('인증 초기화 전에는 인증 상태 skeleton을 보여준다', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      isAuthInitialized: false,
    });

    render(<Header />);

    expect(screen.getByTestId('auth-status-skeleton')).toBeInTheDocument();
  });

  it('초기화 후 비로그인 상태면 로그인/회원가입 버튼을 보여준다', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      isAuthInitialized: true,
    });

    render(<Header />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '회원가입' })).toBeInTheDocument();
  });

  it('초기화 후 로그인 상태면 사용자 메뉴를 보여준다', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      isAuthInitialized: true,
    });

    render(<Header />);

    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '로그인' })).not.toBeInTheDocument();
  });

  it('강의 탐색 링크는 prefetch가 비활성화된다', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      isAuthInitialized: true,
    });

    render(<Header />);

    const coursesLink = screen.getByRole('link', { name: '강의 탐색' });
    expect(coursesLink).toHaveAttribute('data-prefetch', 'false');
  });
});
