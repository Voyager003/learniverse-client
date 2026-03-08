import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Role } from '@/lib/types';

const { mockGet, mockPatch, mockDelete } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPatch: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock('@/lib/api/client', () => ({
  apiClient: {
    get: mockGet,
    patch: mockPatch,
    delete: mockDelete,
  },
}));

import { adminUsersApi } from '@/lib/api/admin-users';

describe('adminUsersApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('관리자 사용자 목록을 query string과 함께 조회한다', async () => {
    mockGet.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });

    await adminUsersApi.getUsers({ page: 1, limit: 20, search: 'kim', isActive: true });

    expect(mockGet).toHaveBeenCalledWith(
      '/admin/users?page=1&limit=20&search=kim&isActive=true',
    );
  });

  it('관리자 사용자 상세를 조회한다', async () => {
    mockGet.mockResolvedValueOnce({ id: 'user-1' });

    await adminUsersApi.getUser('user-1');

    expect(mockGet).toHaveBeenCalledWith('/admin/users/user-1');
  });

  it('관리자 사용자 상태를 변경한다', async () => {
    mockPatch.mockResolvedValueOnce({ id: 'user-1', isActive: false });

    await adminUsersApi.updateStatus('user-1', { isActive: false, reason: '운영 확인' });

    expect(mockPatch).toHaveBeenCalledWith('/admin/users/user-1/status', {
      isActive: false,
      reason: '운영 확인',
    });
  });

  it('관리자 사용자 역할을 변경한다', async () => {
    mockPatch.mockResolvedValueOnce({ id: 'user-1', role: Role.TUTOR });

    await adminUsersApi.updateRole('user-1', { role: Role.TUTOR, reason: '승격' });

    expect(mockPatch).toHaveBeenCalledWith('/admin/users/user-1/role', {
      role: Role.TUTOR,
      reason: '승격',
    });
  });

  it('관리자 사용자 세션을 강제 해제한다', async () => {
    mockDelete.mockResolvedValueOnce(undefined);

    await adminUsersApi.revokeSessions('user-1');

    expect(mockDelete).toHaveBeenCalledWith('/admin/users/user-1/sessions');
  });
});
