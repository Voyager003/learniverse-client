import type { Page } from '@playwright/test';

/**
 * Generate a unique email for test isolation.
 */
export function uniqueEmail() {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.com`;
}

export const TEST_PASSWORD = 'Test1234!';

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
) {
  await page.goto('/register');
  await page.getByLabel('이름').fill(name);
  await page.getByLabel('이메일').fill(email);
  await page.getByLabel('비밀번호').fill(password);
  if (role === 'tutor') {
    await page.getByRole('combobox', { name: '역할' }).click();
    await page.getByRole('option', { name: '튜터' }).click();
  }
  await page.getByRole('button', { name: '회원가입' }).click();
}

/**
 * Login via UI form.
 */
export async function loginUser(
  page: Page,
  { email, password }: { email: string; password: string },
) {
  await page.goto('/login');
  await page.getByLabel('이메일').fill(email);
  await page.getByLabel('비밀번호').fill(password);
  await page.getByRole('button', { name: '로그인' }).click();
}
