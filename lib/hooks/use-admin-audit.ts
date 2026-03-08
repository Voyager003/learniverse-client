'use client';

import { useQuery } from '@tanstack/react-query';
import { adminAuditApi } from '@/lib/api/admin-audit';
import type { AdminAuditLogQuery } from '@/lib/types';

const ADMIN_AUDIT_LOGS_KEY = 'admin-audit-logs';

export function useAdminAuditLogs(query?: AdminAuditLogQuery) {
  return useQuery({
    queryKey: [ADMIN_AUDIT_LOGS_KEY, query],
    queryFn: () => adminAuditApi.getAuditLogs(query),
  });
}
