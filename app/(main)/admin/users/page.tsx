'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { useUsers } from '@/lib/hooks/use-users';
import { ROLE_LABELS, Role } from '@/lib/types';
import { formatDate } from '@/lib/utils/format';

const roleBadgeVariant: Record<Role, 'default' | 'secondary' | 'outline'> = {
  [Role.ADMIN]: 'default',
  [Role.TUTOR]: 'secondary',
  [Role.STUDENT]: 'outline',
};

export default function AdminUsersPage() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) {
    return <LoadingSpinner className="min-h-[50vh]" size="lg" />;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/admin">
          <ArrowLeft className="mr-2 h-4 w-4" />
          대시보드로
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">사용자 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {users && `총 ${users.length}명의 사용자`}
        </p>
      </div>

      {error && (
        <EmptyState
          title="데이터를 불러올 수 없습니다"
          description="잠시 후 다시 시도해주세요"
        />
      )}

      {users && users.length === 0 && (
        <EmptyState
          title="등록된 사용자가 없습니다"
          description="아직 가입한 사용자가 없습니다"
        />
      )}

      {users && users.length > 0 && (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>가입일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={roleBadgeVariant[user.role]}>
                      {ROLE_LABELS[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'outline'}>
                      {user.isActive ? '활성' : '비활성'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
