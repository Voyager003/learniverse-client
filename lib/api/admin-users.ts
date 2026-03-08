import { apiClient } from '@/lib/api/client';
import { buildQueryString } from '@/lib/utils/query-string';
import type {
  AdminUserQuery,
  PaginatedData,
  UpdateAdminUserRoleRequest,
  UpdateAdminUserStatusRequest,
  UserResponse,
} from '@/lib/types';

export const adminUsersApi = {
  getUsers: (query?: AdminUserQuery) =>
    apiClient.get<PaginatedData<UserResponse>>(`/admin/users${buildQueryString(query)}`),

  getUser: (id: string) =>
    apiClient.get<UserResponse>(`/admin/users/${id}`),

  updateStatus: (id: string, body: UpdateAdminUserStatusRequest) =>
    apiClient.patch<UserResponse>(`/admin/users/${id}/status`, body),

  updateRole: (id: string, body: UpdateAdminUserRoleRequest) =>
    apiClient.patch<UserResponse>(`/admin/users/${id}/role`, body),

  revokeSessions: (id: string) =>
    apiClient.delete(`/admin/users/${id}/sessions`),
};
