'use client';

import { useMemo, useState } from 'react';
import { Eye, RefreshCw, RotateCcw, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { AdminPageShell } from '@/components/admin/admin-page-shell';
import { AdminUserDetailDialog } from '@/components/admin/admin-user-detail-dialog';
import { AdminUserRoleDialog } from '@/components/admin/admin-user-role-dialog';
import { AdminUserStatusDialog } from '@/components/admin/admin-user-status-dialog';
import { AdminRevokeSessionDialog } from '@/components/admin/admin-revoke-session-dialog';
import { getUserFacingErrorMessage } from '@/lib/errors/get-user-facing-error-message';
import {
  useAdminUser,
  useAdminUsers,
  useRevokeAdminUserSessions,
  useUpdateAdminUserRole,
  useUpdateAdminUserStatus,
} from '@/lib/hooks/use-admin-users';
import { useAuth } from '@/lib/hooks/use-auth';
import { formatDate } from '@/lib/utils/format';
import { ROLE_LABELS, Role, type AdminUserQuery, type UserResponse } from '@/lib/types';

const roleBadgeVariant: Record<Role, 'default' | 'secondary' | 'outline'> = {
  [Role.ADMIN]: 'default',
  [Role.TUTOR]: 'secondary',
  [Role.STUDENT]: 'outline',
};

type RoleFilter = Role | 'all';
type ActiveFilter = 'all' | 'true' | 'false';

function initialFilterState() {
  return {
    search: '',
    role: 'all' as RoleFilter,
    isActive: 'all' as ActiveFilter,
  };
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [filters, setFilters] = useState(initialFilterState);
  const [page, setPage] = useState(1);
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [statusTarget, setStatusTarget] = useState<UserResponse | null>(null);
  const [roleTarget, setRoleTarget] = useState<UserResponse | null>(null);
  const [sessionTarget, setSessionTarget] = useState<UserResponse | null>(null);

  const query = useMemo<AdminUserQuery>(
    () => ({
      page,
      limit: 10,
      search: filters.search || undefined,
      role: filters.role === 'all' ? undefined : filters.role,
      isActive:
        filters.isActive === 'all' ? undefined : filters.isActive === 'true',
    }),
    [filters, page],
  );

  const { data, isLoading, error, isFetching } = useAdminUsers(query);
  const detailQuery = useAdminUser(detailUserId);
  const updateStatusMutation = useUpdateAdminUserStatus();
  const updateRoleMutation = useUpdateAdminUserRole();
  const revokeSessionsMutation = useRevokeAdminUserSessions();

  const users = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  async function handleStatusSubmit(body: { isActive: boolean; reason?: string }) {
    if (!statusTarget) return;

    try {
      await updateStatusMutation.mutateAsync({ id: statusTarget.id, body });
      toast.success('사용자 상태를 변경했습니다.');
      setStatusTarget(null);
    } catch (mutationError) {
      toast.error(getUserFacingErrorMessage(mutationError, 'admin.user.status'));
    }
  }

  async function handleRoleSubmit(body: { role: Role; reason?: string }) {
    if (!roleTarget) return;

    try {
      await updateRoleMutation.mutateAsync({ id: roleTarget.id, body });
      toast.success('사용자 역할을 변경했습니다.');
      setRoleTarget(null);
    } catch (mutationError) {
      toast.error(getUserFacingErrorMessage(mutationError, 'admin.user.role'));
    }
  }

  async function handleRevokeSessions() {
    if (!sessionTarget) return;

    try {
      await revokeSessionsMutation.mutateAsync(sessionTarget.id);
      toast.success('사용자 세션을 강제 해제했습니다.');
      setSessionTarget(null);
    } catch (mutationError) {
      toast.error(getUserFacingErrorMessage(mutationError, 'admin.user.sessions'));
    }
  }

  function resetFilters() {
    setFilters(initialFilterState());
    setPage(1);
  }

  return (
    <AdminPageShell
      title="사용자 운영"
      description="계정 상태, 권한, 세션을 관리자 관점에서 직접 제어합니다."
      actions={
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          총 {total}명
        </div>
      }
    >
      <div className="space-y-6">
        <div className="rounded-2xl border bg-background/80 p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <Input
              placeholder="이름 또는 이메일 검색"
              value={filters.search}
              onChange={(event) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, search: event.target.value }));
              }}
            />
            <Select
              value={filters.role}
              onValueChange={(value) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, role: value as RoleFilter }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="역할" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 역할</SelectItem>
                <SelectItem value={Role.STUDENT}>{ROLE_LABELS[Role.STUDENT]}</SelectItem>
                <SelectItem value={Role.TUTOR}>{ROLE_LABELS[Role.TUTOR]}</SelectItem>
                <SelectItem value={Role.ADMIN}>{ROLE_LABELS[Role.ADMIN]}</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.isActive}
              onValueChange={(value) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, isActive: value as ActiveFilter }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="true">활성</SelectItem>
                <SelectItem value="false">비활성</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" className="w-full" onClick={resetFilters}>
                초기화
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner className="min-h-[40vh]" size="lg" />
        ) : error ? (
          <EmptyState
            title="사용자 목록을 불러오지 못했습니다"
            description={getUserFacingErrorMessage(error, 'admin.users.query')}
          />
        ) : users.length === 0 ? (
          <EmptyState
            title="조건에 맞는 사용자가 없습니다"
            description="검색어나 필터 조건을 바꿔 다시 확인해보세요"
          />
        ) : (
          <div className="rounded-2xl border bg-background/80">
            <div className="flex items-center justify-between border-b px-4 py-3 text-sm text-muted-foreground">
              <p>
                페이지 {data?.page ?? 1}
                {totalPages ? ` / ${totalPages}` : ''}
              </p>
              <p>{isFetching ? '최신 목록을 불러오는 중입니다.' : '최신 상태가 반영된 목록입니다.'}</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>역할</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead className="text-right">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const isSelf = currentUser?.id === user.id;

                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={roleBadgeVariant[user.role]}>{ROLE_LABELS[user.role]}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? 'default' : 'outline'}>
                            {user.isActive ? '활성' : '비활성'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => setDetailUserId(user.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              상세
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isSelf}
                              onClick={() => setStatusTarget(user)}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              상태
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isSelf}
                              onClick={() => setRoleTarget(user)}
                            >
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              역할
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSessionTarget(user)}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              세션
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-sm text-muted-foreground">
                현재 {users.length}명 표시 중 / 총 {total}명
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={(data?.page ?? 1) <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  이전
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={totalPages === 0 || (data?.page ?? 1) >= totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  다음
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AdminUserDetailDialog
        open={!!detailUserId}
        onOpenChange={(open) => {
          if (!open) setDetailUserId(null);
        }}
        user={detailQuery.data}
        isLoading={detailQuery.isLoading || detailQuery.isFetching}
      />
      <AdminUserStatusDialog
        key={statusTarget?.id ?? 'status-dialog'}
        open={!!statusTarget}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null);
        }}
        user={statusTarget}
        isSubmitting={updateStatusMutation.isPending}
        onSubmit={handleStatusSubmit}
      />
      <AdminUserRoleDialog
        key={roleTarget?.id ?? 'role-dialog'}
        open={!!roleTarget}
        onOpenChange={(open) => {
          if (!open) setRoleTarget(null);
        }}
        user={roleTarget}
        isSubmitting={updateRoleMutation.isPending}
        onSubmit={handleRoleSubmit}
      />
      <AdminRevokeSessionDialog
        open={!!sessionTarget}
        onOpenChange={(open) => {
          if (!open) setSessionTarget(null);
        }}
        user={sessionTarget}
        isSubmitting={revokeSessionsMutation.isPending}
        onSubmit={handleRevokeSessions}
      />
    </AdminPageShell>
  );
}
