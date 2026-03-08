import { describe, expect, it } from 'vitest';
import { ADMIN_HOME_CARDS, ADMIN_NAV_ITEMS } from '@/lib/constants/admin-navigation';

describe('ADMIN_NAV_ITEMS', () => {
  it('관리자 주요 섹션 경로를 모두 포함한다', () => {
    expect(ADMIN_NAV_ITEMS.map((item) => item.href)).toEqual([
      '/admin',
      '/admin/users',
      '/admin/courses',
      '/admin/assignments',
      '/admin/submissions',
      '/admin/enrollments',
      '/admin/idempotency-keys',
      '/admin/audit-logs',
    ]);
  });

  it('모든 내비게이션 항목은 고유한 href를 가진다', () => {
    const hrefs = ADMIN_NAV_ITEMS.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

describe('ADMIN_HOME_CARDS', () => {
  it('포트폴리오에서 강조할 핵심 운영 기능만 노출한다', () => {
    expect(ADMIN_HOME_CARDS.map((card) => card.href)).toEqual([
      '/admin/users',
      '/admin/courses',
      '/admin/submissions',
      '/admin/audit-logs',
      '/admin/enrollments',
    ]);
  });

  it('홈 카드 경로는 모두 관리자 내비게이션에 포함된다', () => {
    const navHrefs = new Set(ADMIN_NAV_ITEMS.map((item) => item.href));

    expect(ADMIN_HOME_CARDS.every((card) => navHrefs.has(card.href))).toBe(true);
  });
});
