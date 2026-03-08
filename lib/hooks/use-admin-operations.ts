'use client';

import { useQuery } from '@tanstack/react-query';
import { adminOperationsApi } from '@/lib/api/admin-operations';
import type { AdminEnrollmentQuery, AdminIdempotencyKeyQuery } from '@/lib/types';

const ADMIN_ENROLLMENTS_KEY = 'admin-enrollments';
const ADMIN_IDEMPOTENCY_KEYS_KEY = 'admin-idempotency-keys';

export function useAdminEnrollments(query?: AdminEnrollmentQuery) {
  return useQuery({
    queryKey: [ADMIN_ENROLLMENTS_KEY, query],
    queryFn: () => adminOperationsApi.getEnrollments(query),
  });
}

export function useAdminEnrollment(id: string | null) {
  return useQuery({
    queryKey: [ADMIN_ENROLLMENTS_KEY, id],
    queryFn: () => adminOperationsApi.getEnrollment(id!),
    enabled: !!id,
  });
}

export function useAdminIdempotencyKeys(query?: AdminIdempotencyKeyQuery) {
  return useQuery({
    queryKey: [ADMIN_IDEMPOTENCY_KEYS_KEY, query],
    queryFn: () => adminOperationsApi.getIdempotencyKeys(query),
  });
}
