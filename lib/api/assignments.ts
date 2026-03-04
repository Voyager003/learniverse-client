import { apiClient } from '@/lib/api/client';
import type {
  AssignmentResponse,
  CreateAssignmentRequest,
} from '@/lib/types';

export const assignmentsApi = {
  getAssignments: (courseId: string) =>
    apiClient.get<AssignmentResponse[]>(`/courses/${courseId}/assignments`),

  createAssignment: (courseId: string, body: CreateAssignmentRequest) =>
    apiClient.post<AssignmentResponse>(`/courses/${courseId}/assignments`, body),
};
