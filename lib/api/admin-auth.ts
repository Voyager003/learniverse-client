import { apiClient } from '@/lib/api/client';
import type { AuthResponse, LoginRequest } from '@/lib/types';

export const adminAuthApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/admin/auth/login', data),
};
