import { apiClient } from '@/lib/api/client';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/lib/types';

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/auth/register', data),

  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  logout: () =>
    apiClient.post<void>('/auth/logout'),
};
