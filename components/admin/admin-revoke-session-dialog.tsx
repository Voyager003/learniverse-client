'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { UserResponse } from '@/lib/types';

interface AdminRevokeSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | null;
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
}

export function AdminRevokeSessionDialog({
  open,
  onOpenChange,
  user,
  isSubmitting,
  onSubmit,
}: AdminRevokeSessionDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>세션 강제 해제</DialogTitle>
          <DialogDescription>
            {user.name} ({user.email}) 사용자의 refresh 세션을 무효화합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
          다음 refresh 요청부터 다시 로그인해야 합니다. 현재 진행 중인 작업 흐름에 영향이 있을 수 있습니다.
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button variant="destructive" onClick={onSubmit} disabled={isSubmitting}>
            세션 해제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
