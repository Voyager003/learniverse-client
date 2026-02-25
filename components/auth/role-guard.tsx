'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import type { Role } from '@/lib/types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallbackUrl?: string;
}

export function RoleGuard({ children, allowedRoles, fallbackUrl = '/dashboard' }: RoleGuardProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      router.replace(fallbackUrl);
    }
  }, [user, allowedRoles, fallbackUrl, router]);

  if (!user) {
    return <LoadingSpinner className="min-h-[50vh]" size="lg" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
