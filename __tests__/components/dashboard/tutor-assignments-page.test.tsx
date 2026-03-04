import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AssignmentResponse } from '@/lib/types';

const {
  mockCreateAssignment,
  mockUpdateAssignmentPublish,
  mockPush,
  mockToastSuccess,
  mockToastError,
  mockAssignments,
} = vi.hoisted(() => ({
  mockCreateAssignment: vi.fn(),
  mockUpdateAssignmentPublish: vi.fn(),
  mockPush: vi.fn(),
  mockToastSuccess: vi.fn(),
  mockToastError: vi.fn(),
  mockAssignments: [
    {
      id: 'assign-1',
      title: '시드 과제',
      description: '설명',
      courseId: 'course-1',
      dueDate: null,
      isPublished: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ] as AssignmentResponse[],
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

vi.mock('@/lib/hooks/use-assignments', () => ({
  useAssignments: () => ({
    data: mockAssignments,
    isLoading: false,
  }),
  useCreateAssignment: () => ({
    mutateAsync: mockCreateAssignment,
    isPending: false,
  }),
  useUpdateAssignmentPublish: () => ({
    mutateAsync: mockUpdateAssignmentPublish,
    isPending: false,
  }),
}));

vi.mock('@/components/assignments/assignment-card', () => ({
  AssignmentCard: ({
    assignment,
    actions,
  }: {
    assignment: AssignmentResponse;
    actions?: React.ReactNode;
  }) => (
    <section>
      <h2>{assignment.title}</h2>
      {actions}
    </section>
  ),
}));

import TutorAssignmentsPage from '@/app/(main)/dashboard/tutor/courses/[id]/assignments/page';

describe('TutorAssignmentsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAssignments[0].isPublished = false;
  });

  it('과제 공개 스위치를 클릭하면 공개 상태 변경을 요청한다', async () => {
    mockUpdateAssignmentPublish.mockResolvedValueOnce({
      ...mockAssignments[0],
      isPublished: true,
    });

    await act(async () => {
      render(<TutorAssignmentsPage params={Promise.resolve({ id: 'course-1' })} />);
    });

    const user = userEvent.setup();
    const publishSwitch = await screen.findByRole('switch', {
      name: '시드 과제 공개 상태',
    });
    await user.click(publishSwitch);

    expect(mockUpdateAssignmentPublish).toHaveBeenCalledWith({
      assignmentId: 'assign-1',
      body: { isPublished: true },
    });
    expect(mockToastSuccess).toHaveBeenCalledWith('과제가 공개되었습니다');
  });
});
