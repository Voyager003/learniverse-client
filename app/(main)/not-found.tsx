import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MainNotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <FileQuestion className="h-12 w-12 text-muted-foreground" />
      <div>
        <h1 className="text-3xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">
          요청하신 페이지를 찾을 수 없습니다
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">홈으로</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/courses">강의 둘러보기</Link>
        </Button>
      </div>
    </div>
  );
}
