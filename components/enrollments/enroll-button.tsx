'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuthStore } from '@/lib/store/auth-store';
import { useCreateEnrollment } from '@/lib/hooks/use-enrollments';
import { ApiClientError } from '@/lib/api/client';
import { getUserFacingErrorMessage } from '@/lib/errors/get-user-facing-error-message';

interface EnrollButtonProps {
  courseId: string;
}

export function EnrollButton({ courseId }: EnrollButtonProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { mutateAsync: enroll, isPending } = useCreateEnrollment();
  const [isConfirming, setIsConfirming] = useState(false);

  async function handleConfirm() {
    if (isPending || isConfirming) return;
    setIsConfirming(true);

    try {
      await enroll({ courseId });
      toast.success('수강 신청이 완료되었습니다');
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof ApiClientError && error.statusCode === 409) {
        toast.success(getUserFacingErrorMessage(error, 'enrollment.create'));
        router.push('/dashboard');
        return;
      }
      toast.error(getUserFacingErrorMessage(error, 'enrollment.create'));
    } finally {
      setIsConfirming(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <Button
        size="lg"
        className="w-full"
        onClick={() => router.push(`/login?callbackUrl=/courses/${courseId}`)}
      >
        로그인 후 수강 신청
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          수강 신청
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>수강 신청</AlertDialogTitle>
          <AlertDialogDescription>
            이 강의를 수강하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending || isConfirming}>
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                처리 중...
              </>
            ) : (
              '확인'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
