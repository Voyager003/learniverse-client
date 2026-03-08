import { apiClient } from '@/lib/api/client';
import { buildQueryString } from '@/lib/utils/query-string';
import type { AdminAuditLogQuery, AdminAuditLogResponse, PaginatedData } from '@/lib/types';

export const adminAuditApi = {
  getAuditLogs: (query?: AdminAuditLogQuery) =>
    apiClient.get<PaginatedData<AdminAuditLogResponse>>(
      `/admin/audit-logs${buildQueryString(query)}`,
    ),
};
