'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi } from '@/lib/api/admin-users';
import type {
  AdminUserQuery,
  Role,
  UpdateAdminUserRoleRequest,
  UpdateAdminUserStatusRequest,
} from '@/lib/types';

const ADMIN_USERS_KEY = 'admin-users';

export function useAdminUsers(query?: AdminUserQuery) {
  return useQuery({
    queryKey: [ADMIN_USERS_KEY, query],
    queryFn: () => adminUsersApi.getUsers(query),
  });
}

export function useAdminUser(id: string | null) {
  return useQuery({
    queryKey: [ADMIN_USERS_KEY, id],
    queryFn: () => adminUsersApi.getUser(id!),
    enabled: !!id,
  });
}

export function useUpdateAdminUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateAdminUserStatusRequest }) =>
      adminUsersApi.updateStatus(id, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_USERS_KEY] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_USERS_KEY, variables.id] });
    },
  });
}

export function useUpdateAdminUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateAdminUserRoleRequest }) =>
      adminUsersApi.updateRole(id, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_USERS_KEY] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_USERS_KEY, variables.id] });
    },
  });
}

export function useRevokeAdminUserSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminUsersApi.revokeSessions(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_USERS_KEY] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_USERS_KEY, id] });
    },
  });
}

export type AdminRoleOption = Extract<Role, 'student' | 'tutor' | 'admin'>;
