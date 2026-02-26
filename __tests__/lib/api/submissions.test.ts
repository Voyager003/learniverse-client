import { describe, it, expect, vi } from 'vitest';
import type { SubmissionResponse } from '@/lib/types';
import { SubmissionStatus } from '@/lib/types';

const { mockGet, mockPost } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}));

vi.mock('@/lib/api/client', () => ({
  apiClient: {
    get: mockGet,
    post: mockPost,
  },
}));

import { submissionsApi } from '@/lib/api/submissions';

const mockSubmission: SubmissionResponse = {
  id: 'sub-1',
  studentId: 'user-1',
  assignmentId: 'assign-1',
  content: '과제 답안입니다',
  fileUrls: [],
  status: SubmissionStatus.SUBMITTED,
  feedback: null,
  score: null,
  reviewedAt: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('submissionsApi', () => {
  describe('getSubmissions', () => {
    it('과제별 제출 목록을 조회한다', async () => {
      mockGet.mockResolvedValueOnce([mockSubmission]);

      const result = await submissionsApi.getSubmissions('assign-1');

      expect(mockGet).toHaveBeenCalledWith('/assignments/assign-1/submissions');
      expect(result).toEqual([mockSubmission]);
    });
  });

  describe('createSubmission', () => {
    it('과제를 제출한다', async () => {
      mockPost.mockResolvedValueOnce(mockSubmission);

      const body = { content: '과제 답안입니다' };
      const result = await submissionsApi.createSubmission('assign-1', body);

      expect(mockPost).toHaveBeenCalledWith('/assignments/assign-1/submissions', body);
      expect(result).toEqual(mockSubmission);
    });
  });

  describe('addFeedback', () => {
    it('피드백을 추가한다', async () => {
      const reviewed = {
        ...mockSubmission,
        status: SubmissionStatus.REVIEWED,
        feedback: '잘했습니다',
        score: 90,
      };
      mockPost.mockResolvedValueOnce(reviewed);

      const body = { feedback: '잘했습니다', score: 90 };
      const result = await submissionsApi.addFeedback('assign-1', 'sub-1', body);

      expect(mockPost).toHaveBeenCalledWith(
        '/assignments/assign-1/submissions/sub-1/feedback',
        body,
      );
      expect(result.status).toBe(SubmissionStatus.REVIEWED);
      expect(result.score).toBe(90);
    });
  });
});
