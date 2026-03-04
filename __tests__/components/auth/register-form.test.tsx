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

vi.mock('@/components/ui/select', async () => {
  const React = await import('react');

  type SelectContextValue = {
    value?: string;
    onValueChange?: (value: string) => void;
  };

  const SelectContext = React.createContext<SelectContextValue>({});

  function Select({
    value,
    onValueChange,
    children,
  }: {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
  }) {
    return (
      <SelectContext.Provider value={{ value, onValueChange }}>
        {children}
      </SelectContext.Provider>
    );
  }

  function SelectTrigger({
    className,
  }: {
    className?: string;
  }) {
    const { value = 'student', onValueChange } = React.useContext(SelectContext);
    return (
      <select
        aria-label="역할"
        className={className}
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
      >
        <option value="student">학생</option>
        <option value="tutor">튜터</option>
      </select>
    );
  }

  function SelectValue() {
    return null;
  }

  function SelectContent({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }

  function SelectItem({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }

  return {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  };
});

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
  const nameInput = screen.getByLabelText('이름');
  const emailInput = screen.getByLabelText('이메일');
  const passwordInput = screen.getByLabelText('비밀번호');

  await user.clear(nameInput);
  await user.type(nameInput, '테스트유저');
  await expect(nameInput).toHaveValue('테스트유저');

  await user.clear(emailInput);
  await user.type(emailInput, 'test@example.com');
  await expect(emailInput).toHaveValue('test@example.com');

  await user.clear(passwordInput);
  await user.type(passwordInput, 'password123');
  await expect(passwordInput).toHaveValue('password123');

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

    await waitFor(() => expect(mockRegister).toHaveBeenCalledTimes(1));
    expect(mockRegister).toHaveBeenCalledWith({
      name: '테스트유저',
      email: 'test@example.com',
      password: 'password123',
      role: 'student',
    });
  });

  it('role을 튜터로 선택하면 tutor로 회원가입을 요청한다', async () => {
    mockRegister.mockResolvedValueOnce(undefined);
    render(<RegisterForm />);

    const user = await fillRequiredFields();

    await user.selectOptions(screen.getByRole('combobox', { name: '역할' }), 'tutor');
    await expect(screen.getByRole('combobox', { name: '역할' })).toHaveValue('tutor');
    await user.click(screen.getByRole('button', { name: '회원가입' }));

    await waitFor(() => expect(mockRegister).toHaveBeenCalledTimes(1));
    expect(mockRegister).toHaveBeenCalledWith({
      name: '테스트유저',
      email: 'test@example.com',
      password: 'password123',
      role: 'tutor',
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
