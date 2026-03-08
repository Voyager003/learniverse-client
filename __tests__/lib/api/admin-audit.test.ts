import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
}));

vi.mock('@/lib/api/client', () => ({
  apiClient: {
    get: mockGet,
  },
}));

import { adminAuditApi } from '@/lib/api/admin-audit';

describe('adminAuditApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('관리자 감사 로그 목록을 query string과 함께 조회한다', async () => {
    mockGet.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 });

    await adminAuditApi.getAuditLogs({
      page: 1,
      limit: 10,
      actorId: 'admin-1',
      action: 'users.update_status',
      resourceType: 'user',
    });

    expect(mockGet).toHaveBeenCalledWith(
      '/admin/audit-logs?page=1&limit=10&actorId=admin-1&action=users.update_status&resourceType=user',
    );
  });
});
