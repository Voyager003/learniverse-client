import { test, expect } from '@playwright/test';
import { uniqueEmail, TEST_PASSWORD, loginUser } from './helpers/auth';
import {
  apiRegister,
  apiLogin,
  apiCreateCourse,
  apiPublishCourse,
  apiCreateLecture,
  apiCreateAssignment,
  apiPublishAssignment,
  apiEnroll,
} from './helpers/api';

test.describe.configure({ mode: 'serial' });

const RUN_ID = Date.now().toString(36);
let courseId: string;
let studentEmail: string;
let enrolledStudentEmail: string;
let assignmentTitle: string;

async function openEnrollmentDetail(page: import('@playwright/test').Page, courseTitle: string) {
  const enrollmentLink = page
    .locator('a[href^="/dashboard/student/enrollments/"]')
    .filter({ hasText: courseTitle })
    .first();

  await expect(enrollmentLink).toBeVisible({ timeout: 10000 });
  await enrollmentLink.click();
  await expect(page).toHaveURL(/\/dashboard\/student\/enrollments\//, { timeout: 10000 });
}

test.beforeAll(async () => {
  // Seed: create tutor with a published course + 3 lectures
  const tutorEmail = uniqueEmail();
  await apiRegister({ name: '튜터', email: tutorEmail, password: TEST_PASSWORD, role: 'tutor' });
  const tutorTokens = await apiLogin({ email: tutorEmail, password: TEST_PASSWORD });
  const tutorToken = tutorTokens.accessToken;

  const course = await apiCreateCourse(tutorToken, {
    title: `${RUN_ID} 학생여정 강의`,
    description: '학생 여정 테스트용 강의',
    category: 'programming',
    difficulty: 'beginner',
  });
  courseId = course.id;

  for (let i = 1; i <= 3; i++) {
    await apiCreateLecture(tutorToken, courseId, {
      title: `${RUN_ID} 레슨 ${i}`,
      content: `레슨 ${i} 내용입니다.`,
      order: i,
    });
  }

  await apiPublishCourse(tutorToken, courseId);

  assignmentTitle = `${RUN_ID} 학생 과제 1`;
  const assignment = await apiCreateAssignment(tutorToken, courseId, {
    title: assignmentTitle,
    description: '학생이 과제 목록에서 바로 확인할 과제',
  });
  if (assignment.isPublished === false) {
    await apiPublishAssignment(tutorToken, courseId, assignment.id, true);
  }

  // Student for enrollment UI test (not pre-enrolled)
  studentEmail = uniqueEmail();
  await apiRegister({ name: '학생UI', email: studentEmail, password: TEST_PASSWORD });

  // Student with pre-seeded enrollment for dashboard/progress tests
  enrolledStudentEmail = uniqueEmail();
  const enrolledTokens = await apiRegister({
    name: '학생진도',
    email: enrolledStudentEmail,
    password: TEST_PASSWORD,
  });
  await apiEnroll(enrolledTokens.accessToken, courseId);
});

test.describe('수강 신청', () => {
  test('비로그인 사용자는 로그인 페이지로 리다이렉트된다', async ({ page }) => {
    await page.goto(`/courses/${courseId}`);
    await expect(page).toHaveURL(/\/login\?callbackUrl=/, { timeout: 10000 });
  });

  test('로그인한 학생이 수강 신청할 수 있다', async ({ page }) => {
    // Login
    await loginUser(page, { email: studentEmail, password: TEST_PASSWORD });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Navigate to course via in-app navigation (preserves Zustand state)
    await page.getByRole('link', { name: '강의 탐색' }).first().click();
    await expect(page.getByText(`${RUN_ID} 학생여정 강의`)).toBeVisible({ timeout: 10000 });
    await page.getByText(`${RUN_ID} 학생여정 강의`).click();

    // Should be on course detail with authenticated enroll button
    await expect(page.getByRole('heading', { name: `${RUN_ID} 학생여정 강의` })).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: '수강 신청', exact: true }).click();

    // Confirmation dialog
    await expect(page.getByText('이 강의를 수강하시겠습니까?')).toBeVisible();
    await page.getByRole('button', { name: '확인' }).click();

    // Should redirect to student dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });
});

test.describe('학생 대시보드', () => {
  test('수강 중인 강의가 대시보드에 표시된다', async ({ page }) => {
    await loginUser(page, { email: enrolledStudentEmail, password: TEST_PASSWORD });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Navigate to student dashboard if not already there
    await expect(page.getByRole('heading', { name: '내 학습' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(`${RUN_ID} 학생여정 강의`)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('수강 중', { exact: true })).toBeVisible();
  });

  test('수강 카드를 클릭하면 진도 페이지로 이동한다', async ({ page }) => {
    await loginUser(page, { email: enrolledStudentEmail, password: TEST_PASSWORD });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    await openEnrollmentDetail(page, `${RUN_ID} 학생여정 강의`);
  });

  test('진도 상세에서 과제 보기 버튼을 누르면 과제 페이지로 이동한다', async ({ page }) => {
    await loginUser(page, { email: enrolledStudentEmail, password: TEST_PASSWORD });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    await openEnrollmentDetail(page, `${RUN_ID} 학생여정 강의`);

    await page.getByRole('button', { name: '과제 보기' }).click();
    await expect(page).toHaveURL(new RegExp(`/courses/${courseId}/assignments`), { timeout: 10000 });
    await expect(page.getByRole('heading', { level: 1, name: '과제' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(assignmentTitle)).toBeVisible({ timeout: 10000 });
  });
});

test.describe('진도 관리', () => {
  test('레슨 목록이 표시되고 완료 버튼을 클릭할 수 있다', async ({ page }) => {
    await loginUser(page, { email: enrolledStudentEmail, password: TEST_PASSWORD });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Navigate to enrollment detail
    await openEnrollmentDetail(page, `${RUN_ID} 학생여정 강의`);

    // Should show lessons
    await expect(page.getByText(`${RUN_ID} 레슨 1`)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(`${RUN_ID} 레슨 2`)).toBeVisible();
    await expect(page.getByText(`${RUN_ID} 레슨 3`)).toBeVisible();

    // Complete first lesson (multiple "완료" buttons exist, only first is enabled)
    await page.getByRole('button', { name: '완료' }).first().click();

    // Progress should update (1/3 = 33%)
    await expect(page.getByText('33%')).toBeVisible({ timeout: 10000 });
  });

  test('모든 레슨을 완료하면 강의가 완료된다', async ({ page }) => {
    await loginUser(page, { email: enrolledStudentEmail, password: TEST_PASSWORD });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Navigate to enrollment detail
    await openEnrollmentDetail(page, `${RUN_ID} 학생여정 강의`);

    // Complete remaining lessons (lesson 1 already done from previous test)
    await page.getByRole('button', { name: '완료' }).first().click();
    await expect(page.getByText('67%')).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: '완료' }).first().click();
    await expect(page.getByText('100%')).toBeVisible({ timeout: 10000 });
  });
});
