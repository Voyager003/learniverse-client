import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { ApiClientError } from '@/lib/api/client';

const { mockPush, mockToastSuccess, mockToastError, mockEnroll } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockToastSuccess: vi.fn(),
  mockToastError: vi.fn(),
  mockEnroll: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: mockToastSuccess,
    error: mockToastError,
  },
}));

vi.mock('@/lib/store/auth-store', () => ({
  useAuthStore: (selector: (state: { isAuthenticated: boolean }) => boolean) =>
    selector({ isAuthenticated: true }),
}));

vi.mock('@/lib/hooks/use-enrollments', () => ({
  useCreateEnrollment: () => ({
    mutateAsync: mockEnroll,
    isPending: false,
  }),
}));

vi.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AlertDialogTrigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AlertDialogContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
  AlertDialogDescription: ({ children }: { children: ReactNode }) => <p>{children}</p>,
  AlertDialogFooter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AlertDialogCancel: ({ children }: { children: ReactNode }) => <button>{children}</button>,
  AlertDialogAction: ({
    children,
    onClick,
    disabled,
  }: {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

import { EnrollButton } from '@/components/enrollments/enroll-button';

describe('EnrollButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('수강 신청 성공 시 성공 메시지 후 대시보드로 이동한다', async () => {
    mockEnroll.mockResolvedValueOnce({});
    render(<EnrollButton courseId="course-1" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: '확인' }));

    await waitFor(() => expect(mockEnroll).toHaveBeenCalledWith({ courseId: 'course-1' }));
    expect(mockToastSuccess).toHaveBeenCalledWith('수강 신청이 완료되었습니다');
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('이미 수강 중(409)인 경우 안내 메시지 후 대시보드로 이동한다', async () => {
    mockEnroll.mockRejectedValueOnce(
      new ApiClientError(409, 'Already enrolled in this course'),
    );
    render(<EnrollButton courseId="course-1" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: '확인' }));

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('이미 수강 중인 강의입니다.');
    });
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('튜터가 수강 신청(403)하면 명확한 안내 메시지를 표시한다', async () => {
    mockEnroll.mockRejectedValueOnce(new ApiClientError(403, 'Insufficient permissions'));
    render(<EnrollButton courseId="course-1" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: '확인' }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('튜터는 수강 신청이 불가능합니다.');
    });
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockToastSuccess).not.toHaveBeenCalled();
  });

  it('일반 실패 시 에러 메시지를 표시한다', async () => {
    mockEnroll.mockRejectedValueOnce(new Error('network error'));
    render(<EnrollButton courseId="course-1" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: '확인' }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        '수강 신청에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('확인을 빠르게 여러 번 눌러도 요청은 1회만 전송된다', async () => {
    let resolveRequest: (() => void) | undefined;
    const pending = new Promise<void>((resolve) => {
      resolveRequest = resolve;
    });
    mockEnroll.mockReturnValueOnce(pending);

    render(<EnrollButton courseId="course-1" />);
    const user = userEvent.setup();
    const confirmButton = screen.getByRole('button', { name: '확인' });

    await user.click(confirmButton);
    await user.click(confirmButton);

    expect(mockEnroll).toHaveBeenCalledTimes(1);

    resolveRequest?.();
    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('수강 신청이 완료되었습니다');
    });
  });
});
