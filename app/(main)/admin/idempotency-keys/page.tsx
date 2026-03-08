import { AdminPlaceholderPage } from '@/components/admin/admin-placeholder-page';

export default function AdminIdempotencyKeysPage() {
  return (
    <AdminPlaceholderPage
      title="멱등성 키 조회"
      description="중복 요청 처리 기록을 운영 관점에서 조회하는 화면입니다."
    />
  );
}
