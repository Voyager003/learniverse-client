'use client';

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

interface EnrollButtonProps {
  courseId: string;
}

export function EnrollButton({ courseId }: EnrollButtonProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { mutateAsync: enroll, isPending } = useCreateEnrollment();

  async function handleConfirm() {
    try {
      await enroll({ courseId });
      toast.success('수강 신청이 완료되었습니다');
      router.push('/dashboard');
    } catch {
      toast.error('수강 신청에 실패했습니다');
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
          <AlertDialogAction onClick={handleConfirm}>확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
