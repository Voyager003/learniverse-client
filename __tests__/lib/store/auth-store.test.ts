import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '@/lib/store/auth-store';
import { Role } from '@/lib/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Track document.cookie writes
let cookieJar = '';
Object.defineProperty(document, 'cookie', {
  get: () => cookieJar,
  set: (v: string) => { cookieJar = v; },
});

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: Role.STUDENT,
  isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
    });
    localStorageMock.clear();
    cookieJar = '';
    vi.clearAllMocks();
  });

  describe('초기 상태', () => {
    it('초기 상태는 미인증 상태이다', () => {
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('setAuth', () => {
    it('사용자 정보와 토큰을 저장한다', () => {
      useAuthStore.getState().setAuth(mockUser, 'access-123', 'refresh-456');

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe('access-123');
      expect(state.refreshToken).toBe('refresh-456');
      expect(state.isAuthenticated).toBe(true);
    });

    it('refresh token을 localStorage에 영속화한다', () => {
      useAuthStore.getState().setAuth(mockUser, 'access-123', 'refresh-456');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'learniverse_refresh_token',
        'refresh-456',
      );
    });

    it('세션 쿠키를 설정한다', () => {
      useAuthStore.getState().setAuth(mockUser, 'access-123', 'refresh-456');

      expect(cookieJar).toContain('learniverse_has_session=true');
    });
  });

  describe('setTokens', () => {
    it('토큰만 업데이트한다 (사용자 정보 유지)', () => {
      useAuthStore.getState().setAuth(mockUser, 'old-access', 'old-refresh');
      useAuthStore.getState().setTokens('new-access', 'new-refresh');

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe('new-access');
      expect(state.refreshToken).toBe('new-refresh');
    });

    it('localStorage의 refresh token도 업데이트한다', () => {
      useAuthStore.getState().setTokens('access', 'new-refresh');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'learniverse_refresh_token',
        'new-refresh',
      );
    });
  });

  describe('clearAuth', () => {
    it('모든 인증 상태를 초기화한다', () => {
      useAuthStore.getState().setAuth(mockUser, 'access', 'refresh');
      useAuthStore.getState().clearAuth();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('localStorage에서 refresh token을 제거한다', () => {
      useAuthStore.getState().setAuth(mockUser, 'access', 'refresh');
      localStorageMock.removeItem.mockClear();

      useAuthStore.getState().clearAuth();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('learniverse_refresh_token');
    });

    it('세션 쿠키를 제거한다', () => {
      useAuthStore.getState().setAuth(mockUser, 'access', 'refresh');
      useAuthStore.getState().clearAuth();

      expect(cookieJar).toContain('max-age=0');
    });
  });

  describe('hydrateFromStorage', () => {
    it('localStorage에 refresh token이 있으면 복원한다', () => {
      localStorageMock.getItem.mockReturnValueOnce('stored-refresh-token');

      useAuthStore.getState().hydrateFromStorage();

      expect(useAuthStore.getState().refreshToken).toBe('stored-refresh-token');
    });

    it('localStorage에 refresh token이 없으면 상태를 변경하지 않는다', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);

      useAuthStore.getState().hydrateFromStorage();

      expect(useAuthStore.getState().refreshToken).toBeNull();
    });
  });
});
