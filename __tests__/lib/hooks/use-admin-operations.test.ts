import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockUseQuery } = vi.hoisted(() => ({
  mockUseQuery: vi.fn(),
}));

const { mockGetEnrollments, mockGetEnrollment, mockGetIdempotencyKeys } = vi.hoisted(() => ({
  mockGetEnrollments: vi.fn(),
  mockGetEnrollment: vi.fn(),
  mockGetIdempotencyKeys: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

vi.mock('@/lib/api/admin-operations', () => ({
  adminOperationsApi: {
    getEnrollments: mockGetEnrollments,
    getEnrollment: mockGetEnrollment,
    getIdempotencyKeys: mockGetIdempotencyKeys,
  },
}));

import {
  useAdminEnrollment,
  useAdminEnrollments,
  useAdminIdempotencyKeys,
} from '@/lib/hooks/use-admin-operations';

describe('useAdminOperations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('수강 목록 query key와 fetcher를 설정한다', async () => {
    const mockResult = { data: { data: [] } };
    mockUseQuery.mockReturnValue(mockResult);

    const query = { page: 1, limit: 10, studentId: 'student-1' };
    const result = useAdminEnrollments(query);

    expect(result).toBe(mockResult);
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['admin-enrollments', query] }),
    );

    const options = mockUseQuery.mock.calls[0][0] as { queryFn: () => Promise<unknown> };
    await options.queryFn();
    expect(mockGetEnrollments).toHaveBeenCalledWith(query);
  });

  it('수강 상세 query를 설정한다', async () => {
    const mockResult = { data: { id: 'enrollment-1' } };
    mockUseQuery.mockReturnValue(mockResult);

    const result = useAdminEnrollment('enrollment-1');

    expect(result).toBe(mockResult);
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['admin-enrollments', 'enrollment-1'], enabled: true }),
    );

    const options = mockUseQuery.mock.calls[0][0] as { queryFn: () => Promise<unknown> };
    await options.queryFn();
    expect(mockGetEnrollment).toHaveBeenCalledWith('enrollment-1');
  });

  it('멱등성 키 목록 query key와 fetcher를 설정한다', async () => {
    const mockResult = { data: { data: [] } };
    mockUseQuery.mockReturnValue(mockResult);

    const query = { page: 1, limit: 10, path: '/api/v1/enrollments' };
    const result = useAdminIdempotencyKeys(query);

    expect(result).toBe(mockResult);
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['admin-idempotency-keys', query] }),
    );

    const options = mockUseQuery.mock.calls[0][0] as { queryFn: () => Promise<unknown> };
    await options.queryFn();
    expect(mockGetIdempotencyKeys).toHaveBeenCalledWith(query);
  });
});
