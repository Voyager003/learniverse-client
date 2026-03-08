'use client';

import { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import { AdminDetailDialog } from '@/components/admin/admin-detail-dialog';
import { AdminPageShell } from '@/components/admin/admin-page-shell';
import { JsonViewer } from '@/components/admin/json-viewer';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getUserFacingErrorMessage } from '@/lib/errors/get-user-facing-error-message';
import { useAdminAuditLogs } from '@/lib/hooks/use-admin-audit';
import type { AdminAuditLogQuery, AdminAuditLogResponse } from '@/lib/types';
import { formatDateTime } from '@/lib/utils/format';

function initialFilters() {
  return {
    actorId: '',
    action: '',
    resourceType: '',
    from: '',
    to: '',
  };
}

export default function AdminAuditLogsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [detailTarget, setDetailTarget] = useState<AdminAuditLogResponse | null>(null);

  const query = useMemo<AdminAuditLogQuery>(
    () => ({
      page,
      limit: 10,
      actorId: filters.actorId || undefined,
      action: filters.action || undefined,
      resourceType: filters.resourceType || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
    }),
    [filters, page],
  );

  const { data, isLoading, error, isFetching } = useAdminAuditLogs(query);

  const logs = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  function resetFilters() {
    setFilters(initialFilters());
    setPage(1);
  }

  return (
    <AdminPageShell
      title="감사 로그"
      description="관리자 조치 이력과 변경 전후 상태를 조회합니다."
      actions={<div className="text-sm text-muted-foreground">총 {total}건</div>}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border bg-background/80 p-4">
          <div className="grid gap-3 md:grid-cols-5">
            <Input
              placeholder="관리자 ID"
              value={filters.actorId}
              onChange={(event) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, actorId: event.target.value }));
              }}
            />
            <Input
              placeholder="액션"
              value={filters.action}
              onChange={(event) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, action: event.target.value }));
              }}
            />
            <Input
              placeholder="리소스 타입"
              value={filters.resourceType}
              onChange={(event) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, resourceType: event.target.value }));
              }}
            />
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
            title="감사 로그를 불러오지 못했습니다"
            description={getUserFacingErrorMessage(error, 'admin.audit.query')}
          />
        ) : logs.length === 0 ? (
          <EmptyState
            title="조건에 맞는 감사 로그가 없습니다"
            description="필터 조건을 조정해 다시 확인해보세요"
          />
        ) : (
          <div className="rounded-2xl border bg-background/80">
            <div className="flex items-center justify-between border-b px-4 py-3 text-sm text-muted-foreground">
              <p>
                페이지 {data?.page ?? 1}
                {totalPages ? ` / ${totalPages}` : ''}
              </p>
              <p>{isFetching ? '최신 목록을 불러오는 중입니다.' : '감사 로그 최신 목록입니다.'}</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>액션</TableHead>
                    <TableHead>리소스</TableHead>
                    <TableHead>관리자</TableHead>
                    <TableHead>시각</TableHead>
                    <TableHead className="text-right">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>
                        <div>
                          <p>{log.resourceType}</p>
                          <p className="text-xs text-muted-foreground">{log.resourceId ?? '-'}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{log.actorId}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(log.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setDetailTarget(log)}>
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
                현재 {logs.length}개 표시 / 총 {total}개
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
        title="감사 로그 상세"
        description="조치 이력과 변경 전후 상태를 JSON 형태로 확인합니다."
        isLoading={false}
      >
        {detailTarget ? (
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">관리자 ID</p>
                <p className="mt-1 font-medium break-all">{detailTarget.actorId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">액션</p>
                <p className="mt-1 font-medium">{detailTarget.action}</p>
              </div>
              <div>
                <p className="text-muted-foreground">리소스 타입</p>
                <p className="mt-1 font-medium">{detailTarget.resourceType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">리소스 ID</p>
                <p className="mt-1 font-medium break-all">{detailTarget.resourceId ?? '-'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-muted-foreground">기록 시각</p>
                <p className="mt-1 font-medium">{formatDateTime(detailTarget.createdAt)}</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-muted-foreground">변경 전 상태</p>
              <JsonViewer value={detailTarget.beforeState} />
            </div>
            <div>
              <p className="mb-2 text-muted-foreground">변경 후 상태</p>
              <JsonViewer value={detailTarget.afterState} />
            </div>
            <div>
              <p className="mb-2 text-muted-foreground">메타데이터</p>
              <JsonViewer value={detailTarget.metadata} />
            </div>
          </div>
        ) : null}
      </AdminDetailDialog>
    </AdminPageShell>
  );
}
