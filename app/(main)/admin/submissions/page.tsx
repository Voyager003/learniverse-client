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
import { useAdminSubmission, useAdminSubmissions, useUpdateAdminSubmissionModeration } from '@/lib/hooks/use-admin-content';
import { SUBMISSION_STATUS_LABELS, SubmissionStatus, type AdminSubmissionQuery, type AdminSubmissionResponse } from '@/lib/types';
import { formatDate } from '@/lib/utils/format';

type HiddenFilter = 'all' | 'true' | 'false';
type SubmissionStatusFilter = SubmissionStatus | 'all';

function initialFilters() {
  return {
    courseId: '',
    assignmentId: '',
    studentId: '',
    status: 'all' as SubmissionStatusFilter,
    isAdminHidden: 'all' as HiddenFilter,
  };
}

export default function AdminSubmissionsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [moderationTarget, setModerationTarget] = useState<AdminSubmissionResponse | null>(null);

  const query = useMemo<AdminSubmissionQuery>(() => ({
    page,
    limit: 10,
    courseId: filters.courseId || undefined,
    assignmentId: filters.assignmentId || undefined,
    studentId: filters.studentId || undefined,
    status: filters.status === 'all' ? undefined : filters.status,
    isAdminHidden: filters.isAdminHidden === 'all' ? undefined : filters.isAdminHidden === 'true',
  }), [filters, page]);

  const { data, isLoading, error, isFetching } = useAdminSubmissions(query);
  const detailQuery = useAdminSubmission(detailId);
  const moderationMutation = useUpdateAdminSubmissionModeration();

  const submissions = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  async function handleModerationSubmit(body: { isHidden: boolean; reason?: string }) {
    if (!moderationTarget) return;

    try {
      await moderationMutation.mutateAsync({ id: moderationTarget.id, body });
      toast.success('제출물 moderation 상태를 변경했습니다.');
      setModerationTarget(null);
    } catch (mutationError) {
      toast.error(getUserFacingErrorMessage(mutationError, 'query.generic'));
    }
  }

  return (
    <AdminPageShell title="제출물 moderation" description="학생 제출물을 검토하고 운영자 숨김 상태를 관리합니다." actions={<div className="text-sm text-muted-foreground">총 {total}개 제출</div>}>
      <div className="space-y-6">
        <div className="rounded-2xl border bg-background/80 p-4">
          <div className="grid gap-3 md:grid-cols-5">
            <Input placeholder="강좌 ID" value={filters.courseId} onChange={(e) => { setPage(1); setFilters((p) => ({ ...p, courseId: e.target.value })); }} />
            <Input placeholder="과제 ID" value={filters.assignmentId} onChange={(e) => { setPage(1); setFilters((p) => ({ ...p, assignmentId: e.target.value })); }} />
            <Input placeholder="학생 ID" value={filters.studentId} onChange={(e) => { setPage(1); setFilters((p) => ({ ...p, studentId: e.target.value })); }} />
            <Select value={filters.status} onValueChange={(value) => { setPage(1); setFilters((p) => ({ ...p, status: value as SubmissionStatusFilter })); }}>
              <SelectTrigger className="w-full"><SelectValue placeholder="제출 상태" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 제출 상태</SelectItem>
                <SelectItem value={SubmissionStatus.SUBMITTED}>{SUBMISSION_STATUS_LABELS[SubmissionStatus.SUBMITTED]}</SelectItem>
                <SelectItem value={SubmissionStatus.REVIEWED}>{SUBMISSION_STATUS_LABELS[SubmissionStatus.REVIEWED]}</SelectItem>
                <SelectItem value={SubmissionStatus.RETURNED}>{SUBMISSION_STATUS_LABELS[SubmissionStatus.RETURNED]}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.isAdminHidden} onValueChange={(value) => { setPage(1); setFilters((p) => ({ ...p, isAdminHidden: value as HiddenFilter })); }}>
              <SelectTrigger className="w-full"><SelectValue placeholder="운영 숨김 상태" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 운영 상태</SelectItem>
                <SelectItem value="true">운영자 숨김</SelectItem>
                <SelectItem value="false">노출 중</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? <LoadingSpinner className="min-h-[40vh]" size="lg" /> : error ? (
          <EmptyState title="제출물 목록을 불러오지 못했습니다" description={getUserFacingErrorMessage(error, 'query.generic')} />
        ) : submissions.length === 0 ? (
          <EmptyState title="조건에 맞는 제출물이 없습니다" description="필터 조건을 조정해 다시 확인해보세요" />
        ) : (
          <div className="rounded-2xl border bg-background/80">
            <div className="flex items-center justify-between border-b px-4 py-3 text-sm text-muted-foreground"><p>페이지 {data?.page ?? 1}{totalPages ? ` / ${totalPages}` : ''}</p><p>{isFetching ? '최신 목록을 불러오는 중입니다.' : '제출물 moderation 상태가 반영된 목록입니다.'}</p></div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>학생</TableHead><TableHead>과제</TableHead><TableHead>상태</TableHead><TableHead>운영 상태</TableHead><TableHead>제출일</TableHead><TableHead className="text-right">액션</TableHead></TableRow></TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell><div><p>{submission.studentName ?? '-'}</p><p className="text-xs text-muted-foreground">{submission.studentId}</p></div></TableCell>
                      <TableCell className="text-muted-foreground">{submission.assignmentId}</TableCell>
                      <TableCell><Badge variant="secondary">{SUBMISSION_STATUS_LABELS[submission.status]}</Badge></TableCell>
                      <TableCell><Badge variant={submission.isAdminHidden ? 'destructive' : 'outline'}>{submission.isAdminHidden ? '운영자 숨김' : '노출 중'}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(submission.createdAt)}</TableCell>
                      <TableCell><div className="flex justify-end gap-2"><Button variant="outline" size="sm" onClick={() => setDetailId(submission.id)}><Eye className="mr-2 h-4 w-4" />상세</Button><Button variant="outline" size="sm" onClick={() => setModerationTarget(submission)}><Shield className="mr-2 h-4 w-4" />{submission.isAdminHidden ? '숨김 해제' : '숨김'}</Button></div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between border-t px-4 py-3"><p className="text-sm text-muted-foreground">현재 {submissions.length}개 표시 / 총 {total}개</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={(data?.page ?? 1) <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>이전</Button><Button variant="outline" size="sm" disabled={totalPages === 0 || (data?.page ?? 1) >= totalPages} onClick={() => setPage((prev) => prev + 1)}>다음</Button></div></div>
          </div>
        )}
      </div>

      <AdminDetailDialog open={!!detailId} onOpenChange={(open) => !open && setDetailId(null)} title="제출물 상세" description="관리자 관점에서 제출 내용과 moderation 메타데이터를 확인합니다." isLoading={detailQuery.isLoading || detailQuery.isFetching}>
        {detailQuery.data ? (
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><p className="text-muted-foreground">학생</p><p className="mt-1 font-medium">{detailQuery.data.studentName ?? '-'}</p></div>
              <div><p className="text-muted-foreground">상태</p><p className="mt-1 font-medium">{SUBMISSION_STATUS_LABELS[detailQuery.data.status]}</p></div>
              <div><p className="text-muted-foreground">점수</p><p className="mt-1 font-medium">{detailQuery.data.score ?? '미채점'}</p></div>
              <div><p className="text-muted-foreground">검토일</p><p className="mt-1 font-medium">{detailQuery.data.reviewedAt ? formatDate(detailQuery.data.reviewedAt) : '없음'}</p></div>
            </div>
            <div><p className="text-muted-foreground">제출 내용</p><p className="mt-1 whitespace-pre-wrap">{detailQuery.data.content}</p></div>
            <div><p className="text-muted-foreground">피드백</p><p className="mt-1 whitespace-pre-wrap">{detailQuery.data.feedback ?? '없음'}</p></div>
            <div><p className="text-muted-foreground">파일 URL</p><div className="mt-1 space-y-1">{detailQuery.data.fileUrls.length > 0 ? detailQuery.data.fileUrls.map((url) => <p key={url} className="break-all">{url}</p>) : <p>없음</p>}</div></div>
            <div className="rounded-lg border bg-muted/20 p-3"><p className="text-muted-foreground">운영 숨김 사유</p><p className="mt-1 font-medium">{detailQuery.data.adminHiddenReason ?? '없음'}</p></div>
          </div>
        ) : null}
      </AdminDetailDialog>

      <AdminModerationDialog key={moderationTarget?.id ?? 'submission-moderation'} open={!!moderationTarget} onOpenChange={(open) => !open && setModerationTarget(null)} title={moderationTarget?.isAdminHidden ? '제출물 숨김 해제' : '제출물 숨김'} description={moderationTarget ? `${moderationTarget.studentName ?? moderationTarget.studentId} 제출물의 운영 노출 상태를 변경합니다.` : ''} isCurrentlyHidden={moderationTarget?.isAdminHidden ?? false} isSubmitting={moderationMutation.isPending} onSubmit={handleModerationSubmit} />
    </AdminPageShell>
  );
}
