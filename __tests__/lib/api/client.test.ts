import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Mocks ---

const mockSetTokens = vi.fn((access: string, refresh: string) => {
  mockStoreState.accessToken = access;
  mockStoreState.refreshToken = refresh;
});
const mockClearAuth = vi.fn(() => {
  mockStoreState.accessToken = null;
  mockStoreState.refreshToken = null;
});

let mockStoreState = {
  accessToken: null as string | null,
  refreshToken: null as string | null,
  setTokens: mockSetTokens,
  clearAuth: mockClearAuth,
};

vi.mock('@/lib/store/auth-store', () => ({
  useAuthStore: {
    getState: () => mockStoreState,
  },
}));

const mockFetch = vi.fn();

// --- Import after mocks ---

import { apiClient, ApiClientError } from '@/lib/api/client';

// --- Helpers ---

const API_URL = 'http://localhost:3000/api/v1';

function mockResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

function mockNoContentResponse() {
  return {
    ok: true,
    status: 204,
    json: () => Promise.reject(new Error('No content')),
  } as Response;
}

// --- Tests ---

describe('apiClient', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = API_URL;
    vi.clearAllMocks();
    global.fetch = mockFetch;
    mockStoreState = {
      accessToken: null,
      refreshToken: null,
      setTokens: mockSetTokens,
      clearAuth: mockClearAuth,
    };
  });

  describe('GET 요청', () => {
    it('올바른 URL로 GET 요청을 보내고 응답 데이터를 언래핑한다', async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({ data: { id: '1', title: 'Test Course' }, statusCode: 200 }),
      );

      const result = await apiClient.get<{ id: string; title: string }>('/courses');

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toBe(`${API_URL}/courses`);
      expect(init.method).toBe('GET');
      expect(result).toEqual({ id: '1', title: 'Test Course' });
    });
  });

  describe('POST 요청', () => {
    it('JSON body와 Content-Type을 설정하여 요청한다', async () => {
      const body = { title: 'New Course', description: 'Desc' };
      mockFetch.mockResolvedValueOnce(
        mockResponse({ data: { id: '2', ...body }, statusCode: 201 }),
      );

      const result = await apiClient.post<{ id: string }>('/courses', body);

      const [, init] = mockFetch.mock.calls[0];
      expect(init.method).toBe('POST');
      expect(init.headers.get('Content-Type')).toBe('application/json');
      expect(init.body).toBe(JSON.stringify(body));
      expect(result).toEqual({ id: '2', ...body });
    });
  });

  describe('PATCH 요청', () => {
    it('JSON body로 PATCH 요청을 보낸다', async () => {
      const body = { title: 'Updated' };
      mockFetch.mockResolvedValueOnce(
        mockResponse({ data: { id: '1', title: 'Updated' }, statusCode: 200 }),
      );

      const result = await apiClient.patch<{ id: string; title: string }>('/courses/1', body);

      const [, init] = mockFetch.mock.calls[0];
      expect(init.method).toBe('PATCH');
      expect(init.body).toBe(JSON.stringify(body));
      expect(result).toEqual({ id: '1', title: 'Updated' });
    });
  });

  describe('DELETE 요청', () => {
    it('204 No Content 응답을 처리한다', async () => {
      mockFetch.mockResolvedValueOnce(mockNoContentResponse());

      const result = await apiClient.delete('/courses/1');

      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toBe(`${API_URL}/courses/1`);
      expect(init.method).toBe('DELETE');
      expect(result).toBeUndefined();
    });
  });

  describe('인증 헤더', () => {
    it('access token이 있으면 Bearer 헤더를 첨부한다', async () => {
      mockStoreState.accessToken = 'my-access-token';
      mockFetch.mockResolvedValueOnce(
        mockResponse({ data: [], statusCode: 200 }),
      );

      await apiClient.get('/courses');

      const [, init] = mockFetch.mock.calls[0];
      expect(init.headers.get('Authorization')).toBe('Bearer my-access-token');
    });

    it('access token이 없으면 Authorization 헤더를 첨부하지 않는다', async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({ data: [], statusCode: 200 }),
      );

      await apiClient.get('/courses');

      const [, init] = mockFetch.mock.calls[0];
      expect(init.headers.has('Authorization')).toBe(false);
    });
  });

  describe('에러 처리', () => {
    it('4xx 응답에서 ApiClientError를 던진다', async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse(
          { statusCode: 404, message: 'Course not found', error: 'Not Found', timestamp: '' },
          404,
        ),
      );

      await expect(apiClient.get('/courses/999')).rejects.toThrow(ApiClientError);
    });

    it('에러 응답의 message를 포함한다', async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse(
          { statusCode: 409, message: 'Email already exists', error: 'Conflict', timestamp: '' },
          409,
        ),
      );

      await expect(apiClient.post('/auth/register', {})).rejects.toThrow('Email already exists');
    });

    it('message가 배열인 에러를 처리한다', async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse(
          {
            statusCode: 400,
            message: ['title must not be empty', 'description is required'],
            error: 'Bad Request',
            timestamp: '',
          },
          400,
        ),
      );

      try {
        await apiClient.post('/courses', {});
        expect.unreachable('should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError);
        const apiError = error as ApiClientError;
        expect(apiError.statusCode).toBe(400);
        expect(apiError.message).toBe('title must not be empty, description is required');
      }
    });
  });

  describe('토큰 갱신', () => {
    it('401 응답 시 토큰을 갱신하고 원본 요청을 재시도한다', async () => {
      mockStoreState.accessToken = 'expired-token';
      mockStoreState.refreshToken = 'valid-refresh-token';

      // First call: 401
      mockFetch.mockResolvedValueOnce(mockResponse({}, 401));
      // Refresh call: success
      mockFetch.mockResolvedValueOnce(
        mockResponse({
          data: { accessToken: 'new-access-token', refreshToken: 'new-refresh-token' },
          statusCode: 200,
        }),
      );
      // Retry call: success
      mockFetch.mockResolvedValueOnce(
        mockResponse({ data: { id: '1' }, statusCode: 200 }),
      );

      const result = await apiClient.get<{ id: string }>('/courses/1');

      expect(result).toEqual({ id: '1' });
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockSetTokens).toHaveBeenCalledWith('new-access-token', 'new-refresh-token');

      // Verify retry uses new token
      const [, retryInit] = mockFetch.mock.calls[2];
      expect(retryInit.headers.get('Authorization')).toBe('Bearer new-access-token');
    });

    it('토큰 갱신 실패 시 인증 상태를 초기화하고 에러를 던진다', async () => {
      mockStoreState.accessToken = 'expired-token';
      mockStoreState.refreshToken = 'invalid-refresh-token';

      // First call: 401
      mockFetch.mockResolvedValueOnce(mockResponse({}, 401));
      // Refresh call: fail
      mockFetch.mockResolvedValueOnce(mockResponse({}, 401));

      await expect(apiClient.get('/courses')).rejects.toThrow(ApiClientError);
      expect(mockClearAuth).toHaveBeenCalledOnce();
    });

    it('refresh token이 없으면 갱신을 시도하지 않고 바로 에러를 던진다', async () => {
      mockStoreState.accessToken = 'expired-token';
      mockStoreState.refreshToken = null;

      mockFetch.mockResolvedValueOnce(mockResponse({}, 401));

      await expect(apiClient.get('/courses')).rejects.toThrow(ApiClientError);
      expect(mockFetch).toHaveBeenCalledTimes(1); // No refresh call
      expect(mockClearAuth).toHaveBeenCalledOnce();
    });
  });
});
