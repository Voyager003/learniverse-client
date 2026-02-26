import { describe, it, expect, vi } from 'vitest';
import type { UserResponse } from '@/lib/types';
import { Role } from '@/lib/types';

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

import { usersApi } from '@/lib/api/users';

const mockUser: UserResponse = {
  id: 'user-1',
  email: 'admin@test.com',
  name: '관리자',
  role: Role.ADMIN,
  isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const mockUsers: UserResponse[] = [
  mockUser,
  {
    id: 'user-2',
    email: 'student@test.com',
    name: '학생',
    role: Role.STUDENT,
    isActive: true,
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'user-3',
    email: 'tutor@test.com',
    name: '튜터',
    role: Role.TUTOR,
    isActive: true,
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
];

describe('usersApi', () => {
  describe('getMe', () => {
    it('내 정보를 조회한다', async () => {
      mockGet.mockResolvedValueOnce(mockUser);

      const result = await usersApi.getMe();

      expect(mockGet).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateMe', () => {
    it('내 정보를 수정한다', async () => {
      const updated = { ...mockUser, name: '새이름' };
      mockPatch.mockResolvedValueOnce(updated);

      const result = await usersApi.updateMe({ name: '새이름' });

      expect(mockPatch).toHaveBeenCalledWith('/users/me', { name: '새이름' });
      expect(result.name).toBe('새이름');
    });
  });

  describe('getUsers', () => {
    it('전체 사용자 목록을 조회한다 (ADMIN)', async () => {
      mockGet.mockResolvedValueOnce(mockUsers);

      const result = await usersApi.getUsers();

      expect(mockGet).toHaveBeenCalledWith('/users');
      expect(result).toHaveLength(3);
    });
  });

  describe('getUser', () => {
    it('사용자 상세 정보를 조회한다 (ADMIN)', async () => {
      mockGet.mockResolvedValueOnce(mockUser);

      const result = await usersApi.getUser('user-1');

      expect(mockGet).toHaveBeenCalledWith('/users/user-1');
      expect(result).toEqual(mockUser);
    });
  });
});
