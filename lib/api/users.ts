import { apiClient } from '@/lib/api/client';
import type { UserResponse, UpdateUserRequest } from '@/lib/types';

export const usersApi = {
  getMe: () =>
    apiClient.get<UserResponse>('/users/me'),

  updateMe: (data: UpdateUserRequest) =>
    apiClient.patch<UserResponse>('/users/me', data),

  getUsers: () =>
    apiClient.get<UserResponse[]>('/users'),

  getUser: (id: string) => {
    if (!id || id.includes('/') || id.includes('..')) {
      return Promise.reject(new Error('Invalid user ID'));
    }
    return apiClient.get<UserResponse>(`/users/${id}`);
  },
};
