import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CourseCategory, CourseDifficulty } from '@/lib/types';

const {
  mockCreateCourse,
  mockUpdateCourse,
  mockPush,
  mockToastSuccess,
  mockToastError,
} = vi.hoisted(() => ({
  mockCreateCourse: vi.fn(),
  mockUpdateCourse: vi.fn(),
  mockPush: vi.fn(),
  mockToastSuccess: vi.fn(),
  mockToastError: vi.fn(),
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

vi.mock('@/lib/hooks/use-courses', () => ({
  useCreateCourse: () => ({
    mutateAsync: mockCreateCourse,
    isPending: false,
  }),
  useUpdateCourse: () => ({
    mutateAsync: mockUpdateCourse,
    isPending: false,
  }),
}));

vi.mock('@/components/courses/course-form', () => ({
  CourseForm: ({ onSubmit }: { onSubmit: (values: {
    title: string;
    description: string;
    category: CourseCategory;
    difficulty: CourseDifficulty;
  }) => Promise<void> }) => (
    <button
      type="button"
      onClick={() => void onSubmit({
        title: '테스트 강의',
        description: '테스트 설명',
        category: CourseCategory.PROGRAMMING,
        difficulty: CourseDifficulty.BEGINNER,
      })}
    >
      mock-submit
    </button>
  ),
}));

import NewCoursePage from '@/app/(main)/dashboard/tutor/courses/new/page';

describe('NewCoursePage', () => {
  beforeEach(() => {
    mockCreateCourse.mockReset();
    mockUpdateCourse.mockReset();
    mockPush.mockReset();
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
  });

  it('기본값(생성 후 바로 공개)으로 생성 시 공개 처리 후 대시보드로 이동한다', async () => {
    mockCreateCourse.mockResolvedValueOnce({ id: 'course-123' });
    mockUpdateCourse.mockResolvedValueOnce({ id: 'course-123', isPublished: true });
    render(<NewCoursePage />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'mock-submit' }));

    expect(mockCreateCourse).toHaveBeenCalledWith({
      title: '테스트 강의',
      description: '테스트 설명',
      category: CourseCategory.PROGRAMMING,
      difficulty: CourseDifficulty.BEGINNER,
    });
    expect(mockUpdateCourse).toHaveBeenCalledWith({
      id: 'course-123',
      body: { isPublished: true },
    });
    expect(mockPush).toHaveBeenCalledWith('/dashboard/tutor');
    expect(mockToastSuccess).toHaveBeenCalledWith('강의가 생성되고 즉시 공개되었습니다.');
  });

  it('생성 후 바로 공개를 끄면 draft 상태로 생성하고 대시보드로 이동한다', async () => {
    mockCreateCourse.mockResolvedValueOnce({ id: 'course-123' });
    render(<NewCoursePage />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('switch', { name: '생성 후 바로 공개' }));
    await user.click(screen.getByRole('button', { name: 'mock-submit' }));

    expect(mockUpdateCourse).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/dashboard/tutor');
    expect(mockToastSuccess).toHaveBeenCalledWith('강의가 비공개(draft) 상태로 생성되었습니다.');
  });

  it('강의 생성 실패 시 에러 토스트를 노출한다', async () => {
    mockCreateCourse.mockRejectedValueOnce(new Error('failed'));
    render(<NewCoursePage />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'mock-submit' }));

    expect(mockPush).not.toHaveBeenCalled();
    expect(mockUpdateCourse).not.toHaveBeenCalled();
    expect(mockToastError).toHaveBeenCalledWith('강의 생성에 실패했습니다');
  });
});
