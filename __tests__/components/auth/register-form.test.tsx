import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiClientError } from '@/lib/api/client';

const { mockRegister, mockPush, mockToastError, mockToastSuccess } = vi.hoisted(() => ({
  mockRegister: vi.fn(),
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
    register: mockRegister,
    isRegistering: false,
  }),
}));

import { RegisterForm } from '@/components/auth/register-form';

if (!HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = () => false;
}
if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = () => {};
}
if (!HTMLElement.prototype.releasePointerCapture) {
  HTMLElement.prototype.releasePointerCapture = () => {};
}
if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = () => {};
}

async function fillRequiredFields() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('이름'), '테스트유저');
  await user.type(screen.getByLabelText('이메일'), 'test@example.com');
  await user.type(screen.getByLabelText('비밀번호'), 'password123');
  return user;
}

describe('RegisterForm', () => {
  beforeEach(() => {
    mockRegister.mockReset();
    mockPush.mockReset();
    mockToastError.mockReset();
    mockToastSuccess.mockReset();
  });

  it('기본 role(student)로 회원가입을 요청한다', async () => {
    mockRegister.mockResolvedValueOnce(undefined);
    render(<RegisterForm />);

    const user = await fillRequiredFields();
    await user.click(screen.getByRole('button', { name: '회원가입' }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: '테스트유저',
        email: 'test@example.com',
        password: 'password123',
        role: 'student',
      });
    });
  });

  it('role을 튜터로 선택하면 tutor로 회원가입을 요청한다', async () => {
    mockRegister.mockResolvedValueOnce(undefined);
    render(<RegisterForm />);

    const user = await fillRequiredFields();

    await user.click(screen.getByRole('combobox', { name: '역할' }));
    await user.click(await screen.findByRole('option', { name: '튜터' }));
    await user.click(screen.getByRole('button', { name: '회원가입' }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: '테스트유저',
        email: 'test@example.com',
        password: 'password123',
        role: 'tutor',
      });
    });
  });

  it('409 에러면 중복 이메일 안내 메시지를 보여준다', async () => {
    mockRegister.mockRejectedValueOnce(new ApiClientError(409, 'Conflict'));
    render(<RegisterForm />);

    const user = await fillRequiredFields();
    await user.click(screen.getByRole('button', { name: '회원가입' }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        '이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.',
      );
    });
  });

  it('400 에러면 입력값 확인 안내 메시지를 보여준다', async () => {
    mockRegister.mockRejectedValueOnce(new ApiClientError(400, 'Bad Request'));
    render(<RegisterForm />);

    const user = await fillRequiredFields();
    await user.click(screen.getByRole('button', { name: '회원가입' }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        '회원가입 요청이 올바르지 않습니다. 입력값을 확인해주세요.',
      );
    });
  });
});
