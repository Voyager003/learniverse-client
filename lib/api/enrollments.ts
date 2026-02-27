import { apiClient } from '@/lib/api/client';
import type {
  EnrollmentResponse,
  CreateEnrollmentRequest,
  UpdateProgressRequest,
  PaginatedData,
} from '@/lib/types';

export const enrollmentsApi = {
  getMyEnrollments: () =>
    apiClient.get<PaginatedData<EnrollmentResponse>>('/enrollments/my'),

  getEnrollment: (id: string) =>
    apiClient.get<EnrollmentResponse>(`/enrollments/${id}`),

  createEnrollment: (body: CreateEnrollmentRequest) =>
    apiClient.post<EnrollmentResponse>('/enrollments', body),

  updateProgress: (id: string, body: UpdateProgressRequest) =>
    apiClient.patch<EnrollmentResponse>(`/enrollments/${id}/progress`, body),
};
