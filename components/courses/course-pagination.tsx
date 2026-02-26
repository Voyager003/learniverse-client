'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CoursePaginationProps {
  currentPage: number;
  totalPages: number;
}

export function CoursePagination({ currentPage, totalPages }: CoursePaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function buildHref(page: number): string {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    return `/courses?${params.toString()}`;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" size="icon" asChild disabled={currentPage <= 1}>
        <Link href={buildHref(currentPage - 1)} aria-label="이전 페이지">
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
      <span className="text-sm text-muted-foreground">
        {currentPage} / {totalPages}
      </span>
      <Button variant="outline" size="icon" asChild disabled={currentPage >= totalPages}>
        <Link href={buildHref(currentPage + 1)} aria-label="다음 페이지">
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
