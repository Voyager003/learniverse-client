import { test, expect } from '@playwright/test';
import { uniqueEmail, TEST_PASSWORD, loginUser } from './helpers/auth';
import { apiRegister, promoteToAdmin } from './helpers/api';

test.describe.configure({ mode: 'serial' });

let adminEmail: string;
let studentEmail: string;

test.beforeAll(async () => {
  // Register admin user
  adminEmail = uniqueEmail();
  await apiRegister({ name: '관리자E2E', email: adminEmail, password: TEST_PASSWORD });
  await promoteToAdmin(adminEmail);

  // Register a regular student (for role guard test)
  studentEmail = uniqueEmail();
  await apiRegister({ name: '학생E2E', email: studentEmail, password: TEST_PASSWORD });
});

test.describe('관리자 권한', () => {
  test('미인증 사용자는 /admin 접근 시 로그인 페이지로 리다이렉트된다', async ({ page }) => {
    // Without login, middleware should redirect to /login
    await page.goto('/admin');

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});

test.describe('관리자 대시보드', () => {
  test('관리자가 로그인하면 관리자 대시보드가 표시된다', async ({ page }) => {
    await loginUser(page, { email: adminEmail, password: TEST_PASSWORD });

    // Dashboard router redirects admin to /admin
    await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: '관리자 대시보드' })).toBeVisible({ timeout: 10000 });

    // Should show management cards
    await expect(page.getByText('사용자 관리')).toBeVisible();
    await expect(page.getByText('강의 관리')).toBeVisible();
    await expect(page.getByText('시스템')).toBeVisible();
  });
});

test.describe('사용자 관리', () => {
  test('사용자 목록 페이지에서 사용자 테이블이 표시된다', async ({ page }) => {
    await loginUser(page, { email: adminEmail, password: TEST_PASSWORD });
    await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });

    // Click "사용자 목록" link
    await page.getByRole('link', { name: '사용자 목록' }).click();
    await expect(page).toHaveURL(/\/admin\/users/, { timeout: 10000 });

    // Should show user management heading
    await expect(page.getByRole('heading', { name: '사용자 관리' })).toBeVisible({ timeout: 10000 });

    // Should show user count
    await expect(page.getByText(/총 \d+명의 사용자/)).toBeVisible({ timeout: 10000 });

    // Should show table headers
    await expect(page.getByRole('columnheader', { name: '이름' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '이메일' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '역할' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '상태' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '가입일' })).toBeVisible();

    // Should show at least the admin user in the table
    await expect(page.getByRole('cell', { name: adminEmail })).toBeVisible();
  });
});
