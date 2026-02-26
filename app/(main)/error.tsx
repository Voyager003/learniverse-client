'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MainErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <div>
        <h1 className="text-2xl font-bold">문제가 발생했습니다</h1>
        <p className="mt-2 text-muted-foreground">
          페이지를 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>다시 시도</Button>
        <Button variant="outline" asChild>
          <Link href="/">홈으로</Link>
        </Button>
      </div>
    </div>
  );
}
