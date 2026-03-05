import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockUseQuery } = vi.hoisted(() => ({
  mockUseQuery: vi.fn(),
}));

const { mockGetAssignments } = vi.hoisted(() => ({
  mockGetAssignments: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock('@/lib/api/assignments', () => ({
  assignmentsApi: {
    getAssignments: mockGetAssignments,
    createAssignment: vi.fn(),
  },
}));

import { useAssignments } from '@/lib/hooks/use-assignments';

describe('useAssignments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('마운트 시 항상 최신 과제 목록을 재요청하도록 쿼리 옵션을 설정한다', async () => {
    const mockResult = { data: [] };
    mockUseQuery.mockReturnValue(mockResult);

    const result = useAssignments('course-1');

    expect(result).toBe(mockResult);
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['assignments', 'course-1'],
        enabled: true,
        staleTime: 0,
        refetchOnMount: 'always',
      }),
    );

    const options = mockUseQuery.mock.calls[0][0] as {
      queryFn: () => Promise<unknown>;
    };
    await options.queryFn();
    expect(mockGetAssignments).toHaveBeenCalledWith('course-1');
  });
});
