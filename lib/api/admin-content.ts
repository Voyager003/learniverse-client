import { apiClient } from '@/lib/api/client';
import { buildQueryString } from '@/lib/utils/query-string';
import type {
  AdminAssignmentQuery,
  AdminAssignmentResponse,
  AdminCourseQuery,
  AdminCourseResponse,
  AdminModerationRequest,
  AdminSubmissionQuery,
  AdminSubmissionResponse,
  PaginatedData,
} from '@/lib/types';

export const adminContentApi = {
  getCourses: (query?: AdminCourseQuery) =>
    apiClient.get<PaginatedData<AdminCourseResponse>>(`/admin/courses${buildQueryString(query)}`),

  getCourse: (id: string) =>
    apiClient.get<AdminCourseResponse>(`/admin/courses/${id}`),

  updateCourseModeration: (id: string, body: AdminModerationRequest) =>
    apiClient.patch<AdminCourseResponse>(`/admin/courses/${id}/moderation`, body),

  getAssignments: (query?: AdminAssignmentQuery) =>
    apiClient.get<PaginatedData<AdminAssignmentResponse>>(
      `/admin/assignments${buildQueryString(query)}`,
    ),

  getAssignment: (id: string) =>
    apiClient.get<AdminAssignmentResponse>(`/admin/assignments/${id}`),

  updateAssignmentModeration: (id: string, body: AdminModerationRequest) =>
    apiClient.patch<AdminAssignmentResponse>(`/admin/assignments/${id}/moderation`, body),

  getSubmissions: (query?: AdminSubmissionQuery) =>
    apiClient.get<PaginatedData<AdminSubmissionResponse>>(
      `/admin/submissions${buildQueryString(query)}`,
    ),

  getSubmission: (id: string) =>
    apiClient.get<AdminSubmissionResponse>(`/admin/submissions/${id}`),

  updateSubmissionModeration: (id: string, body: AdminModerationRequest) =>
    apiClient.patch<AdminSubmissionResponse>(`/admin/submissions/${id}/moderation`, body),
};
