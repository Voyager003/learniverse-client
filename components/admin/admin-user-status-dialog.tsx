'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import type { UserResponse } from '@/lib/types';

interface AdminUserStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | null;
  isSubmitting: boolean;
  onSubmit: (body: { isActive: boolean; reason?: string }) => Promise<void>;
}

export function AdminUserStatusDialog({
  open,
  onOpenChange,
  user,
  isSubmitting,
  onSubmit,
}: AdminUserStatusDialogProps) {
  const [reason, setReason] = useState('');

  if (!user) return null;

  const nextIsActive = !user.isActive;

  async function handleSubmit() {
    await onSubmit({
      isActive: nextIsActive,
      reason: reason.trim() || undefined,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{nextIsActive ? '계정 활성화' : '계정 비활성화'}</DialogTitle>
          <DialogDescription>
            {user.name} ({user.email}) 계정의 활성 상태를 변경합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
            현재 상태: {user.isActive ? '활성' : '비활성'}
            <br />
            변경 후 상태: {nextIsActive ? '활성' : '비활성'}
          </div>
          <Textarea
            placeholder="변경 사유를 입력하세요 (선택)"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {nextIsActive ? '활성화' : '비활성화'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
