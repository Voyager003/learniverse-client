'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { Role } from '@/lib/types';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthInitialized = useAuthStore((s) => s.isAuthInitialized);

  useEffect(() => {
    if (!isAuthInitialized) return;
    if (!user) {
      router.replace('/login');
      return;
    }

    switch (user.role) {
      case Role.ADMIN:
        router.replace('/admin');
        break;
      case Role.TUTOR:
        router.replace('/dashboard/tutor');
        break;
      default:
        router.replace('/dashboard/student');
    }
  }, [isAuthInitialized, user, router]);

  return <LoadingSpinner className="min-h-[50vh]" size="lg" />;
}
