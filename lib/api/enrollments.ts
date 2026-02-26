import { apiClient } from '@/lib/api/client';
import type {
  EnrollmentResponse,
  CreateEnrollmentRequest,
  UpdateProgressRequest,
} from '@/lib/types';

export const enrollmentsApi = {
  getMyEnrollments: () =>
    apiClient.get<EnrollmentResponse[]>('/enrollments/me'),

  getEnrollment: (id: string) =>
    apiClient.get<EnrollmentResponse>(`/enrollments/${id}`),

  createEnrollment: (body: CreateEnrollmentRequest) =>
    apiClient.post<EnrollmentResponse>('/enrollments', body),

  updateProgress: (id: string, body: UpdateProgressRequest) =>
    apiClient.patch<EnrollmentResponse>(`/enrollments/${id}/progress`, body),
};
