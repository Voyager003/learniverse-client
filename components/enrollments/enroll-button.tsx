'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { apiClient } from '@/lib/api/client';
import { useState } from 'react';

interface EnrollButtonProps {
  courseId: string;
}

export function EnrollButton({ courseId }: EnrollButtonProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isLoading, setIsLoading] = useState(false);

  async function handleEnroll() {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=/courses/${courseId}`);
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/enrollments', { courseId });
      toast.success('수강 신청이 완료되었습니다');
      router.push('/dashboard/student');
    } catch {
      toast.error('수강 신청에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button size="lg" className="w-full" onClick={handleEnroll} disabled={isLoading}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      수강 신청
    </Button>
  );
}
