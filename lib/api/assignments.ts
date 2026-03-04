import { apiClient } from '@/lib/api/client';
import type {
  AssignmentResponse,
  CreateAssignmentRequest,
  UpdateAssignmentPublishRequest,
} from '@/lib/types';

export const assignmentsApi = {
  getAssignments: (courseId: string) =>
    apiClient.get<AssignmentResponse[]>(`/courses/${courseId}/assignments`),

  createAssignment: (courseId: string, body: CreateAssignmentRequest) =>
    apiClient.post<AssignmentResponse>(`/courses/${courseId}/assignments`, body),

  updatePublishStatus: (
    courseId: string,
    assignmentId: string,
    body: UpdateAssignmentPublishRequest,
  ) =>
    apiClient.patch<AssignmentResponse>(
      `/courses/${courseId}/assignments/${assignmentId}/publish`,
      body,
    ),
};
