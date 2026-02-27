import { apiClient } from '@/lib/api/client';
import { buildCourseQueryString } from '@/lib/utils/query-string';
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

export const coursesApi = {
  getCourses: (query?: CourseQuery) =>
    apiClient.get<PaginatedData<CourseResponse>>(`/courses${buildCourseQueryString(query)}`),

  getMyCourses: (tutorId: string) =>
    apiClient.get<PaginatedData<CourseResponse>>('/courses?page=1&limit=100')
      .then((result) => result.data.filter((c) => c.tutorId === tutorId)),

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
