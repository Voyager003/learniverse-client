'use client';

import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { adminAuthApi } from '@/lib/api/admin-auth';
import { authApi } from '@/lib/api/auth';
import { usersApi } from '@/lib/api/users';
import { useAuthStore } from '@/lib/store/auth-store';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/lib/types';

export function useAuth() {
  const { user, isAuthenticated, isAuthInitialized, setAuth, clearAuth, hydrateFromStorage } =
    useAuthStore();

  const completeAuthentication = useCallback(
    async (tokens: AuthResponse) => {
      useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken);
      const me = await usersApi.getMe();
      setAuth(me, tokens.accessToken, tokens.refreshToken);
      return me;
    },
    [setAuth],
  );

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const tokens = await authApi.login(data);
      return completeAuthentication(tokens);
    },
  });

  const adminLoginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const tokens = await adminAuthApi.login(data);
      return completeAuthentication(tokens);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const tokens = await authApi.register(data);
      return completeAuthentication(tokens);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } finally {
        clearAuth();
      }
    },
  });

  const initialize = useCallback(async () => {
    hydrateFromStorage();
    const token = useAuthStore.getState().refreshToken;
    if (!token) {
      clearAuth();
      return;
    }

    try {
      const me = await usersApi.getMe();
      const state = useAuthStore.getState();
      setAuth(me, state.accessToken ?? '', state.refreshToken ?? '');
    } catch {
      clearAuth();
    }
  }, [hydrateFromStorage, setAuth, clearAuth]);

  return {
    user,
    isAuthenticated,
    isAuthInitialized,
    login: loginMutation.mutateAsync,
    loginAdmin: adminLoginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    initialize,
    isLoggingIn: loginMutation.isPending,
    isAdminLoggingIn: adminLoginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    adminLoginError: adminLoginMutation.error,
    registerError: registerMutation.error,
  };
}
