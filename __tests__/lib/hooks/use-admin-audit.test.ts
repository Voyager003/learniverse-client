import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockUseQuery } = vi.hoisted(() => ({
  mockUseQuery: vi.fn(),
}));

const { mockGetAuditLogs } = vi.hoisted(() => ({
  mockGetAuditLogs: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

vi.mock('@/lib/api/admin-audit', () => ({
  adminAuditApi: {
    getAuditLogs: mockGetAuditLogs,
  },
}));

import { useAdminAuditLogs } from '@/lib/hooks/use-admin-audit';

describe('useAdminAuditLogs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('감사 로그 query key와 fetcher를 설정한다', async () => {
    const mockResult = { data: { data: [] } };
    mockUseQuery.mockReturnValue(mockResult);

    const query = { page: 1, limit: 10, action: 'users.update_status' };
    const result = useAdminAuditLogs(query);

    expect(result).toBe(mockResult);
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['admin-audit-logs', query] }),
    );

    const options = mockUseQuery.mock.calls[0][0] as { queryFn: () => Promise<unknown> };
    await options.queryFn();
    expect(mockGetAuditLogs).toHaveBeenCalledWith(query);
  });
});
