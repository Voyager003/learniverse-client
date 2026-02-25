import { CourseCategory, CourseDifficulty } from './enums';
import { PaginationQuery } from './api';

export interface LectureResponse {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  order: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseResponse {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  isPublished: boolean;
  tutorId: string;
  tutorName?: string;
  lectures?: LectureResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  category?: CourseCategory;
  difficulty?: CourseDifficulty;
  isPublished?: boolean;
}

export interface CourseQuery extends PaginationQuery {
  category?: CourseCategory;
  difficulty?: CourseDifficulty;
}

export interface CreateLectureRequest {
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
}

export interface UpdateLectureRequest {
  title?: string;
  content?: string;
  videoUrl?: string;
  order?: number;
}
