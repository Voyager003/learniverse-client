import { apiClient } from '@/lib/api/client';
import type {
  CourseResponse,
  CourseQuery,
  CreateCourseRequest,
  UpdateCourseRequest,
  LectureResponse,
  CreateLectureRequest,
  UpdateLectureRequest,
  PaginatedData,
} from '@/lib/types';

function buildQueryString(query?: CourseQuery): string {
  if (!query) return '';

  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.category) params.set('category', query.category);
  if (query.difficulty) params.set('difficulty', query.difficulty);

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const coursesApi = {
  getCourses: (query?: CourseQuery) =>
    apiClient.get<PaginatedData<CourseResponse>>(`/courses${buildQueryString(query)}`),

  getCourse: (id: string) =>
    apiClient.get<CourseResponse>(`/courses/${id}`),

  createCourse: (body: CreateCourseRequest) =>
    apiClient.post<CourseResponse>('/courses', body),

  updateCourse: (id: string, body: UpdateCourseRequest) =>
    apiClient.patch<CourseResponse>(`/courses/${id}`, body),

  deleteCourse: (id: string) =>
    apiClient.delete(`/courses/${id}`),

  // Lecture CRUD
  createLecture: (courseId: string, body: CreateLectureRequest) =>
    apiClient.post<LectureResponse>(`/courses/${courseId}/lectures`, body),

  updateLecture: (courseId: string, lectureId: string, body: UpdateLectureRequest) =>
    apiClient.patch<LectureResponse>(`/courses/${courseId}/lectures/${lectureId}`, body),

  deleteLecture: (courseId: string, lectureId: string) =>
    apiClient.delete(`/courses/${courseId}/lectures/${lectureId}`),
};
