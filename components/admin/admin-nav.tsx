'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  FileText,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  Shield,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ADMIN_NAV_ITEMS, type AdminIconName } from '@/lib/constants/admin-navigation';

const iconMap: Record<AdminIconName, React.ComponentType<{ className?: string }>> = {
  'layout-dashboard': LayoutDashboard,
  users: Users,
  'book-open': BookOpen,
  'file-text': FileText,
  shield: Shield,
  'graduation-cap': GraduationCap,
  'key-round': KeyRound,
};

function isActivePath(currentPathname: string, href: string) {
  if (href === '/admin') {
    return currentPathname === href;
  }

  return currentPathname === href || currentPathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
          Admin Surface
        </Badge>
        <p className="text-sm text-muted-foreground">
          학생/튜터 UX와 분리된 운영자 전용 콘솔입니다.
        </p>
      </div>
      <nav className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-xl border p-4 transition-colors hover:border-foreground/30 hover:bg-muted/30',
                active && 'border-foreground/30 bg-muted/40 shadow-sm',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
