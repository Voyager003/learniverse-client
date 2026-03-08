import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
}));

vi.mock('@/lib/api/client', () => ({
  apiClient: {
    get: mockGet,
  },
}));

import { adminOperationsApi } from '@/lib/api/admin-operations';

describe('adminOperationsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('관리자 수강 목록을 query string과 함께 조회한다', async () => {
    mockGet.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 });

    await adminOperationsApi.getEnrollments({
      page: 1,
      limit: 10,
      studentId: 'student-1',
      status: 'active',
    });

    expect(mockGet).toHaveBeenCalledWith(
      '/admin/enrollments?page=1&limit=10&studentId=student-1&status=active',
    );
  });

  it('관리자 수강 상세를 조회한다', async () => {
    mockGet.mockResolvedValueOnce({ id: 'enrollment-1' });

    await adminOperationsApi.getEnrollment('enrollment-1');

    expect(mockGet).toHaveBeenCalledWith('/admin/enrollments/enrollment-1');
  });

  it('관리자 멱등성 키 목록을 query string과 함께 조회한다', async () => {
    mockGet.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 });

    await adminOperationsApi.getIdempotencyKeys({
      page: 1,
      limit: 10,
      path: '/api/v1/enrollments',
      status: 'completed',
      from: '2026-03-01T00:00:00.000Z',
      to: '2026-03-02T00:00:00.000Z',
    });

    expect(mockGet).toHaveBeenCalledWith(
      '/admin/idempotency-keys?page=1&limit=10&path=%2Fapi%2Fv1%2Fenrollments&status=completed&from=2026-03-01T00%3A00%3A00.000Z&to=2026-03-02T00%3A00%3A00.000Z',
    );
  });
});
