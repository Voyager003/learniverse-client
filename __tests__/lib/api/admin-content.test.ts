import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SubmissionStatus } from '@/lib/types';

const { mockGet, mockPatch } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPatch: vi.fn(),
}));

vi.mock('@/lib/api/client', () => ({
  apiClient: {
    get: mockGet,
    patch: mockPatch,
  },
}));

import { adminContentApi } from '@/lib/api/admin-content';

describe('adminContentApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('관리자 강좌 목록을 query string과 함께 조회한다', async () => {
    mockGet.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 });

    await adminContentApi.getCourses({ page: 1, limit: 10, isPublished: true, isAdminHidden: false });

    expect(mockGet).toHaveBeenCalledWith(
      '/admin/courses?page=1&limit=10&isPublished=true&isAdminHidden=false',
    );
  });

  it('관리자 강좌 moderation을 변경한다', async () => {
    mockPatch.mockResolvedValueOnce({ id: 'course-1' });

    await adminContentApi.updateCourseModeration('course-1', { isHidden: true, reason: '정책 위반' });

    expect(mockPatch).toHaveBeenCalledWith('/admin/courses/course-1/moderation', {
      isHidden: true,
      reason: '정책 위반',
    });
  });

  it('관리자 과제 목록을 query string과 함께 조회한다', async () => {
    mockGet.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 });

    await adminContentApi.getAssignments({ page: 2, limit: 10, courseId: 'course-1', isAdminHidden: true });

    expect(mockGet).toHaveBeenCalledWith(
      '/admin/assignments?page=2&limit=10&courseId=course-1&isAdminHidden=true',
    );
  });

  it('관리자 과제 moderation을 변경한다', async () => {
    mockPatch.mockResolvedValueOnce({ id: 'assignment-1' });

    await adminContentApi.updateAssignmentModeration('assignment-1', { isHidden: false });

    expect(mockPatch).toHaveBeenCalledWith('/admin/assignments/assignment-1/moderation', {
      isHidden: false,
    });
  });

  it('관리자 제출 목록을 query string과 함께 조회한다', async () => {
    mockGet.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 });

    await adminContentApi.getSubmissions({
      page: 1,
      limit: 10,
      studentId: 'student-1',
      status: SubmissionStatus.SUBMITTED,
      isAdminHidden: false,
    });

    expect(mockGet).toHaveBeenCalledWith(
      '/admin/submissions?page=1&limit=10&studentId=student-1&status=submitted&isAdminHidden=false',
    );
  });

  it('관리자 제출 moderation을 변경한다', async () => {
    mockPatch.mockResolvedValueOnce({ id: 'submission-1' });

    await adminContentApi.updateSubmissionModeration('submission-1', { isHidden: true, reason: '부적절한 내용' });

    expect(mockPatch).toHaveBeenCalledWith('/admin/submissions/submission-1/moderation', {
      isHidden: true,
      reason: '부적절한 내용',
    });
  });
});
