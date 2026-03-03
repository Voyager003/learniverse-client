import { test, expect } from '@playwright/test';
import { uniqueEmail, TEST_PASSWORD, loginUser } from './helpers/auth';
import {
  apiRegister,
  apiLogin,
  apiCreateCourse,
  apiPublishCourse,
  apiCreateLecture,
  apiCreateAssignment,
  apiEnroll,
  apiSubmitAssignment,
} from './helpers/api';

test.describe.configure({ mode: 'serial' });

const RUN_ID = Date.now().toString(36);
let tutorEmail: string;
// Pre-seeded course for lecture/assignment/submission tests
let seededCourseId: string;
let seededAssignmentId: string;

test.beforeAll(async () => {
  // Register tutor
  tutorEmail = uniqueEmail();
  await apiRegister({ name: '튜터E2E', email: tutorEmail, password: TEST_PASSWORD, role: 'tutor' });

  // Create a pre-seeded course with lecture for management tests
  const tutorTokens = await apiLogin({ email: tutorEmail, password: TEST_PASSWORD });
  const tutorToken = tutorTokens.accessToken;

  const course = await apiCreateCourse(tutorToken, {
    title: `${RUN_ID} 시드 강의`,
    description: '레슨/과제 관리 테스트용 강의',
    category: 'programming',
    difficulty: 'beginner',
  });
  seededCourseId = course.id;
  await apiPublishCourse(tutorToken, seededCourseId);

  // Seed a lecture for delete test
  await apiCreateLecture(tutorToken, seededCourseId, {
    title: `${RUN_ID} 삭제용 레슨`,
    content: '이 레슨은 삭제 테스트에 사용됩니다.',
    order: 1,
  });

  // Seed an assignment + student submission for feedback test
  const assignment = await apiCreateAssignment(tutorToken, seededCourseId, {
    title: `${RUN_ID} 시드 과제`,
    description: '피드백 테스트용 과제',
  });
  seededAssignmentId = assignment.id;

  // Register student, enroll, submit
  const studentEmail = uniqueEmail();
  const studentTokens = await apiRegister({
    name: '학생제출',
    email: studentEmail,
    password: TEST_PASSWORD,
  });
  await apiEnroll(studentTokens.accessToken, seededCourseId);
  await apiSubmitAssignment(studentTokens.accessToken, seededAssignmentId, {
    content: `${RUN_ID} 학생 제출물 내용입니다.`,
  });
});

test.describe('강의 생성', () => {
  test('새 강의를 생성하면 튜터 대시보드로 리다이렉트된다', async ({ page }) => {
    await loginUser(page, { email: tutorEmail, password: TEST_PASSWORD });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Navigate to create course page via sidebar
    await page.getByRole('link', { name: '강의 생성' }).first().click();
    await expect(page.getByRole('heading', { name: '새 강의 만들기' })).toBeVisible({ timeout: 10000 });

    // Fill course form
    await page.getByLabel('강의 제목').fill(`${RUN_ID} UI 생성 강의`);
    await page.getByLabel('강의 설명').fill('E2E 테스트에서 UI로 생성한 강의입니다.');

    // Submit form
    await page.getByRole('button', { name: '강의 생성' }).click();

    // Should redirect to tutor dashboard (course created successfully)
    await expect(page).toHaveURL(/\/dashboard\/tutor/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: '내 강의' })).toBeVisible({ timeout: 10000 });
    // Seeded published course should be visible
    await expect(page.getByText(`${RUN_ID} 시드 강의`)).toBeVisible({ timeout: 10000 });
  });
});

test.describe('강의 수정', () => {
  test('강의 정보를 수정할 수 있다', async ({ page }) => {
    await loginUser(page, { email: tutorEmail, password: TEST_PASSWORD });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Navigate to tutor dashboard
    await page.getByRole('link', { name: '내 강의' }).first().click();
    await expect(page.getByText(`${RUN_ID} 시드 강의`)).toBeVisible({ timeout: 10000 });

    // Click edit button (Pencil icon) for the seeded course
    const courseCard = page.locator('article, [class*="card"]', {
      has: page.getByText(`${RUN_ID} 시드 강의`),
    });
    await courseCard.getByRole('link', { name: '강의 편집' }).click();

    // Should be on edit page
    await expect(page.getByRole('heading', { name: '강의 수정' })).toBeVisible({ timeout: 10000 });

    // Update title
    const titleInput = page.getByLabel('강의 제목');
    await titleInput.clear();
    await titleInput.fill(`${RUN_ID} 수정된 강의`);

    // Submit
    await page.getByRole('button', { name: '수정 저장' }).click();

    // Should redirect to dashboard and show updated title
    await expect(page).toHaveURL(/\/dashboard\/tutor/, { timeout: 10000 });
    await expect(page.getByText(`${RUN_ID} 수정된 강의`)).toBeVisible({ timeout: 10000 });
  });
});

