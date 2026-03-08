'use client';

import { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import { AdminDetailDialog } from '@/components/admin/admin-detail-dialog';
import { AdminPageShell } from '@/components/admin/admin-page-shell';
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
import { useAdminEnrollment, useAdminEnrollments } from '@/lib/hooks/use-admin-operations';
import {
  ENROLLMENT_STATUS_LABELS,
  EnrollmentStatus,
  type AdminEnrollmentQuery,
} from '@/lib/types';
import { formatDate, formatDateTime } from '@/lib/utils/format';

type EnrollmentStatusFilter = EnrollmentStatus | 'all';

function initialFilters() {
  return {
    studentId: '',
    courseId: '',
    status: 'all' as EnrollmentStatusFilter,
  };
}

export default function AdminEnrollmentsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState<string | null>(null);

  const query = useMemo<AdminEnrollmentQuery>(
    () => ({
      page,
      limit: 10,
      studentId: filters.studentId || undefined,
      courseId: filters.courseId || undefined,
      status: filters.status === 'all' ? undefined : filters.status,
    }),
    [filters, page],
  );

  const { data, isLoading, error, isFetching } = useAdminEnrollments(query);
  const detailQuery = useAdminEnrollment(detailId);

  const enrollments = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  function resetFilters() {
    setFilters(initialFilters());
    setPage(1);
  }

  return (
    <AdminPageShell
      title="수강 운영 조회"
      description="학생, 강좌, 상태 기준으로 수강 현황을 전역 조회합니다."
      actions={<div className="text-sm text-muted-foreground">총 {total}건</div>}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border bg-background/80 p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <Input
              placeholder="학생 ID"
              value={filters.studentId}
              onChange={(event) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, studentId: event.target.value }));
              }}
            />
            <Input
              placeholder="강좌 ID"
              value={filters.courseId}
              onChange={(event) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, courseId: event.target.value }));
              }}
            />
            <Select
              value={filters.status}
              onValueChange={(value) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, status: value as EnrollmentStatusFilter }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="수강 상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value={EnrollmentStatus.ACTIVE}>
                  {ENROLLMENT_STATUS_LABELS[EnrollmentStatus.ACTIVE]}
                </SelectItem>
                <SelectItem value={EnrollmentStatus.COMPLETED}>
                  {ENROLLMENT_STATUS_LABELS[EnrollmentStatus.COMPLETED]}
                </SelectItem>
                <SelectItem value={EnrollmentStatus.DROPPED}>
                  {ENROLLMENT_STATUS_LABELS[EnrollmentStatus.DROPPED]}
                </SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={resetFilters}>
              필터 초기화
            </Button>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner className="min-h-[40vh]" size="lg" />
        ) : error ? (
          <EmptyState
            title="수강 목록을 불러오지 못했습니다"
            description={getUserFacingErrorMessage(error, 'admin.enrollments.query')}
          />
        ) : enrollments.length === 0 ? (
          <EmptyState
            title="조건에 맞는 수강 내역이 없습니다"
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
                    <TableHead>학생</TableHead>
                    <TableHead>강좌</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>진도</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead className="text-right">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>
                        <div>
                          <p>{enrollment.studentName ?? '-'}</p>
                          <p className="text-xs text-muted-foreground">{enrollment.studentId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{enrollment.courseTitle ?? '-'}</p>
                          <p className="text-xs text-muted-foreground">{enrollment.courseId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {ENROLLMENT_STATUS_LABELS[enrollment.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{enrollment.progress}%</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(enrollment.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setDetailId(enrollment.id)}>
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
                현재 {enrollments.length}개 표시 / 총 {total}개
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
        open={!!detailId}
        onOpenChange={(open) => !open && setDetailId(null)}
        title="수강 상세"
        description="관리자 관점에서 수강 상태와 진도 정보를 확인합니다."
        isLoading={detailQuery.isLoading || detailQuery.isFetching}
      >
        {detailQuery.data ? (
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">학생</p>
                <p className="mt-1 font-medium">{detailQuery.data.studentName ?? '-'}</p>
                <p className="text-xs text-muted-foreground">{detailQuery.data.studentId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">강좌</p>
                <p className="mt-1 font-medium">{detailQuery.data.courseTitle ?? '-'}</p>
                <p className="text-xs text-muted-foreground">{detailQuery.data.courseId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">상태</p>
                <p className="mt-1 font-medium">{ENROLLMENT_STATUS_LABELS[detailQuery.data.status]}</p>
              </div>
              <div>
                <p className="text-muted-foreground">진도</p>
                <p className="mt-1 font-medium">{detailQuery.data.progress}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">등록일</p>
                <p className="mt-1 font-medium">{formatDateTime(detailQuery.data.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">최종 수정일</p>
                <p className="mt-1 font-medium">{formatDateTime(detailQuery.data.updatedAt)}</p>
              </div>
            </div>
          </div>
        ) : null}
      </AdminDetailDialog>
    </AdminPageShell>
  );
}
