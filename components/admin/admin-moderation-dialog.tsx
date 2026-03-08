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

interface AdminModerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isCurrentlyHidden: boolean;
  isSubmitting: boolean;
  onSubmit: (body: { isHidden: boolean; reason?: string }) => Promise<void>;
}

export function AdminModerationDialog({
  open,
  onOpenChange,
  title,
  description,
  isCurrentlyHidden,
  isSubmitting,
  onSubmit,
}: AdminModerationDialogProps) {
  const [reason, setReason] = useState('');
  const nextIsHidden = !isCurrentlyHidden;

  async function handleSubmit() {
    await onSubmit({
      isHidden: nextIsHidden,
      reason: reason.trim() || undefined,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
            현재 상태: {isCurrentlyHidden ? '운영자 숨김' : '노출 중'}
            <br />
            변경 후 상태: {nextIsHidden ? '운영자 숨김' : '노출 중'}
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
            {nextIsHidden ? '숨김 처리' : '숨김 해제'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
