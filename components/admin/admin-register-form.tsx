'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, ShieldCheck } from 'lucide-react';
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
import { adminRegisterSchema, type AdminRegisterFormValues } from '@/lib/utils/validators';

const PENDING_ADMIN_EMAIL_KEY = 'pendingAdminEmail';

export function AdminRegisterForm() {
  const router = useRouter();
  const { registerAdmin, isAdminRegistering } = useAuth();

  const form = useForm<AdminRegisterFormValues>({
    resolver: zodResolver(adminRegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: AdminRegisterFormValues) {
    try {
      await registerAdmin({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(PENDING_ADMIN_EMAIL_KEY, values.email);
      }
      toast.success('관리자 회원가입이 완료되었습니다. 로그인해 주세요.');
      router.push('/admin/login?registered=1');
    } catch (error) {
      toast.error(getUserFacingErrorMessage(error, 'auth.adminRegister'));
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border bg-muted/40">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <CardTitle className="text-2xl font-bold">관리자 회원가입</CardTitle>
        <CardDescription>운영 콘솔에 접근할 관리자 계정을 생성합니다</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input placeholder="관리자 이름" autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      placeholder="6자 이상 입력"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호 확인</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 다시 입력하세요"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isAdminRegistering}>
              {isAdminRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              관리자 회원가입
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          이미 계정이 있으신가요?{' '}
          <Link href="/admin/login" className="text-primary underline-offset-4 hover:underline">
            관리자 로그인
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
