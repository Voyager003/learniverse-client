import { describe, it, expect, vi } from 'vitest';
import type { AssignmentResponse } from '@/lib/types';

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

import { assignmentsApi } from '@/lib/api/assignments';

const mockAssignment: AssignmentResponse = {
  id: 'assign-1',
  title: '과제 1',
  description: '첫 번째 과제입니다',
  courseId: 'course-1',
  courseTitle: 'React 기초',
  dueDate: '2026-03-01T00:00:00.000Z',
  isPublished: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('assignmentsApi', () => {
  describe('getAssignments', () => {
    it('강좌별 과제 목록을 조회한다', async () => {
      mockGet.mockResolvedValueOnce([mockAssignment]);

      const result = await assignmentsApi.getAssignments('course-1');

      expect(mockGet).toHaveBeenCalledWith('/courses/course-1/assignments');
      expect(result).toEqual([mockAssignment]);
    });
  });

  describe('createAssignment', () => {
    it('과제를 생성한다', async () => {
      mockPost.mockResolvedValueOnce(mockAssignment);

      const body = { title: '과제 1', description: '첫 번째 과제입니다', dueDate: '2026-03-01T00:00:00.000Z' };
      const result = await assignmentsApi.createAssignment('course-1', body);

      expect(mockPost).toHaveBeenCalledWith('/courses/course-1/assignments', body);
      expect(result).toEqual(mockAssignment);
    });
  });

  describe('updatePublishStatus', () => {
    it('과제 공개 상태를 변경한다', async () => {
      const body = { isPublished: true };
      const publishedAssignment = { ...mockAssignment, isPublished: true };
      mockPatch.mockResolvedValueOnce(publishedAssignment);

      const result = await assignmentsApi.updatePublishStatus(
        'course-1',
        'assign-1',
        body,
      );

      expect(mockPatch).toHaveBeenCalledWith(
        '/courses/course-1/assignments/assign-1/publish',
        body,
      );
      expect(result).toEqual(publishedAssignment);
    });
  });
});
