import { apiClient } from '@/lib/api/client';
import type {
  AdminRegisterRequest,
  AdminRegisterResponse,
  AuthResponse,
  LoginRequest,
} from '@/lib/types';

export const adminAuthApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/admin/auth/login', data),

  register: (data: AdminRegisterRequest) =>
    apiClient.post<AdminRegisterResponse>('/admin/auth/register', data),
};
