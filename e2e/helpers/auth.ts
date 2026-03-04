import { expect, type Page } from '@playwright/test';

/**
 * Generate a unique email for test isolation.
 */
export function uniqueEmail() {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.com`;
}

export const TEST_PASSWORD = 'Test1234!';

interface AuthActionOptions {
  waitForAuthReady?: boolean;
  timeoutMs?: number;
  expectedPathPattern?: RegExp;
}

function getOptions(options?: AuthActionOptions): Required<AuthActionOptions> {
  return {
    waitForAuthReady: options?.waitForAuthReady ?? true,
    timeoutMs: options?.timeoutMs ?? 20000,
    expectedPathPattern: options?.expectedPathPattern ?? /\/dashboard(\/student|\/tutor)?/,
  };
}

async function waitForAuthenticatedSession(
  page: Page,
  options?: AuthActionOptions,
) {
  const resolved = getOptions(options);
  if (!resolved.waitForAuthReady) return;

  await expect(page.getByRole('button', { name: '사용자 메뉴' })).toBeVisible({
    timeout: resolved.timeoutMs,
  });

  await expect(page).toHaveURL(resolved.expectedPathPattern, {
    timeout: resolved.timeoutMs,
  });
}

/**
 * Register a new user via UI form.
 */
export async function registerUser(
  page: Page,
  {
    name,
    email,
    password,
    role = 'student',
  }: {
    name: string;
    email: string;
    password: string;
    role?: 'student' | 'tutor';
  },
  options?: AuthActionOptions,
) {
  const resolved = getOptions(options);
  await page.goto('/register');
  await page.getByLabel('이름').fill(name);
  await page.getByLabel('이메일').fill(email);
  await page.getByLabel('비밀번호').fill(password);
  if (role === 'tutor') {
    await page.getByRole('combobox', { name: '역할' }).click();
    await page.getByRole('option', { name: '튜터' }).click();
  }

  const registerResponsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      response.url().includes('/auth/register'),
    { timeout: resolved.timeoutMs },
  );

  await page.getByRole('button', { name: '회원가입' }).click();
  const registerResponse = await registerResponsePromise;
  if (resolved.waitForAuthReady) {
    expect(registerResponse.ok()).toBeTruthy();
  }
  await waitForAuthenticatedSession(page, options);
}

/**
 * Login via UI form.
 */
export async function loginUser(
  page: Page,
  {
    email,
    password,
    callbackUrl,
  }: {
    email: string;
    password: string;
    callbackUrl?: string;
  },
  options?: AuthActionOptions,
) {
  const resolved = getOptions(options);
  const loginPath = callbackUrl
    ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : '/login';
  await page.goto(loginPath);
  await page.getByLabel('이메일').fill(email);
  await page.getByLabel('비밀번호').fill(password);

  const loginResponsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      response.url().includes('/auth/login'),
    { timeout: resolved.timeoutMs },
  );

  await page.getByRole('button', { name: '로그인' }).click();
  const loginResponse = await loginResponsePromise;
  if (resolved.waitForAuthReady) {
    expect(loginResponse.ok()).toBeTruthy();
  }
  await waitForAuthenticatedSession(page, options);
}
