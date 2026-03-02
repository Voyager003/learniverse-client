import { test, expect } from '@playwright/test';
import { uniqueEmail, TEST_PASSWORD, registerUser, loginUser } from './helpers/auth';

test.describe('회원가입', () => {
  test('새 사용자가 회원가입 후 대시보드로 이동한다', async ({ page }) => {
    const email = uniqueEmail();

    await registerUser(page, { name: '테스트유저', email, password: TEST_PASSWORD });

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('튜터 role로 회원가입하면 튜터 대시보드로 이동한다', async ({ page }) => {
    const email = uniqueEmail();

    await registerUser(page, {
      name: '튜터지원자',
      email,
      password: TEST_PASSWORD,
      role: 'tutor',
    });

    await expect(page).toHaveURL(/\/dashboard\/tutor/, { timeout: 10000 });
  });

  test('이미 존재하는 이메일로 회원가입 시 에러 메시지가 표시된다', async ({ page }) => {
    const email = uniqueEmail();

    // First registration
    await registerUser(page, { name: '첫번째', email, password: TEST_PASSWORD });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Clear session and try again with same email
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());

    await registerUser(page, { name: '두번째', email, password: TEST_PASSWORD });

    // Should show duplicate email toast
    await expect(page.getByText('이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.')).toBeVisible({ timeout: 5000 });
  });

  test('유효성 검증 실패 시 에러 메시지가 표시된다', async ({ page }) => {
    await page.goto('/register');

    // Submit empty form
    await page.getByRole('button', { name: '회원가입' }).click();

    // Validation error messages should appear
    await expect(page.getByText('이름을 입력해주세요')).toBeVisible();
  });
});

test.describe('로그인', () => {
  let testEmail: string;

  test.beforeAll(async ({ browser }) => {
    // Create a test user to login with
    testEmail = uniqueEmail();
    const page = await browser.newPage();
    await registerUser(page, { name: '로그인테스트', email: testEmail, password: TEST_PASSWORD });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    await page.close();
  });

  test('등록된 사용자가 로그인 후 대시보드로 이동한다', async ({ page }) => {
    await loginUser(page, { email: testEmail, password: TEST_PASSWORD });

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('잘못된 비밀번호로 로그인 시 에러 메시지가 표시된다', async ({ page }) => {
    await loginUser(page, { email: testEmail, password: 'wrongpassword' });

    await expect(page.getByText('이메일 또는 비밀번호가 올바르지 않습니다')).toBeVisible({ timeout: 5000 });
  });

  test('유효성 검증 실패 시 에러 메시지가 표시된다', async ({ page }) => {
    await page.goto('/login');

    // Submit empty form
    await page.getByRole('button', { name: '로그인' }).click();

    // Validation error messages
    await expect(page.getByText('이메일을 입력해주세요')).toBeVisible();
  });
});

test.describe('로그아웃', () => {
  test('로그인된 사용자가 로그아웃 후 헤더에 로그인 버튼이 표시된다', async ({ page }) => {
    const email = uniqueEmail();

    // Register and land on dashboard
    await registerUser(page, { name: '로그아웃테스트', email, password: TEST_PASSWORD });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Open user menu (avatar button) and click logout
    await page.locator('button.rounded-full').click();
    await page.getByRole('menuitem', { name: '로그아웃' }).click();

    // Should show login button in header
    await expect(page.getByRole('link', { name: '로그인' })).toBeVisible({ timeout: 5000 });
  });
});

test.describe('라우트 보호', () => {
  test('미인증 사용자가 /dashboard 접근 시 로그인 페이지로 리다이렉트된다', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login\?callbackUrl=/, { timeout: 5000 });
  });

  test('미인증 사용자가 /profile 접근 시 로그인 페이지로 리다이렉트된다', async ({ page }) => {
    await page.goto('/profile');

    await expect(page).toHaveURL(/\/login\?callbackUrl=/, { timeout: 5000 });
  });

  test('인증된 사용자가 /login 접근 시 대시보드로 리다이렉트된다', async ({ page }) => {
    const email = uniqueEmail();

    await registerUser(page, { name: '리다이렉트테스트', email, password: TEST_PASSWORD });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Try to visit login page while authenticated
    await page.goto('/login');

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
  });
});
