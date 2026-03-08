import { apiClient } from '@/lib/api/client';
import { buildQueryString } from '@/lib/utils/query-string';
import type {
  AdminEnrollmentQuery,
  AdminEnrollmentResponse,
  AdminIdempotencyKeyQuery,
  AdminIdempotencyKeyResponse,
  PaginatedData,
} from '@/lib/types';

export const adminOperationsApi = {
  getEnrollments: (query?: AdminEnrollmentQuery) =>
    apiClient.get<PaginatedData<AdminEnrollmentResponse>>(
      `/admin/enrollments${buildQueryString(query)}`,
    ),

  getEnrollment: (id: string) => apiClient.get<AdminEnrollmentResponse>(`/admin/enrollments/${id}`),

  getIdempotencyKeys: (query?: AdminIdempotencyKeyQuery) =>
    apiClient.get<PaginatedData<AdminIdempotencyKeyResponse>>(
      `/admin/idempotency-keys${buildQueryString(query)}`,
    ),
};
