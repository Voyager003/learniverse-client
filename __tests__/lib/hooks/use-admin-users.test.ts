import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Role } from '@/lib/types';

const { mockUseQuery, mockUseMutation, mockUseQueryClient } = vi.hoisted(() => ({
  mockUseQuery: vi.fn(),
  mockUseMutation: vi.fn(),
  mockUseQueryClient: vi.fn(),
}));

const { mockGetUsers, mockUpdateStatus, mockUpdateRole, mockRevokeSessions } = vi.hoisted(() => ({
  mockGetUsers: vi.fn(),
  mockUpdateStatus: vi.fn(),
  mockUpdateRole: vi.fn(),
  mockRevokeSessions: vi.fn(),
}));

const mockInvalidateQueries = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
  useMutation: mockUseMutation,
  useQueryClient: mockUseQueryClient,
}));

vi.mock('@/lib/api/admin-users', () => ({
  adminUsersApi: {
    getUsers: mockGetUsers,
    getUser: vi.fn(),
    updateStatus: mockUpdateStatus,
    updateRole: mockUpdateRole,
    revokeSessions: mockRevokeSessions,
  },
}));

import {
  useAdminUsers,
  useRevokeAdminUserSessions,
  useUpdateAdminUserRole,
  useUpdateAdminUserStatus,
} from '@/lib/hooks/use-admin-users';

describe('useAdminUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQueryClient.mockReturnValue({ invalidateQueries: mockInvalidateQueries });
  });

  it('관리자 사용자 목록 query key와 fetcher를 설정한다', async () => {
    const mockResult = { data: { data: [] } };
    mockUseQuery.mockReturnValue(mockResult);

    const query = { page: 1, limit: 20, role: Role.ADMIN };
    const result = useAdminUsers(query);

    expect(result).toBe(mockResult);
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['admin-users', query],
      }),
    );

    const options = mockUseQuery.mock.calls[0][0] as {
      queryFn: () => Promise<unknown>;
    };
    await options.queryFn();
    expect(mockGetUsers).toHaveBeenCalledWith(query);
  });

  it('상태 변경 mutation 성공 시 관련 query를 무효화한다', async () => {
    let mutationConfig: {
      mutationFn: (args: { id: string; body: { isActive: boolean; reason?: string } }) => Promise<unknown>;
      onSuccess: (data: unknown, variables: { id: string; body: { isActive: boolean; reason?: string } }) => Promise<unknown> | unknown;
    } | null = null;

    mockUseMutation.mockImplementation((config) => {
      mutationConfig = config;
      return { mutateAsync: vi.fn() };
    });

    useUpdateAdminUserStatus();

    expect(mutationConfig).not.toBeNull();
    const variables = { id: 'user-1', body: { isActive: false, reason: '운영' } };
    await mutationConfig?.mutationFn(variables);
    expect(mockUpdateStatus).toHaveBeenCalledWith('user-1', { isActive: false, reason: '운영' });

    await mutationConfig?.onSuccess(undefined, variables);
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-users'] });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-users', 'user-1'] });
  });

  it('역할 변경 mutation 성공 시 관련 query를 무효화한다', async () => {
    let mutationConfig: {
      mutationFn: (args: { id: string; body: { role: Role; reason?: string } }) => Promise<unknown>;
      onSuccess: (data: unknown, variables: { id: string; body: { role: Role; reason?: string } }) => Promise<unknown> | unknown;
    } | null = null;

    mockUseMutation.mockImplementation((config) => {
      mutationConfig = config;
      return { mutateAsync: vi.fn() };
    });

    useUpdateAdminUserRole();

    const variables = { id: 'user-1', body: { role: Role.TUTOR, reason: '승격' } };
    await mutationConfig?.mutationFn(variables);
    expect(mockUpdateRole).toHaveBeenCalledWith('user-1', { role: Role.TUTOR, reason: '승격' });

    await mutationConfig?.onSuccess(undefined, variables);
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-users'] });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-users', 'user-1'] });
  });

  it('세션 강제 해제 mutation 성공 시 관련 query를 무효화한다', async () => {
    let mutationConfig: {
      mutationFn: (id: string) => Promise<unknown>;
      onSuccess: (data: unknown, variables: string) => Promise<unknown> | unknown;
    } | null = null;

    mockUseMutation.mockImplementation((config) => {
      mutationConfig = config;
      return { mutateAsync: vi.fn() };
    });

    useRevokeAdminUserSessions();

    await mutationConfig?.mutationFn('user-1');
    expect(mockRevokeSessions).toHaveBeenCalledWith('user-1');

    await mutationConfig?.onSuccess(undefined, 'user-1');
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-users'] });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-users', 'user-1'] });
  });
});
