import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  Shield,
  Users,
} from 'lucide-react';
import { AdminPageShell } from '@/components/admin/admin-page-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ADMIN_HOME_CARDS, ADMIN_NAV_ITEMS, type AdminIconName } from '@/lib/constants/admin-navigation';

const iconMap: Record<AdminIconName, React.ComponentType<{ className?: string }>> = {
  'layout-dashboard': Shield,
  users: Users,
  'book-open': BookOpen,
  'file-text': Shield,
  shield: Shield,
  'graduation-cap': GraduationCap,
  'key-round': Shield,
};

export default function AdminDashboardPage() {
  return (
    <AdminPageShell
      title="운영자가 바로 확인할 핵심 흐름"
      description="권한 분리, moderation, 운영 조회, 감사 이력을 하나의 콘솔에서 확인할 수 있도록 구조를 정리했습니다."
      actions={<Badge variant="secondary">Portfolio Ready</Badge>}
    >
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {ADMIN_HOME_CARDS.map((card) => {
          const Icon = iconMap[card.icon];

          return (
            <Card key={card.href} className="border-foreground/10 bg-background/90">
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="text-base">{card.title}</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
                </div>
                <div className="rounded-full border p-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild size="sm">
                  <Link href={card.href}>{card.ctaLabel}</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <section className="mt-10 rounded-2xl border bg-background/80 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">전체 관리자 섹션</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            백엔드에 추가한 admin API surface를 클라이언트 구조와 1:1로 맞춥니다.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {ADMIN_NAV_ITEMS.filter((item) => item.href !== '/admin').map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border p-4 transition-colors hover:border-foreground/30 hover:bg-muted/30"
            >
              <p className="font-medium">{item.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </AdminPageShell>
  );
}
