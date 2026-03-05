export interface AssignmentResponse {
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

export interface CreateAssignmentRequest {
  title: string;
  description: string;
  dueDate?: string;
}

export interface UpdateAssignmentRequest {
  title?: string;
  description?: string;
  dueDate?: string;
}
