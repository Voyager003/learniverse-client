import { describe, it, expect, vi } from 'vitest';
import type { EnrollmentResponse } from '@/lib/types';
import { EnrollmentStatus } from '@/lib/types';

const { mockGet, mockPost, mockPatch } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
  mockPatch: vi.fn(),
}));

vi.mock('@/lib/api/client', () => ({
  apiClient: {
    get: mockGet,
    post: mockPost,
    patch: mockPatch,
  },
}));

import { enrollmentsApi } from '@/lib/api/enrollments';

const mockEnrollment: EnrollmentResponse = {
  id: 'enroll-1',
  studentId: 'user-1',
  courseId: 'course-1',
  courseTitle: 'React 기초',
  status: EnrollmentStatus.ACTIVE,
  progress: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('enrollmentsApi', () => {
  describe('getMyEnrollments', () => {
    it('내 수강 목록을 조회한다', async () => {
      const paginatedData = { data: [mockEnrollment], total: 1, page: 1, limit: 10, totalPages: 1 };
      mockGet.mockResolvedValueOnce(paginatedData);

      const result = await enrollmentsApi.getMyEnrollments();

      expect(mockGet).toHaveBeenCalledWith('/enrollments/my');
      expect(result).toEqual(paginatedData);
    });
  });

  describe('getEnrollment', () => {
    it('수강 상세를 조회한다', async () => {
      mockGet.mockResolvedValueOnce(mockEnrollment);

      const result = await enrollmentsApi.getEnrollment('enroll-1');

      expect(mockGet).toHaveBeenCalledWith('/enrollments/enroll-1');
      expect(result).toEqual(mockEnrollment);
    });
  });

  describe('createEnrollment', () => {
    it('수강 신청한다', async () => {
      mockPost.mockResolvedValueOnce(mockEnrollment);

      const result = await enrollmentsApi.createEnrollment({ courseId: 'course-1' });

      expect(mockPost).toHaveBeenCalledWith('/enrollments', { courseId: 'course-1' });
      expect(result).toEqual(mockEnrollment);
    });
  });

  describe('updateProgress', () => {
    it('진도를 업데이트한다', async () => {
      const updated = { ...mockEnrollment, progress: 50 };
      mockPatch.mockResolvedValueOnce(updated);

      const result = await enrollmentsApi.updateProgress('enroll-1', { progress: 50 });

      expect(mockPatch).toHaveBeenCalledWith('/enrollments/enroll-1/progress', { progress: 50 });
      expect(result.progress).toBe(50);
    });
  });
});
