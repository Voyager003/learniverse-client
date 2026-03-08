'use client';

import { useMemo, useState } from 'react';
import { Eye, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { AdminDetailDialog } from '@/components/admin/admin-detail-dialog';
import { AdminModerationDialog } from '@/components/admin/admin-moderation-dialog';
import { AdminPageShell } from '@/components/admin/admin-page-shell';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUserFacingErrorMessage } from '@/lib/errors/get-user-facing-error-message';
import { useAdminAssignment, useAdminAssignments, useUpdateAdminAssignmentModeration } from '@/lib/hooks/use-admin-content';
import { type AdminAssignmentQuery, type AdminAssignmentResponse } from '@/lib/types';
import { formatDate } from '@/lib/utils/format';

type PublishFilter = 'all' | 'true' | 'false';
type HiddenFilter = 'all' | 'true' | 'false';

function initialFilters() {
  return {
    courseId: '',
    isPublished: 'all' as PublishFilter,
    isAdminHidden: 'all' as HiddenFilter,
  };
}

export default function AdminAssignmentsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [moderationTarget, setModerationTarget] = useState<AdminAssignmentResponse | null>(null);

  const query = useMemo<AdminAssignmentQuery>(() => ({
    page,
    limit: 10,
    courseId: filters.courseId || undefined,
    isPublished: filters.isPublished === 'all' ? undefined : filters.isPublished === 'true',
    isAdminHidden: filters.isAdminHidden === 'all' ? undefined : filters.isAdminHidden === 'true',
  }), [filters, page]);

  const { data, isLoading, error, isFetching } = useAdminAssignments(query);
  const detailQuery = useAdminAssignment(detailId);
  const moderationMutation = useUpdateAdminAssignmentModeration();

  const assignments = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  async function handleModerationSubmit(body: { isHidden: boolean; reason?: string }) {
    if (!moderationTarget) return;

    try {
      await moderationMutation.mutateAsync({ id: moderationTarget.id, body });
      toast.success('과제 moderation 상태를 변경했습니다.');
      setModerationTarget(null);
    } catch (mutationError) {
      toast.error(getUserFacingErrorMessage(mutationError, 'query.generic'));
    }
  }

  return (
    <AdminPageShell
      title="과제 moderation"
      description="과제 공개 상태와 운영자 숨김 상태를 함께 관리합니다."
      actions={<div className="text-sm text-muted-foreground">총 {total}개 과제</div>}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border bg-background/80 p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <Input placeholder="강좌 ID로 필터" value={filters.courseId} onChange={(e) => { setPage(1); setFilters((p) => ({ ...p, courseId: e.target.value })); }} />
            <Select value={filters.isPublished} onValueChange={(v) => { setPage(1); setFilters((p) => ({ ...p, isPublished: v as PublishFilter })); }}>
              <SelectTrigger className="w-full"><SelectValue placeholder="공개 상태" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 공개 상태</SelectItem>
                <SelectItem value="true">공개</SelectItem>
                <SelectItem value="false">비공개</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.isAdminHidden} onValueChange={(v) => { setPage(1); setFilters((p) => ({ ...p, isAdminHidden: v as HiddenFilter })); }}>
              <SelectTrigger className="w-full"><SelectValue placeholder="운영 숨김 상태" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 운영 상태</SelectItem>
                <SelectItem value="true">운영자 숨김</SelectItem>
                <SelectItem value="false">노출 중</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { setFilters(initialFilters()); setPage(1); }}>필터 초기화</Button>
          </div>
        </div>

        {isLoading ? <LoadingSpinner className="min-h-[40vh]" size="lg" /> : error ? (
          <EmptyState title="과제 목록을 불러오지 못했습니다" description={getUserFacingErrorMessage(error, 'query.generic')} />
        ) : assignments.length === 0 ? (
          <EmptyState title="조건에 맞는 과제가 없습니다" description="필터 조건을 조정해 다시 확인해보세요" />
        ) : (
          <div className="rounded-2xl border bg-background/80">
            <div className="flex items-center justify-between border-b px-4 py-3 text-sm text-muted-foreground">
              <p>페이지 {data?.page ?? 1}{totalPages ? ` / ${totalPages}` : ''}</p>
              <p>{isFetching ? '최신 목록을 불러오는 중입니다.' : '과제 moderation 상태가 반영된 목록입니다.'}</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>과제</TableHead><TableHead>강좌</TableHead><TableHead>마감일</TableHead><TableHead>공개</TableHead><TableHead>운영 상태</TableHead><TableHead className="text-right">액션</TableHead></TableRow></TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell><div><p className="font-medium">{assignment.title}</p><p className="text-xs text-muted-foreground">{assignment.description}</p></div></TableCell>
                      <TableCell><div><p>{assignment.courseTitle ?? '-'}</p><p className="text-xs text-muted-foreground">{assignment.courseId}</p></div></TableCell>
                      <TableCell className="text-muted-foreground">{assignment.dueDate ? formatDate(assignment.dueDate) : '없음'}</TableCell>
                      <TableCell><Badge variant={assignment.isPublished ? 'default' : 'outline'}>{assignment.isPublished ? '공개' : '비공개'}</Badge></TableCell>
                      <TableCell><Badge variant={assignment.isAdminHidden ? 'destructive' : 'outline'}>{assignment.isAdminHidden ? '운영자 숨김' : '노출 중'}</Badge></TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setDetailId(assignment.id)}><Eye className="mr-2 h-4 w-4" />상세</Button>
                          <Button variant="outline" size="sm" onClick={() => setModerationTarget(assignment)}><Shield className="mr-2 h-4 w-4" />{assignment.isAdminHidden ? '숨김 해제' : '숨김'}</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between border-t px-4 py-3"><p className="text-sm text-muted-foreground">현재 {assignments.length}개 표시 / 총 {total}개</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={(data?.page ?? 1) <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>이전</Button><Button variant="outline" size="sm" disabled={totalPages === 0 || (data?.page ?? 1) >= totalPages} onClick={() => setPage((prev) => prev + 1)}>다음</Button></div></div>
          </div>
        )}
      </div>

      <AdminDetailDialog open={!!detailId} onOpenChange={(open) => !open && setDetailId(null)} title="과제 상세" description="관리자 관점에서 과제 공개 상태와 moderation 메타데이터를 확인합니다." isLoading={detailQuery.isLoading || detailQuery.isFetching}>
        {detailQuery.data ? (
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><p className="text-muted-foreground">과제명</p><p className="mt-1 font-medium">{detailQuery.data.title}</p></div>
              <div><p className="text-muted-foreground">강좌</p><p className="mt-1 font-medium">{detailQuery.data.courseTitle ?? '-'}</p></div>
              <div><p className="text-muted-foreground">마감일</p><p className="mt-1 font-medium">{detailQuery.data.dueDate ? formatDate(detailQuery.data.dueDate) : '없음'}</p></div>
              <div><p className="text-muted-foreground">운영 상태</p><p className="mt-1 font-medium">{detailQuery.data.isAdminHidden ? '운영자 숨김' : '노출 중'}</p></div>
            </div>
            <div><p className="text-muted-foreground">설명</p><p className="mt-1 whitespace-pre-wrap">{detailQuery.data.description}</p></div>
            <div className="rounded-lg border bg-muted/20 p-3"><p className="text-muted-foreground">운영 숨김 사유</p><p className="mt-1 font-medium">{detailQuery.data.adminHiddenReason ?? '없음'}</p></div>
          </div>
        ) : null}
      </AdminDetailDialog>

      <AdminModerationDialog key={moderationTarget?.id ?? 'assignment-moderation'} open={!!moderationTarget} onOpenChange={(open) => !open && setModerationTarget(null)} title={moderationTarget?.isAdminHidden ? '과제 숨김 해제' : '과제 숨김'} description={moderationTarget ? `${moderationTarget.title} 과제의 운영 노출 상태를 변경합니다.` : ''} isCurrentlyHidden={moderationTarget?.isAdminHidden ?? false} isSubmitting={moderationMutation.isPending} onSubmit={handleModerationSubmit} />
    </AdminPageShell>
  );
}
