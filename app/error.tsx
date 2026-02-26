'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <AlertTriangle className="h-16 w-16 text-destructive" />
      <div>
        <h1 className="text-2xl font-bold">문제가 발생했습니다</h1>
        <p className="mt-2 text-muted-foreground">
          예상치 못한 오류가 발생했습니다. 다시 시도해주세요.
        </p>
      </div>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  );
}
