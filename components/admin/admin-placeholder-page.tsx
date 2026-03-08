import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminPageShell } from '@/components/admin/admin-page-shell';

interface AdminPlaceholderPageProps {
  title: string;
  description: string;
}

export function AdminPlaceholderPage({ title, description }: AdminPlaceholderPageProps) {
  return (
    <AdminPageShell title={title} description={description}>
      <Card className="border-dashed bg-muted/20">
        <CardHeader>
          <CardTitle className="text-lg">백엔드 연결 준비 완료</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            이 화면은 관리자 콘솔 구조를 먼저 고정한 상태입니다. 실제 데이터 테이블과
            액션은 다음 단계에서 연결합니다.
          </p>
          <Button asChild variant="outline">
            <Link href="/admin">
              관리자 홈으로 돌아가기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </AdminPageShell>
  );
}
