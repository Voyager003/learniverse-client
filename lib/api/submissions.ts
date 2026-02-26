import { apiClient } from '@/lib/api/client';
import type {
  SubmissionResponse,
  CreateSubmissionRequest,
  AddFeedbackRequest,
} from '@/lib/types';

export const submissionsApi = {
  getSubmissions: (assignmentId: string) =>
    apiClient.get<SubmissionResponse[]>(`/assignments/${assignmentId}/submissions`),

  createSubmission: (assignmentId: string, body: CreateSubmissionRequest) =>
    apiClient.post<SubmissionResponse>(`/assignments/${assignmentId}/submissions`, body),

  addFeedback: (assignmentId: string, submissionId: string, body: AddFeedbackRequest) =>
    apiClient.post<SubmissionResponse>(
      `/assignments/${assignmentId}/submissions/${submissionId}/feedback`,
      body,
    ),
};
