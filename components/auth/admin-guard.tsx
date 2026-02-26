'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { Role } from '@/lib/types';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={[Role.ADMIN]}>{children}</RoleGuard>;
}
