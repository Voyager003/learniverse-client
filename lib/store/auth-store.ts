'use client';

import { create } from 'zustand';
import type { UserResponse } from '@/lib/types';

const REFRESH_TOKEN_KEY = 'learniverse_refresh_token';
const SESSION_COOKIE = 'learniverse_has_session';

function setSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=true;path=/;max-age=${60 * 60 * 24 * 7};SameSite=Lax`;
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=;path=/;max-age=0`;
}

interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserResponse, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  hydrateFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    setSessionCookie();
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    set({ accessToken, refreshToken });
  },

  clearAuth: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    clearSessionCookie();
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  hydrateFromStorage: () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      set({ refreshToken });
    }
  },
}));
