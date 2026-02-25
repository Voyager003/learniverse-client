import { useAuthStore } from '@/lib/store/auth-store';

export class ApiClientError extends Error {
  constructor(
    public statusCode: number,
    public errors: string | string[],
  ) {
    super(Array.isArray(errors) ? errors.join(', ') : errors);
    this.name = 'ApiClientError';
  }
}

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? '';
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const json = await response.json();

  if (!response.ok) {
    throw new ApiClientError(
      response.status,
      json.message ?? 'Unknown error',
    );
  }

  return json.data as T;
}

async function refreshAccessToken(): Promise<boolean> {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${getBaseUrl()}/auth/refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) return false;

    const json = await response.json();
    useAuthStore.getState().setTokens(
      json.data.accessToken,
      json.data.refreshToken,
    );
    return true;
  } catch {
    return false;
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false,
): Promise<T> {
  const url = `${getBaseUrl()}${endpoint}`;
  const headers = new Headers(options.headers);

  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 && !isRetry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return fetchApi<T>(endpoint, options, true);
    }
    useAuthStore.getState().clearAuth();
    throw new ApiClientError(401, 'Authentication failed');
  }

  return handleResponse<T>(response);
}

export const apiClient = {
  get: <T>(endpoint: string) =>
    fetchApi<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown) =>
    fetchApi<T>(endpoint, {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown) =>
    fetchApi<T>(endpoint, {
      method: 'PATCH',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: (endpoint: string) =>
    fetchApi<void>(endpoint, { method: 'DELETE' }),
};
