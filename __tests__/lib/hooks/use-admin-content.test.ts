import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SubmissionStatus } from '@/lib/types';

const { mockUseQuery, mockUseMutation, mockUseQueryClient } = vi.hoisted(() => ({
  mockUseQuery: vi.fn(),
  mockUseMutation: vi.fn(),
  mockUseQueryClient: vi.fn(),
}));

const {
  mockGetCourses,
  mockGetAssignments,
  mockGetSubmissions,
  mockUpdateCourseModeration,
  mockUpdateAssignmentModeration,
  mockUpdateSubmissionModeration,
} = vi.hoisted(() => ({
  mockGetCourses: vi.fn(),
  mockGetAssignments: vi.fn(),
  mockGetSubmissions: vi.fn(),
  mockUpdateCourseModeration: vi.fn(),
  mockUpdateAssignmentModeration: vi.fn(),
  mockUpdateSubmissionModeration: vi.fn(),
}));

const mockInvalidateQueries = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
  useMutation: mockUseMutation,
  useQueryClient: mockUseQueryClient,
}));

vi.mock('@/lib/api/admin-content', () => ({
  adminContentApi: {
    getCourses: mockGetCourses,
    getCourse: vi.fn(),
    updateCourseModeration: mockUpdateCourseModeration,
    getAssignments: mockGetAssignments,
    getAssignment: vi.fn(),
    updateAssignmentModeration: mockUpdateAssignmentModeration,
    getSubmissions: mockGetSubmissions,
    getSubmission: vi.fn(),
    updateSubmissionModeration: mockUpdateSubmissionModeration,
  },
}));

import {
  useAdminAssignments,
  useAdminCourses,
  useAdminSubmissions,
  useUpdateAdminAssignmentModeration,
  useUpdateAdminCourseModeration,
  useUpdateAdminSubmissionModeration,
} from '@/lib/hooks/use-admin-content';

describe('useAdminContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQueryClient.mockReturnValue({ invalidateQueries: mockInvalidateQueries });
  });

  it('강좌 목록 query key와 fetcher를 설정한다', async () => {
    const mockResult = { data: { data: [] } };
    mockUseQuery.mockReturnValue(mockResult);

    const query = { page: 1, limit: 10, isPublished: true };
    const result = useAdminCourses(query);

    expect(result).toBe(mockResult);
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['admin-courses', query] }),
    );

    const options = mockUseQuery.mock.calls[0][0] as { queryFn: () => Promise<unknown> };
    await options.queryFn();
    expect(mockGetCourses).toHaveBeenCalledWith(query);
  });

  it('과제 목록 query key와 fetcher를 설정한다', async () => {
    const mockResult = { data: { data: [] } };
    mockUseQuery.mockReturnValue(mockResult);

    const query = { page: 1, limit: 10, courseId: 'course-1' };
    const result = useAdminAssignments(query);

    expect(result).toBe(mockResult);
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['admin-assignments', query] }),
    );

    const options = mockUseQuery.mock.calls[0][0] as { queryFn: () => Promise<unknown> };
    await options.queryFn();
    expect(mockGetAssignments).toHaveBeenCalledWith(query);
  });

  it('제출 목록 query key와 fetcher를 설정한다', async () => {
    const mockResult = { data: { data: [] } };
    mockUseQuery.mockReturnValue(mockResult);

    const query = { page: 1, limit: 10, status: SubmissionStatus.SUBMITTED };
    const result = useAdminSubmissions(query);

    expect(result).toBe(mockResult);
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['admin-submissions', query] }),
    );

    const options = mockUseQuery.mock.calls[0][0] as { queryFn: () => Promise<unknown> };
    await options.queryFn();
    expect(mockGetSubmissions).toHaveBeenCalledWith(query);
  });

  it('강좌 moderation 성공 시 관련 query를 무효화한다', async () => {
    let mutationConfig: {
      mutationFn: (args: { id: string; body: { isHidden: boolean; reason?: string } }) => Promise<unknown>;
      onSuccess: (data: unknown, variables: { id: string; body: { isHidden: boolean; reason?: string } }) => Promise<unknown> | unknown;
    } | null = null;

    mockUseMutation.mockImplementation((config) => {
      mutationConfig = config;
      return { mutateAsync: vi.fn() };
    });

    useUpdateAdminCourseModeration();

    const variables = { id: 'course-1', body: { isHidden: true, reason: '운영 숨김' } };
    await mutationConfig?.mutationFn(variables);
    expect(mockUpdateCourseModeration).toHaveBeenCalledWith('course-1', variables.body);

    await mutationConfig?.onSuccess(undefined, variables);
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-courses'] });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-courses', 'course-1'] });
  });

  it('과제 moderation 성공 시 관련 query를 무효화한다', async () => {
    let mutationConfig: {
      mutationFn: (args: { id: string; body: { isHidden: boolean; reason?: string } }) => Promise<unknown>;
      onSuccess: (data: unknown, variables: { id: string; body: { isHidden: boolean; reason?: string } }) => Promise<unknown> | unknown;
    } | null = null;

    mockUseMutation.mockImplementation((config) => {
      mutationConfig = config;
      return { mutateAsync: vi.fn() };
    });

    useUpdateAdminAssignmentModeration();

    const variables = { id: 'assignment-1', body: { isHidden: false } };
    await mutationConfig?.mutationFn(variables);
    expect(mockUpdateAssignmentModeration).toHaveBeenCalledWith('assignment-1', variables.body);

    await mutationConfig?.onSuccess(undefined, variables);
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-assignments'] });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-assignments', 'assignment-1'] });
  });

  it('제출 moderation 성공 시 관련 query를 무효화한다', async () => {
    let mutationConfig: {
      mutationFn: (args: { id: string; body: { isHidden: boolean; reason?: string } }) => Promise<unknown>;
      onSuccess: (data: unknown, variables: { id: string; body: { isHidden: boolean; reason?: string } }) => Promise<unknown> | unknown;
    } | null = null;

    mockUseMutation.mockImplementation((config) => {
      mutationConfig = config;
      return { mutateAsync: vi.fn() };
    });

    useUpdateAdminSubmissionModeration();

    const variables = { id: 'submission-1', body: { isHidden: true, reason: '운영 숨김' } };
    await mutationConfig?.mutationFn(variables);
    expect(mockUpdateSubmissionModeration).toHaveBeenCalledWith('submission-1', variables.body);

    await mutationConfig?.onSuccess(undefined, variables);
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-submissions'] });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-submissions', 'submission-1'] });
  });
});
