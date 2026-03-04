import { describe, it, expect, vi } from 'vitest';
import type { CourseResponse, PaginatedData } from '@/lib/types';
import { CourseCategory, CourseDifficulty } from '@/lib/types';

const { mockGet, mockPost, mockPatch, mockDelete } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
  mockPatch: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock('@/lib/api/client', () => ({
  apiClient: {
    get: mockGet,
    post: mockPost,
    patch: mockPatch,
    delete: mockDelete,
  },
}));

import { coursesApi } from '@/lib/api/courses';

const mockCourse: CourseResponse = {
  id: 'course-1',
  title: 'React 기초',
  description: 'React를 배워봅시다',
  category: CourseCategory.PROGRAMMING,
  difficulty: CourseDifficulty.BEGINNER,
  isPublished: true,
  tutorId: 'tutor-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('coursesApi', () => {
  describe('getCourses', () => {
    it('쿼리 파라미터 없이 강의 목록을 조회한다', async () => {
      const paginated: PaginatedData<CourseResponse> = {
        data: [mockCourse],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      mockGet.mockResolvedValueOnce(paginated);

      const result = await coursesApi.getCourses();

      expect(mockGet).toHaveBeenCalledWith('/courses');
      expect(result).toEqual(paginated);
    });

    it('쿼리 파라미터로 필터링하여 조회한다', async () => {
      const paginated: PaginatedData<CourseResponse> = {
        data: [mockCourse],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      mockGet.mockResolvedValueOnce(paginated);

      await coursesApi.getCourses({
        page: 2,
        limit: 5,
        category: CourseCategory.PROGRAMMING,
        difficulty: CourseDifficulty.BEGINNER,
      });

      expect(mockGet).toHaveBeenCalledWith(
        '/courses?page=2&limit=5&category=programming&difficulty=beginner',
      );
    });
  });

  describe('getMyCourses', () => {
    it('튜터 전용 내 강의 목록을 조회한다', async () => {
      const otherTutorCourse: CourseResponse = {
        ...mockCourse,
        id: 'course-2',
        tutorId: 'tutor-2',
      };
      const paginated: PaginatedData<CourseResponse> = {
        data: [mockCourse, otherTutorCourse],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      mockGet.mockResolvedValueOnce(paginated);

      const result = await coursesApi.getMyCourses('tutor-1');

      expect(mockGet).toHaveBeenCalledWith('/courses?page=1&limit=100');
      expect(result).toEqual([mockCourse]);
    });
  });

  describe('getCourse', () => {
    it('ID로 강의 상세를 조회한다', async () => {
      mockGet.mockResolvedValueOnce(mockCourse);

      const result = await coursesApi.getCourse('course-1');

      expect(mockGet).toHaveBeenCalledWith('/courses/course-1');
      expect(result).toEqual(mockCourse);
    });
  });

  describe('createCourse', () => {
    it('새 강의를 생성한다', async () => {
      const body = {
        title: 'React 기초',
        description: 'React를 배워봅시다',
        category: CourseCategory.PROGRAMMING,
        difficulty: CourseDifficulty.BEGINNER,
      };
      mockPost.mockResolvedValueOnce(mockCourse);

      const result = await coursesApi.createCourse(body);

      expect(mockPost).toHaveBeenCalledWith('/courses', body);
      expect(result).toEqual(mockCourse);
    });
  });

  describe('updateCourse', () => {
    it('강의를 수정한다', async () => {
      const body = { title: '수정된 제목' };
      mockPatch.mockResolvedValueOnce({ ...mockCourse, title: '수정된 제목' });

      const result = await coursesApi.updateCourse('course-1', body);

      expect(mockPatch).toHaveBeenCalledWith('/courses/course-1', body);
      expect(result.title).toBe('수정된 제목');
    });
  });

  describe('deleteCourse', () => {
    it('강의를 삭제한다', async () => {
      mockDelete.mockResolvedValueOnce(undefined);

      await coursesApi.deleteCourse('course-1');

      expect(mockDelete).toHaveBeenCalledWith('/courses/course-1');
    });
  });

  describe('Lecture CRUD', () => {
    it('강의의 레슨을 생성한다', async () => {
      const body = { title: '레슨 1', content: '내용', order: 1 };
      mockPost.mockResolvedValueOnce({ id: 'lecture-1', ...body });

      await coursesApi.createLecture('course-1', body);

      expect(mockPost).toHaveBeenCalledWith('/courses/course-1/lectures', body);
    });

    it('레슨을 수정한다', async () => {
      const body = { title: '수정 레슨' };
      mockPatch.mockResolvedValueOnce({ id: 'lecture-1', ...body });

      await coursesApi.updateLecture('course-1', 'lecture-1', body);

      expect(mockPatch).toHaveBeenCalledWith('/courses/course-1/lectures/lecture-1', body);
    });

    it('레슨을 삭제한다', async () => {
      mockDelete.mockResolvedValueOnce(undefined);

      await coursesApi.deleteLecture('course-1', 'lecture-1');

      expect(mockDelete).toHaveBeenCalledWith('/courses/course-1/lectures/lecture-1');
    });
  });
});
