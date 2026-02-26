'use client';

import Link from 'next/link';
import { Users, BookOpen, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">관리자 대시보드</h1>
        <p className="mt-2 text-muted-foreground">플랫폼을 관리하세요</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">사용자 관리</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              등록된 사용자를 조회하고 관리합니다
            </p>
            <Button asChild size="sm">
              <Link href="/admin/users">사용자 목록</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">강의 관리</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              등록된 강의를 조회합니다
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/courses">강의 카탈로그</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">시스템</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              관리자 권한으로 플랫폼을 운영합니다
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
