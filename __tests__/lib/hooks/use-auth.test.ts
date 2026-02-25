import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { AuthResponse, UserResponse } from '@/lib/types';
import { Role } from '@/lib/types';

// --- Mocks ---

const { mockLogin, mockRegister, mockLogout } = vi.hoisted(() => ({
  mockLogin: vi.fn(),
  mockRegister: vi.fn(),
  mockLogout: vi.fn(),
}));

const { mockGetMe } = vi.hoisted(() => ({
  mockGetMe: vi.fn(),
}));

const mockSetAuth = vi.fn();
const mockClearAuth = vi.fn();
const mockHydrate = vi.fn();
const mockSetTokens = vi.fn();

let mockStoreState = {
  user: null as UserResponse | null,
  accessToken: null as string | null,
  refreshToken: null as string | null,
  isAuthenticated: false,
  setAuth: mockSetAuth,
  setTokens: mockSetTokens,
  clearAuth: mockClearAuth,
  hydrateFromStorage: mockHydrate,
};

vi.mock('@/lib/api/auth', () => ({
  authApi: {
    login: mockLogin,
    register: mockRegister,
    logout: mockLogout,
  },
}));

vi.mock('@/lib/api/users', () => ({
  usersApi: {
    getMe: mockGetMe,
  },
}));

vi.mock('@/lib/store/auth-store', () => ({
  useAuthStore: Object.assign(
    // Hook call returns state
    () => mockStoreState,
    // .getState() for non-React access
    { getState: () => mockStoreState },
  ),
}));

import { useAuth } from '@/lib/hooks/use-auth';

// --- Helpers ---

const mockUser: UserResponse = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: Role.STUDENT,
  isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const mockAuthResponse: AuthResponse = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

// --- Tests ---

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStoreState = {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: mockSetAuth,
      setTokens: mockSetTokens,
      clearAuth: mockClearAuth,
      hydrateFromStorage: mockHydrate,
    };
  });

  describe('상태 노출', () => {
    it('스토어의 인증 상태를 반환한다', () => {
      mockStoreState.user = mockUser;
      mockStoreState.isAuthenticated = true;

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('login', () => {
    it('로그인 성공 시 사용자 정보를 가져와 스토어에 저장한다', async () => {
      mockLogin.mockResolvedValueOnce(mockAuthResponse);
      mockGetMe.mockResolvedValueOnce(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'pass' });
      });

      expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'pass' });
      expect(mockSetAuth).toHaveBeenCalledWith(mockUser, 'access-token', 'refresh-token');
    });
  });

  describe('register', () => {
    it('회원가입 성공 시 사용자 정보를 가져와 스토어에 저장한다', async () => {
      mockRegister.mockResolvedValueOnce(mockAuthResponse);
      mockGetMe.mockResolvedValueOnce(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.register({ email: 'test@example.com', password: 'pass', name: 'Test' });
      });

      expect(mockRegister).toHaveBeenCalledWith({ email: 'test@example.com', password: 'pass', name: 'Test' });
      expect(mockSetAuth).toHaveBeenCalledWith(mockUser, 'access-token', 'refresh-token');
    });
  });

  describe('logout', () => {
    it('로그아웃 시 API 호출 후 스토어를 초기화한다', async () => {
      mockLogout.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.logout();
      });

      expect(mockLogout).toHaveBeenCalled();
      expect(mockClearAuth).toHaveBeenCalled();
    });
  });

  describe('initialize', () => {
    it('저장된 refresh token으로 세션을 복원한다', async () => {
      mockStoreState.refreshToken = 'stored-refresh';
      mockGetMe.mockResolvedValueOnce(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.initialize();
      });

      expect(mockHydrate).toHaveBeenCalled();
      expect(mockGetMe).toHaveBeenCalled();
    });

    it('refresh token이 없으면 API 호출을 하지 않는다', async () => {
      mockStoreState.refreshToken = null;

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.initialize();
      });

      expect(mockHydrate).toHaveBeenCalled();
      expect(mockGetMe).not.toHaveBeenCalled();
    });
  });
});
