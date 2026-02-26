import type { Metadata } from 'next';
import { AdminGuard } from '@/components/auth/admin-guard';

export const metadata: Metadata = {
  title: '관리자',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}
