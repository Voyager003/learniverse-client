export type AdminIconName =
  | 'layout-dashboard'
  | 'users'
  | 'book-open'
  | 'file-text'
  | 'shield'
  | 'graduation-cap'
  | 'key-round';

export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  icon: AdminIconName;
};

export type AdminHomeCard = {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  icon: AdminIconName;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    href: '/admin',
    label: '개요',
    description: '운영 콘솔의 주요 기능을 빠르게 확인합니다.',
    icon: 'layout-dashboard',
  },
  {
    href: '/admin/users',
    label: '사용자',
    description: '계정 상태와 권한을 관리합니다.',
    icon: 'users',
  },
  {
    href: '/admin/courses',
    label: '강좌',
    description: '강좌 노출 상태를 운영 관점에서 제어합니다.',
    icon: 'book-open',
  },
  {
    href: '/admin/assignments',
    label: '과제',
    description: '과제 moderation 흐름을 관리합니다.',
    icon: 'file-text',
  },
  {
    href: '/admin/submissions',
    label: '제출물',
    description: '제출물 검토와 숨김 상태를 추적합니다.',
    icon: 'shield',
  },
  {
    href: '/admin/enrollments',
    label: '수강 현황',
    description: '학생 수강 상태를 전역으로 조회합니다.',
    icon: 'graduation-cap',
  },
  {
    href: '/admin/idempotency-keys',
    label: '멱등성 키',
    description: '중복 요청 처리 기록을 점검합니다.',
    icon: 'key-round',
  },
  {
    href: '/admin/audit-logs',
    label: '감사 로그',
    description: '관리자 조치 이력을 추적합니다.',
    icon: 'shield',
  },
];

export const ADMIN_HOME_CARDS: AdminHomeCard[] = [
  {
    title: '사용자 관리',
    description: '계정 활성 상태, 역할, 세션을 운영자 관점에서 제어합니다.',
    href: '/admin/users',
    ctaLabel: '사용자 운영 보기',
    icon: 'users',
  },
  {
    title: '강좌 moderation',
    description: '튜터 공개 상태와 별개로 강좌 노출을 강제 제어합니다.',
    href: '/admin/courses',
    ctaLabel: '강좌 moderation 보기',
    icon: 'book-open',
  },
  {
    title: '제출물 moderation',
    description: '학생 제출물을 검토하고 숨김 여부를 관리합니다.',
    href: '/admin/submissions',
    ctaLabel: '제출물 운영 보기',
    icon: 'shield',
  },
  {
    title: '감사 로그',
    description: '누가 어떤 조치를 했는지 before/after 상태로 추적합니다.',
    href: '/admin/audit-logs',
    ctaLabel: '감사 로그 보기',
    icon: 'shield',
  },
  {
    title: '수강 운영 조회',
    description: '강좌별 수강 상태와 진행 흐름을 전역 기준으로 확인합니다.',
    href: '/admin/enrollments',
    ctaLabel: '수강 현황 보기',
    icon: 'graduation-cap',
  },
];
