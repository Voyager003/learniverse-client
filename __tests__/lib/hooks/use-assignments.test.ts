import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { AssignmentResponse } from '@/lib/types';

const { mockUpdatePublishStatus } = vi.hoisted(() => ({
  mockUpdatePublishStatus: vi.fn(),
}));

vi.mock('@/lib/api/assignments', () => ({
  assignmentsApi: {
    getAssignments: vi.fn(),
    createAssignment: vi.fn(),
    updatePublishStatus: mockUpdatePublishStatus,
  },
}));

import { useUpdateAssignmentPublish } from '@/lib/hooks/use-assignments';

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useUpdateAssignmentPublish', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('공개 상태 변경 후 과제 목록 캐시를 무효화한다', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const updatedAssignment: AssignmentResponse = {
      id: 'assign-1',
      title: '과제 1',
      description: '설명',
      courseId: 'course-1',
      dueDate: null,
      isPublished: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
    mockUpdatePublishStatus.mockResolvedValueOnce(updatedAssignment);

    const { result } = renderHook(() => useUpdateAssignmentPublish('course-1'), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync({
        assignmentId: 'assign-1',
        body: { isPublished: true },
      });
    });

    expect(mockUpdatePublishStatus).toHaveBeenCalledWith(
      'course-1',
      'assign-1',
      { isPublished: true },
    );
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['assignments', 'course-1'],
    });
  });
});
