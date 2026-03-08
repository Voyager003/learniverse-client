import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPost } = vi.hoisted(() => ({
  mockPost: vi.fn(),
}));

vi.mock('@/lib/api/client', () => ({
  apiClient: {
    post: mockPost,
  },
}));

import { adminAuthApi } from '@/lib/api/admin-auth';
import type { LoginRequest } from '@/lib/types';

describe('adminAuthApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /admin/auth/login에 요청을 보낸다', async () => {
    const request: LoginRequest = {
      email: 'admin@example.com',
      password: 'password123',
    };
    const response = { accessToken: 'at', refreshToken: 'rt' };
    mockPost.mockResolvedValueOnce(response);

    const result = await adminAuthApi.login(request);

    expect(mockPost).toHaveBeenCalledWith('/admin/auth/login', request);
    expect(result).toEqual(response);
  });
});
