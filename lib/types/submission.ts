import { SubmissionStatus } from './enums';

export interface SubmissionResponse {
  id: string;
  studentId: string;
  studentName?: string;
  assignmentId: string;
  content: string;
  fileUrls: string[];
  status: SubmissionStatus;
  feedback: string | null;
  score: number | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubmissionRequest {
  content: string;
  fileUrls?: string[];
}

export interface AddFeedbackRequest {
  feedback: string;
  score?: number;
}
