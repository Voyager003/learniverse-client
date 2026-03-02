import Link from 'next/link';
import type { Metadata } from 'next';
import { LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Learniverse',
};

export default function HomePage() {
  return (
    <div className="container mx-auto flex min-h-[65vh] items-center justify-center px-4 py-12">
      <section className="w-full max-w-3xl">
        <h1 className="text-center text-3xl font-bold tracking-tight">Learniverse</h1>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">기존 사용자</CardTitle>
              <CardDescription>이미 계정이 있다면 바로 로그인하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="w-full" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  로그인
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">신규 사용자</CardTitle>
              <CardDescription>처음이라면 회원가입 후 시작하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" variant="outline" className="w-full" asChild>
                <Link href="/register">
                  <UserPlus className="mr-2 h-4 w-4" />
                  회원가입
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
