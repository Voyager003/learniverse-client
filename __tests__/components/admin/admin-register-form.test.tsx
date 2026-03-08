import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiClientError } from '@/lib/api/client';

const { mockRegisterAdmin, mockPush, mockToastError, mockToastSuccess } = vi.hoisted(() => ({
  mockRegisterAdmin: vi.fn(),
  mockPush: vi.fn(),
  mockToastError: vi.fn(),
  mockToastSuccess: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.ComponentProps<'a'>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('sonner', () => ({
  toast: {
    success: mockToastSuccess,
    error: mockToastError,
  },
}));

vi.mock('@/lib/hooks/use-auth', () => ({
  useAuth: () => ({
    registerAdmin: mockRegisterAdmin,
    isAdminRegistering: false,
  }),
}));

import { AdminRegisterForm } from '@/components/admin/admin-register-form';

async function fillRequiredFields() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('이름'), '관리자');
  await user.type(screen.getByLabelText('관리자 이메일'), 'admin@example.com');
  await user.type(screen.getByLabelText('비밀번호'), 'password123');
  await user.type(screen.getByLabelText('비밀번호 확인'), 'password123');
  return user;
}

describe('AdminRegisterForm', () => {
  beforeEach(() => {
    mockRegisterAdmin.mockReset();
    mockPush.mockReset();
    mockToastError.mockReset();
    mockToastSuccess.mockReset();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  it('관리자 회원가입 성공 후 로그인 페이지로 이동한다', async () => {
    mockRegisterAdmin.mockResolvedValueOnce({ email: 'admin@example.com', role: 'admin' });
    render(<AdminRegisterForm />);

    const user = await fillRequiredFields();
    await user.click(screen.getByRole('button', { name: '관리자 회원가입' }));

    await waitFor(() => expect(mockRegisterAdmin).toHaveBeenCalledTimes(1));
    expect(mockRegisterAdmin).toHaveBeenCalledWith({
      name: '관리자',
      email: 'admin@example.com',
      password: 'password123',
    });
    expect(window.sessionStorage.getItem('pendingAdminEmail')).toBe('admin@example.com');
    expect(mockToastSuccess).toHaveBeenCalledWith('관리자 회원가입이 완료되었습니다. 로그인해 주세요.');
    expect(mockPush).toHaveBeenCalledWith('/admin/login?registered=1');
  });

  it('409 에러면 중복 이메일 안내 메시지를 보여준다', async () => {
    mockRegisterAdmin.mockRejectedValueOnce(new ApiClientError(409, 'Conflict'));
    render(<AdminRegisterForm />);

    const user = await fillRequiredFields();
    await user.click(screen.getByRole('button', { name: '관리자 회원가입' }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        '이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.',
      );
    });
  });
});
