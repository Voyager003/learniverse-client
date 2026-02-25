'use client';

import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { authApi } from '@/lib/api/auth';
import { usersApi } from '@/lib/api/users';
import { useAuthStore } from '@/lib/store/auth-store';
import type { LoginRequest, RegisterRequest } from '@/lib/types';

export function useAuth() {
  const { user, isAuthenticated, setAuth, clearAuth, hydrateFromStorage } =
    useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const tokens = await authApi.login(data);
      // Temporarily store tokens so getMe can authenticate
      useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken);
      const me = await usersApi.getMe();
      setAuth(me, tokens.accessToken, tokens.refreshToken);
      return me;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const tokens = await authApi.register(data);
      useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken);
      const me = await usersApi.getMe();
      setAuth(me, tokens.accessToken, tokens.refreshToken);
      return me;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authApi.logout();
      clearAuth();
    },
  });

  const initialize = useCallback(async () => {
    hydrateFromStorage();
    const token = useAuthStore.getState().refreshToken;
    if (!token) return;

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
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    initialize,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
