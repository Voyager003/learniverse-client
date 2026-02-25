import { EnrollmentStatus } from './enums';

export interface EnrollmentResponse {
  id: string;
  studentId: string;
  studentName?: string;
  courseId: string;
  courseTitle?: string;
  status: EnrollmentStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnrollmentRequest {
  courseId: string;
}

export interface UpdateProgressRequest {
  progress: number;
}
