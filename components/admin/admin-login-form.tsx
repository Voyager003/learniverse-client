'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/lib/hooks/use-auth';
import { getUserFacingErrorMessage } from '@/lib/errors/get-user-facing-error-message';
import { loginSchema, type LoginFormValues } from '@/lib/utils/validators';

const demoAdminEmail = process.env.NEXT_PUBLIC_ADMIN_DEMO_EMAIL;
const demoAdminPassword = process.env.NEXT_PUBLIC_ADMIN_DEMO_PASSWORD;

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/admin';
  const { loginAdmin, isAdminLoggingIn } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: demoAdminEmail ?? '',
      password: demoAdminPassword ?? '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await loginAdmin(values);
      toast.success('관리자 로그인되었습니다');
      router.push(callbackUrl);
    } catch (error) {
      toast.error(getUserFacingErrorMessage(error, 'auth.adminLogin'));
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border bg-muted/40">
          <Shield className="h-5 w-5" />
        </div>
        <CardTitle className="text-2xl font-bold">관리자 로그인</CardTitle>
        <CardDescription>플랫폼 운영자를 위한 전용 로그인 화면입니다</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm">
          <p className="font-medium">포트폴리오 데모 안내</p>
          {demoAdminEmail || demoAdminPassword ? (
            <div className="mt-2 space-y-1 text-muted-foreground">
              {demoAdminEmail ? <p>이메일: {demoAdminEmail}</p> : null}
              {demoAdminPassword ? <p>비밀번호: {demoAdminPassword}</p> : null}
            </div>
          ) : (
            <p className="mt-2 text-muted-foreground">
              시연용 관리자 계정은 환경 변수로 주입됩니다.
            </p>
          )}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>관리자 이메일</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isAdminLoggingIn}>
              {isAdminLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              관리자 로그인
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          일반 사용자이신가요?{' '}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            일반 로그인으로 이동
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
