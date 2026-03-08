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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ROLE_LABELS, Role, type UserResponse } from '@/lib/types';

interface AdminUserRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | null;
  isSubmitting: boolean;
  onSubmit: (body: { role: Role; reason?: string }) => Promise<void>;
}

const roleOptions = [Role.STUDENT, Role.TUTOR, Role.ADMIN] as const;

export function AdminUserRoleDialog({
  open,
  onOpenChange,
  user,
  isSubmitting,
  onSubmit,
}: AdminUserRoleDialogProps) {
  const [role, setRole] = useState<Role>(user?.role ?? Role.STUDENT);
  const [reason, setReason] = useState('');

  if (!user) return null;

  async function handleSubmit() {
    await onSubmit({ role, reason: reason.trim() || undefined });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>역할 변경</DialogTitle>
          <DialogDescription>
            {user.name} ({user.email}) 계정의 역할을 변경합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">현재 역할</p>
            <p className="font-medium">{ROLE_LABELS[user.role]}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">변경할 역할</p>
            <Select value={role} onValueChange={(value) => setRole(value as Role)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="역할 선택" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {ROLE_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            역할 변경
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
