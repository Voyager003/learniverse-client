import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock apiClient — vi.hoisted ensures variables are available in vi.mock factory
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

import { authApi } from '@/lib/api/auth';
import { usersApi } from '@/lib/api/users';
import type { LoginRequest, RegisterRequest } from '@/lib/types';

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('POST /auth/register에 요청을 보낸다', async () => {
      const request: RegisterRequest = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'student',
      };
      const response = { accessToken: 'at', refreshToken: 'rt' };
      mockPost.mockResolvedValueOnce(response);

      const result = await authApi.register(request);

      expect(mockPost).toHaveBeenCalledWith('/auth/register', request);
      expect(result).toEqual(response);
    });
  });

  describe('login', () => {
    it('POST /auth/login에 요청을 보낸다', async () => {
      const request: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };
      const response = { accessToken: 'at', refreshToken: 'rt' };
      mockPost.mockResolvedValueOnce(response);

      const result = await authApi.login(request);

      expect(mockPost).toHaveBeenCalledWith('/auth/login', request);
      expect(result).toEqual(response);
    });
  });

  describe('logout', () => {
    it('POST /auth/logout에 요청을 보낸다', async () => {
      mockPost.mockResolvedValueOnce(undefined);

      await authApi.logout();

      expect(mockPost).toHaveBeenCalledWith('/auth/logout');
    });
  });
});

describe('usersApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMe', () => {
    it('GET /users/me에 요청을 보낸다', async () => {
      const user = { id: '1', email: 'test@example.com', name: 'Test' };
      mockGet.mockResolvedValueOnce(user);

      const result = await usersApi.getMe();

      expect(mockGet).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(user);
    });
  });

  describe('updateMe', () => {
    it('PATCH /users/me에 요청을 보낸다', async () => {
      const body = { name: 'Updated Name' };
      const updated = { id: '1', name: 'Updated Name' };
      mockPatch.mockResolvedValueOnce(updated);

      const result = await usersApi.updateMe(body);

      expect(mockPatch).toHaveBeenCalledWith('/users/me', body);
      expect(result).toEqual(updated);
    });
  });
});
