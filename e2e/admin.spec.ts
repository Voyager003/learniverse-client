import { expect, test } from '@playwright/test';
import { loginAdmin, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD, TEST_PASSWORD, uniqueEmail } from './helpers/auth';
import {
  apiCreateCourse,
  apiLogin,
  apiPublishCourse,
  apiRegister,
} from './helpers/api';

test.describe.configure({ mode: 'serial' });

const RUN_ID = Date.now().toString(36);
let studentEmail: string;
let tutorEmail: string;
let courseTitle: string;

test.beforeAll(async () => {
  studentEmail = uniqueEmail();
  tutorEmail = uniqueEmail();
  courseTitle = `${RUN_ID} 관리자 시드 강의`;

  await apiRegister({
    name: '관리대상학생',
    email: studentEmail,
    password: TEST_PASSWORD,
  });

  await apiRegister({
    name: '관리대상튜터',
    email: tutorEmail,
    password: TEST_PASSWORD,
    role: 'tutor',
  });

  const tutorTokens = await apiLogin({
    email: tutorEmail,
    password: TEST_PASSWORD,
  });

  const course = await apiCreateCourse(tutorTokens.accessToken, {
    title: courseTitle,
    description: '관리자 moderation E2E용 강의',
    category: 'programming',
    difficulty: 'beginner',
  });

  await apiPublishCourse(tutorTokens.accessToken, course.id);
});

test.describe('관리자 로그인', () => {
  test('관리자 계정으로 콘솔에 로그인할 수 있다', async ({ page }) => {
    await loginAdmin(page, {
      email: TEST_ADMIN_EMAIL,
      password: TEST_ADMIN_PASSWORD,
    });

    await expect(page).toHaveURL(/\/admin(\/.*)?/, { timeout: 20000 });
    await expect(page.getByRole('heading', { name: '운영자가 바로 확인할 핵심 흐름' })).toBeVisible({ timeout: 10000 });
  });
});

test.describe('사용자 운영', () => {
  test('관리자가 사용자를 비활성화할 수 있다', async ({ page }) => {
    await loginAdmin(page);
    await page.goto('/admin/users');

    await page.getByPlaceholder('이름 또는 이메일 검색').fill(studentEmail);

    const userRow = page.getByRole('row', { name: new RegExp(studentEmail) });
    await expect(userRow).toBeVisible({ timeout: 10000 });

    await userRow.getByRole('button', { name: '상태' }).click();
    await expect(page.getByRole('dialog', { name: '계정 비활성화' })).toBeVisible();
    await page.getByPlaceholder('변경 사유를 입력하세요 (선택)').fill('Playwright E2E 비활성화 테스트');

    const updateResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === 'PATCH' &&
        /\/admin\/users\/[^/]+\/status$/.test(response.url()),
    );

    await page.getByRole('button', { name: '비활성화' }).click();
    const updateResponse = await updateResponsePromise;
    expect(updateResponse.ok()).toBeTruthy();

    await expect(page.getByText('사용자 상태를 변경했습니다.')).toBeVisible({ timeout: 10000 });
    await expect(userRow.getByText('비활성')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('강좌 moderation', () => {
  test('관리자가 강좌를 숨겼다가 다시 노출할 수 있다', async ({ page }) => {
    await loginAdmin(page);
    await page.goto('/admin/courses');

    const courseRow = page.getByRole('row', { name: new RegExp(courseTitle) });
    await expect(courseRow).toBeVisible({ timeout: 10000 });

    const hideResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === 'PATCH' &&
        /\/admin\/courses\/[^/]+\/moderation$/.test(response.url()),
    );

    await courseRow.getByRole('button', { name: '숨김', exact: true }).click();
    await page.getByPlaceholder('변경 사유를 입력하세요 (선택)').fill('Playwright E2E 숨김 테스트');
    await page.getByRole('button', { name: '숨김 처리' }).click();
    const hideResponse = await hideResponsePromise;
    expect(hideResponse.ok()).toBeTruthy();

    await expect(page.getByText('강좌 moderation 상태를 변경했습니다.').last()).toBeVisible({ timeout: 10000 });
    await expect(courseRow.getByText('운영자 숨김')).toBeVisible({ timeout: 10000 });

    const unhideResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === 'PATCH' &&
        /\/admin\/courses\/[^/]+\/moderation$/.test(response.url()),
    );

    await courseRow.getByRole('button', { name: '숨김 해제' }).click();
    await page.getByPlaceholder('변경 사유를 입력하세요 (선택)').fill('Playwright E2E 숨김 해제 테스트');
    await page.getByRole('button', { name: '숨김 해제' }).click();
    const unhideResponse = await unhideResponsePromise;
    expect(unhideResponse.ok()).toBeTruthy();

    await expect(page.getByText('강좌 moderation 상태를 변경했습니다.').last()).toBeVisible({ timeout: 10000 });
    await expect(courseRow.getByText('노출 중')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('감사 로그', () => {
  test('관리자 조치 이력을 감사 로그에서 확인할 수 있다', async ({ page }) => {
    await loginAdmin(page);
    await page.goto('/admin/audit-logs');

    await page.getByPlaceholder('액션').fill('users.update_status');
    await page.getByPlaceholder('리소스 타입').fill('user');

    const auditRow = page.getByRole('row', { name: /users\.update_status/ }).first();
    await expect(auditRow).toBeVisible({ timeout: 10000 });

    await auditRow.getByRole('button', { name: '상세' }).click();
    await expect(page.getByRole('dialog', { name: '감사 로그 상세' })).toBeVisible();
    await expect(page.getByText('변경 후 상태')).toBeVisible();
    await expect(page.getByText('"isActive": false')).toBeVisible({ timeout: 10000 });
  });
});
