'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { Role } from '@/lib/types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={[Role.ADMIN]}>{children}</RoleGuard>;
}
