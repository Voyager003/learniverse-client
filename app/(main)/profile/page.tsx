'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { useAuthStore } from '@/lib/store/auth-store';
import { usersApi } from '@/lib/api/users';
import { getUserFacingErrorMessage } from '@/lib/errors/get-user-facing-error-message';
import { ROLE_LABELS } from '@/lib/types';
import { formatDate } from '@/lib/utils/format';
import { profileSchema, type ProfileFormValues } from '@/lib/utils/validators';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      password: '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const body: Record<string, string> = {};
      if (values.name && values.name !== user?.name) body.name = values.name;
      if (values.password) body.password = values.password;

      if (Object.keys(body).length === 0) {
        throw new Error('변경 사항이 없습니다');
      }

      return usersApi.updateMe(body);
    },
    onSuccess: (updatedUser) => {
      const { accessToken, refreshToken } = useAuthStore.getState();
      setAuth(updatedUser, accessToken ?? '', refreshToken ?? '');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      form.setValue('password', '');
      toast.success('프로필이 수정되었습니다');
    },
    onError: (error) => {
      toast.error(getUserFacingErrorMessage(error, 'profile.update'));
    },
  });

  if (!user) {
    return <LoadingSpinner className="min-h-[50vh]" size="lg" />;
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold">내 프로필</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">계정 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">이메일</span>
            <span className="text-sm font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">역할</span>
            <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">가입일</span>
            <span className="text-sm">{formatDate(user.createdAt)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">프로필 수정</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => updateMutation.mutate(values))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input placeholder="이름을 입력하세요" {...field} />
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
                    <FormLabel>새 비밀번호 (변경 시에만 입력)</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="새 비밀번호"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                저장
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