test.describe('레슨 관리', () => {
  test('레슨을 추가할 수 있다', async ({ page }) => {
    await loginUser(page, { email: tutorEmail, password: TEST_PASSWORD });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Navigate to tutor dashboard → lectures page
    await page.getByRole('link', { name: '내 강의' }).first().click();
    await expect(page.getByText(`${RUN_ID} 수정된 강의`)).toBeVisible({ timeout: 10000 });

    const courseCard = page.locator('article, [class*="card"]', {
      has: page.getByText(`${RUN_ID} 수정된 강의`),
    });
    await courseCard.getByRole('link', { name: '레슨 관리' }).click();

    // Should be on lectures page
    await expect(page.getByText('레슨 관리')).toBeVisible({ timeout: 10000 });

    // Click "레슨 추가"
    await page.getByRole('button', { name: '레슨 추가' }).click();

    // Fill lecture form
    await page.getByLabel('레슨 제목').fill(`${RUN_ID} 새 레슨`);
    await page.getByLabel('내용').fill('E2E 테스트에서 추가한 레슨 내용입니다.');

    // Submit
    await page.getByRole('button', { name: '추가' }).click();

    // New lecture should appear in the list
    await expect(page.getByText(`${RUN_ID} 새 레슨`)).toBeVisible({ timeout: 10000 });
  });

  test('레슨을 삭제할 수 있다', async ({ page }) => {
    await loginUser(page, { email: tutorEmail, password: TEST_PASSWORD });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Navigate to tutor dashboard → lectures page
    await page.getByRole('link', { name: '내 강의' }).first().click();
    await expect(page.getByText(`${RUN_ID} 수정된 강의`)).toBeVisible({ timeout: 10000 });

    const courseCard = page.locator('article, [class*="card"]', {
      has: page.getByText(`${RUN_ID} 수정된 강의`),
    });
    await courseCard.getByRole('link', { name: '레슨 관리' }).click();

    // Wait for lecture list
    await expect(page.getByText(`${RUN_ID} 삭제용 레슨`)).toBeVisible({ timeout: 10000 });

    // Find the lecture card and click delete button (Trash icon)
    const lectureCard = page.locator('article, [class*="card"]', {
      has: page.getByText(`${RUN_ID} 삭제용 레슨`),
    });
    // Click the trash button (second ghost icon button in the card)
    await lectureCard.getByRole('button').filter({ has: page.locator('svg') }).last().click();

    // Confirmation dialog
    await expect(page.getByText('레슨을 삭제하시겠습니까?')).toBeVisible();
    await page.getByRole('button', { name: '삭제' }).click();

    // Lecture should be removed (use exact match to avoid dialog description text)
    await expect(page.getByText(`${RUN_ID} 삭제용 레슨`, { exact: true })).not.toBeVisible({ timeout: 10000 });
  });
});

test.describe('과제 관리', () => {
  test('과제를 출제할 수 있다', async ({ page }) => {
    await loginUser(page, { email: tutorEmail, password: TEST_PASSWORD });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Navigate to tutor dashboard → assignments page
    await page.getByRole('link', { name: '내 강의' }).first().click();
    await expect(page.getByText(`${RUN_ID} 수정된 강의`)).toBeVisible({ timeout: 10000 });

    const courseCard = page.locator('article, [class*="card"]', {
      has: page.getByText(`${RUN_ID} 수정된 강의`),
    });
    await courseCard.getByRole('link', { name: '과제 관리' }).click();

    // Should see existing seeded assignment
    await expect(page.getByRole('heading', { name: '과제 관리' })).toBeVisible({ timeout: 10000 });

    // Click "과제 출제"
    await page.getByRole('button', { name: '과제 출제' }).click();

    // Fill assignment form
    await page.getByLabel('과제 제목').fill(`${RUN_ID} UI 과제`);
    await page.getByLabel('과제 설명').fill('E2E 테스트에서 출제한 과제입니다.');

    // Submit
    await page.getByRole('button', { name: '출제' }).click();

    // New assignment should appear
    await expect(page.getByText(`${RUN_ID} UI 과제`)).toBeVisible({ timeout: 10000 });
  });
});

test.describe('제출물 피드백', () => {
  test('제출물에 피드백을 작성할 수 있다', async ({ page }) => {
    await loginUser(page, { email: tutorEmail, password: TEST_PASSWORD });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Navigate to tutor dashboard → assignments → submissions
    await page.getByRole('link', { name: '내 강의' }).first().click();
    await expect(page.getByText(`${RUN_ID} 수정된 강의`)).toBeVisible({ timeout: 10000 });

    const courseCard = page.locator('article, [class*="card"]', {
      has: page.getByText(`${RUN_ID} 수정된 강의`),
    });
    await courseCard.getByRole('link', { name: '과제 관리' }).click();
    await expect(page.getByText(`${RUN_ID} 시드 과제`)).toBeVisible({ timeout: 10000 });

    // Click "제출물 보기" for seeded assignment
    const assignmentCard = page.locator('article, [class*="card"]', {
      has: page.getByText(`${RUN_ID} 시드 과제`),
    });
    await assignmentCard.getByRole('link', { name: '제출물 보기' }).click();

    // Should see submission content
    await expect(page.getByRole('heading', { name: '제출물 관리' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(`${RUN_ID} 학생 제출물 내용입니다.`)).toBeVisible({ timeout: 10000 });

    // Status should be "제출됨"
    await expect(page.getByText('제출됨')).toBeVisible();

    // Click "피드백 작성"
    await page.getByRole('button', { name: '피드백 작성' }).click();

    // Fill feedback form
    await page.getByLabel('피드백').fill(`${RUN_ID} 잘 작성했습니다.`);
    await page.getByLabel('점수 (선택, 0~100)').fill('85');

    // Submit feedback
    await page.getByRole('button', { name: '피드백 저장' }).click();

    // Feedback should appear and status should change to "평가 완료"
    await expect(page.getByText(`${RUN_ID} 잘 작성했습니다.`)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('85점')).toBeVisible();
    await expect(page.getByText('평가 완료')).toBeVisible();
  });
});
