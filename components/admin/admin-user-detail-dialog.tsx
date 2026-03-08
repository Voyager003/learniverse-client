'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ROLE_LABELS, Role, type UserResponse } from '@/lib/types';
import { formatDate } from '@/lib/utils/format';

const roleBadgeVariant: Record<Role, 'default' | 'secondary' | 'outline'> = {
  [Role.ADMIN]: 'default',
  [Role.TUTOR]: 'secondary',
  [Role.STUDENT]: 'outline',
};

interface AdminUserDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | undefined;
  isLoading: boolean;
}

export function AdminUserDetailDialog({
  open,
  onOpenChange,
  user,
  isLoading,
}: AdminUserDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 상세</DialogTitle>
          <DialogDescription>관리자 관점에서 계정 상태와 권한을 확인합니다.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <LoadingSpinner className="min-h-40" />
        ) : user ? (
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">이름</p>
                <p className="mt-1 font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">이메일</p>
                <p className="mt-1 font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">역할</p>
                <div className="mt-1">
                  <Badge variant={roleBadgeVariant[user.role]}>{ROLE_LABELS[user.role]}</Badge>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">상태</p>
                <div className="mt-1">
                  <Badge variant={user.isActive ? 'default' : 'outline'}>
                    {user.isActive ? '활성' : '비활성'}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">가입일</p>
                <p className="mt-1 font-medium">{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">최종 수정일</p>
                <p className="mt-1 font-medium">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
            <div className="rounded-lg border bg-muted/20 p-3 text-muted-foreground">
              백오피스에서 역할, 활성 상태, 세션 강제 해제 액션을 이 사용자에 대해 수행할 수 있습니다.
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">사용자 정보를 불러오지 못했습니다.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
