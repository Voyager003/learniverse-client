import { test, expect } from '@playwright/test';
import { uniqueEmail, TEST_PASSWORD, loginUser } from './helpers/auth';
import { apiRegister, apiLogin, apiCreateCourse, apiPublishCourse } from './helpers/api';

// All tests share seeded data, must run in same worker
test.describe.configure({ mode: 'serial' });

let courseIds: string[];
let viewerEmail: string;
const RUN_ID = Date.now().toString(36);

test.beforeAll(async () => {
  // Seed: register tutor and create courses
  const email = uniqueEmail();
  await apiRegister({ name: '테스트튜터', email, password: TEST_PASSWORD, role: 'tutor' });
  const tokens = await apiLogin({ email, password: TEST_PASSWORD });
  const tutorToken = tokens.accessToken;

  // Create test courses with unique names per run
  const courses = [
    { title: `${RUN_ID} 프로그래밍 입문`, description: '프로그래밍 기초 강의', category: 'programming', difficulty: 'beginner' },
    { title: `${RUN_ID} 데이터 분석`, description: '데이터 사이언스 중급 강의', category: 'data_science', difficulty: 'intermediate' },
    { title: `${RUN_ID} 디자인 고급`, description: '디자인 고급 강의', category: 'design', difficulty: 'advanced' },
  ];

  courseIds = [];
  for (const course of courses) {
    const created = await apiCreateCourse(tutorToken, course);
    await apiPublishCourse(tutorToken, created.id);
    courseIds.push(created.id);
  }

  // Seed: register a student account for browsing courses
  viewerEmail = uniqueEmail();
  await apiRegister({ name: '카탈로그학생', email: viewerEmail, password: TEST_PASSWORD });
});

test.beforeEach(async ({ page }) => {
  await loginUser(page, { email: viewerEmail, password: TEST_PASSWORD });
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
});

test.describe('강의 카탈로그', () => {
  test('강의 목록 페이지가 로드되고 강의 카드가 표시된다', async ({ page }) => {
    await page.goto('/courses');

    await expect(page.getByRole('heading', { name: '강의 탐색' })).toBeVisible();
    await expect(page.getByText(`${RUN_ID} 프로그래밍 입문`)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(`${RUN_ID} 데이터 분석`)).toBeVisible();
    await expect(page.getByText(`${RUN_ID} 디자인 고급`)).toBeVisible();
  });

  test('카테고리 필터로 강의를 필터링할 수 있다', async ({ page }) => {
    await page.goto('/courses');
    await expect(page.getByText(`${RUN_ID} 프로그래밍 입문`)).toBeVisible({ timeout: 10000 });

    // Select programming category
    await page.locator('button').filter({ hasText: '전체 카테고리' }).click();
    await page.getByRole('option', { name: '프로그래밍' }).click();

    // Should show only programming course
    await expect(page).toHaveURL(/category=programming/);
    await expect(page.getByText(`${RUN_ID} 프로그래밍 입문`)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(`${RUN_ID} 데이터 분석`)).not.toBeVisible();
  });

  test('난이도 필터로 강의를 필터링할 수 있다', async ({ page }) => {
    await page.goto('/courses');
    await expect(page.getByText(`${RUN_ID} 프로그래밍 입문`)).toBeVisible({ timeout: 10000 });

    // Select advanced difficulty
    await page.locator('button').filter({ hasText: '전체 난이도' }).click();
    await page.getByRole('option', { name: '고급' }).click();

    // Should show only advanced course
    await expect(page).toHaveURL(/difficulty=advanced/);
    await expect(page.getByText(`${RUN_ID} 디자인 고급`)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(`${RUN_ID} 프로그래밍 입문`)).not.toBeVisible();
  });

  test('필터 초기화 버튼으로 필터를 제거할 수 있다', async ({ page }) => {
    await page.goto('/courses?category=programming');
    await expect(page.getByText(`${RUN_ID} 프로그래밍 입문`)).toBeVisible({ timeout: 10000 });

    // Click clear filters
    await page.getByRole('button', { name: '필터 초기화' }).click();

    // Should show all courses
    await expect(page).toHaveURL('/courses');
    await expect(page.getByText(`${RUN_ID} 프로그래밍 입문`)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(`${RUN_ID} 데이터 분석`)).toBeVisible();
  });
});

test.describe('강의 상세', () => {
  test('강의 카드 클릭 시 상세 페이지로 이동한다', async ({ page }) => {
    await page.goto(`/courses/${courseIds[0]}`);

    await expect(page.getByRole('heading', { name: `${RUN_ID} 프로그래밍 입문` })).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(new RegExp(`/courses/${courseIds[0]}`));
  });

  test('강의 상세 페이지에 강의 정보가 표시된다', async ({ page }) => {
    await page.goto(`/courses/${courseIds[0]}`);

    // Hero section
    await expect(page.getByRole('heading', { name: `${RUN_ID} 프로그래밍 입문` })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('프로그래밍 기초 강의')).toBeVisible();

    // Category badge
    await expect(page.getByText('프로그래밍', { exact: true })).toBeVisible();

    // Enrollment sidebar
    await expect(page.getByRole('heading', { name: '수강 신청' })).toBeVisible();

    // Curriculum section
    await expect(page.getByText('커리큘럼')).toBeVisible();
  });

  test('존재하지 않는 강의 접근 시 404 페이지가 표시된다', async ({ page }) => {
    await page.goto('/courses/nonexistent-id-12345');

    await expect(page.getByText('페이지를 찾을 수 없습니다')).toBeVisible({ timeout: 10000 });
  });
});
