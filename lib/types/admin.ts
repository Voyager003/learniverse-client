import type { PaginationQuery } from './api';
import type { EnrollmentResponse } from './enrollment';
import { CourseCategory, CourseDifficulty, Role, SubmissionStatus } from './enums';

export interface AdminUserQuery extends PaginationQuery {
  search?: string;
  role?: Role;
  isActive?: boolean;
}

export interface UpdateAdminUserStatusRequest {
  isActive: boolean;
  reason?: string;
}

export interface UpdateAdminUserRoleRequest {
  role: Role;
  reason?: string;
}

export interface AdminModerationRequest {
  isHidden: boolean;
  reason?: string;
}

export interface AdminModerationFields {
  isAdminHidden: boolean;
  adminHiddenReason: string | null;
  adminHiddenAt: string | null;
}

export interface AdminCourseQuery extends PaginationQuery {
  tutorId?: string;
  isPublished?: boolean;
  isAdminHidden?: boolean;
}

export interface AdminCourseResponse extends AdminModerationFields {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  tutorId: string;
  tutorName?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAssignmentQuery extends PaginationQuery {
  courseId?: string;
  isPublished?: boolean;
  isAdminHidden?: boolean;
}

export interface AdminAssignmentResponse extends AdminModerationFields {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseTitle?: string;
  dueDate: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSubmissionQuery extends PaginationQuery {
  courseId?: string;
  assignmentId?: string;
  studentId?: string;
  status?: SubmissionStatus;
  isAdminHidden?: boolean;
}

export interface AdminSubmissionResponse extends AdminModerationFields {
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

export interface AdminEnrollmentQuery extends PaginationQuery {
  studentId?: string;
  courseId?: string;
  status?: EnrollmentResponse['status'];
}

export type AdminEnrollmentResponse = EnrollmentResponse;

export type AdminIdempotencyStatus = 'processing' | 'completed';

export interface AdminIdempotencyKeyQuery extends PaginationQuery {
  userId?: string;
  path?: string;
  status?: AdminIdempotencyStatus;
  from?: string;
  to?: string;
}

export interface AdminIdempotencyKeyResponse {
  id: string;
  userId: string;
  method: string;
  path: string;
  key: string;
  status: AdminIdempotencyStatus;
  responseStatus: number | null;
  responseBody: Record<string, unknown> | null;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuditLogQuery extends PaginationQuery {
  actorId?: string;
  action?: string;
  resourceType?: string;
  from?: string;
  to?: string;
}

export interface AdminAuditLogResponse {
  id: string;
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}
