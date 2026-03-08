'use client';

import { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import { AdminDetailDialog } from '@/components/admin/admin-detail-dialog';
import { AdminPageShell } from '@/components/admin/admin-page-shell';
import { JsonViewer } from '@/components/admin/json-viewer';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { getUserFacingErrorMessage } from '@/lib/errors/get-user-facing-error-message';
import { useAdminIdempotencyKeys } from '@/lib/hooks/use-admin-operations';
import type {
  AdminIdempotencyKeyQuery,
  AdminIdempotencyKeyResponse,
  AdminIdempotencyStatus,
} from '@/lib/types';
import { formatDateTime } from '@/lib/utils/format';

type IdempotencyStatusFilter = AdminIdempotencyStatus | 'all';

function initialFilters() {
  return {
    userId: '',
    path: '',
    status: 'all' as IdempotencyStatusFilter,
    from: '',
    to: '',
  };
}

const statusLabel: Record<AdminIdempotencyStatus, string> = {
  processing: '처리 중',
  completed: '완료',
};

export default function AdminIdempotencyKeysPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [detailTarget, setDetailTarget] = useState<AdminIdempotencyKeyResponse | null>(null);

  const query = useMemo<AdminIdempotencyKeyQuery>(
    () => ({
      page,
      limit: 10,
      userId: filters.userId || undefined,
      path: filters.path || undefined,
      status: filters.status === 'all' ? undefined : filters.status,
      from: filters.from || undefined,
      to: filters.to || undefined,
    }),
    [filters, page],
  );

  const { data, isLoading, error, isFetching } = useAdminIdempotencyKeys(query);

  const records = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  function resetFilters() {
    setFilters(initialFilters());
    setPage(1);
  }

  return (
    <AdminPageShell
      title="멱등성 키 조회"
      description="중복 요청 처리 기록과 응답 캐시 결과를 운영자 관점에서 추적합니다."
      actions={<div className="text-sm text-muted-foreground">총 {total}건</div>}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border bg-background/80 p-4">
          <div className="grid gap-3 md:grid-cols-5">
            <Input
              placeholder="사용자 ID"
              value={filters.userId}
              onChange={(event) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, userId: event.target.value }));
              }}
            />
            <Input
              placeholder="요청 경로"
              value={filters.path}
              onChange={(event) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, path: event.target.value }));
              }}
            />
            <Select
              value={filters.status}
              onValueChange={(value) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, status: value as IdempotencyStatusFilter }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="처리 상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="processing">처리 중</SelectItem>
                <SelectItem value="completed">완료</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filters.from}
              onChange={(event) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, from: event.target.value }));
              }}
            />
            <Input
              type="date"
              value={filters.to}
              onChange={(event) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, to: event.target.value }));
              }}
            />
          </div>
          <div className="mt-3 flex justify-end">
            <Button variant="outline" onClick={resetFilters}>
              필터 초기화
            </Button>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner className="min-h-[40vh]" size="lg" />
        ) : error ? (
          <EmptyState
            title="멱등성 키 목록을 불러오지 못했습니다"
            description={getUserFacingErrorMessage(error, 'admin.idempotency.query')}
          />
        ) : records.length === 0 ? (
          <EmptyState
            title="조건에 맞는 멱등성 기록이 없습니다"
            description="필터 조건을 조정해 다시 확인해보세요"
          />
        ) : (
          <div className="rounded-2xl border bg-background/80">
            <div className="flex items-center justify-between border-b px-4 py-3 text-sm text-muted-foreground">
              <p>
                페이지 {data?.page ?? 1}
                {totalPages ? ` / ${totalPages}` : ''}
              </p>
              <p>{isFetching ? '최신 목록을 불러오는 중입니다.' : '운영 조회용 최신 목록입니다.'}</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>메서드</TableHead>
                    <TableHead>경로</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>응답</TableHead>
                    <TableHead>생성일</TableHead>
                    <TableHead className="text-right">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Badge variant="secondary">{record.method}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{record.path}</p>
                          <p className="text-xs text-muted-foreground">{record.userId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.status === 'completed' ? 'default' : 'outline'}>
                          {statusLabel[record.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.responseStatus ?? '-'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(record.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setDetailTarget(record)}>
                            <Eye className="mr-2 h-4 w-4" />
                            상세
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-sm text-muted-foreground">
                현재 {records.length}개 표시 / 총 {total}개
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

      <AdminDetailDialog
        open={!!detailTarget}
        onOpenChange={(open) => !open && setDetailTarget(null)}
        title="멱등성 키 상세"
        description="요청 키, 응답 상태, 캐시된 응답 본문을 확인합니다."
        isLoading={false}
      >
        {detailTarget ? (
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">사용자 ID</p>
                <p className="mt-1 font-medium break-all">{detailTarget.userId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">멱등성 키</p>
                <p className="mt-1 font-medium break-all">{detailTarget.key}</p>
              </div>
              <div>
                <p className="text-muted-foreground">메서드</p>
                <p className="mt-1 font-medium">{detailTarget.method}</p>
              </div>
              <div>
                <p className="text-muted-foreground">경로</p>
                <p className="mt-1 font-medium break-all">{detailTarget.path}</p>
              </div>
              <div>
                <p className="text-muted-foreground">처리 상태</p>
                <p className="mt-1 font-medium">{statusLabel[detailTarget.status]}</p>
              </div>
              <div>
                <p className="text-muted-foreground">응답 코드</p>
                <p className="mt-1 font-medium">{detailTarget.responseStatus ?? '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">생성일</p>
                <p className="mt-1 font-medium">{formatDateTime(detailTarget.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">만료일</p>
                <p className="mt-1 font-medium">{formatDateTime(detailTarget.expiresAt)}</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-muted-foreground">응답 본문</p>
              <JsonViewer value={detailTarget.responseBody} emptyLabel="저장된 응답 본문이 없습니다." />
            </div>
          </div>
        ) : null}
      </AdminDetailDialog>
    </AdminPageShell>
  );
}
