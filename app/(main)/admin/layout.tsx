import type { Metadata } from 'next';
import { AdminGuard } from '@/components/auth/admin-guard';
import { AdminNav } from '@/components/admin/admin-nav';

export const metadata: Metadata = {
  title: '관리자',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),transparent_40%)]">
        <div className="border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6 max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Operations Console
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Learniverse 관리자 콘솔</h1>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                사용자, 콘텐츠, 운영 이력을 학생/튜터 서비스와 분리된 경로에서 다룹니다.
              </p>
            </div>
            <AdminNav />
          </div>
        </div>
        {children}
      </div>
    </AdminGuard>
  );
}
