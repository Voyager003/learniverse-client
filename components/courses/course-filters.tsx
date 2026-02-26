'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  CourseCategory,
  CourseDifficulty,
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
} from '@/lib/types';

export function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') ?? '';
  const currentDifficulty = searchParams.get('difficulty') ?? '';

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`/courses?${params.toString()}`);
    },
    [router, searchParams],
  );

  const clearFilters = useCallback(() => {
    router.push('/courses');
  }, [router]);

  const hasFilters = currentCategory || currentDifficulty;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={currentCategory || 'all'}
        onValueChange={(v) => updateFilter('category', v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="카테고리" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 카테고리</SelectItem>
          {Object.values(CourseCategory).map((cat) => (
            <SelectItem key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentDifficulty || 'all'}
        onValueChange={(v) => updateFilter('difficulty', v)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="난이도" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 난이도</SelectItem>
          {Object.values(CourseDifficulty).map((diff) => (
            <SelectItem key={diff} value={diff}>
              {DIFFICULTY_LABELS[diff]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          필터 초기화
        </Button>
      )}
    </div>
  );
}
