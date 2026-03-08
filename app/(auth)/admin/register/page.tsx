import type { Metadata } from 'next';
import { AdminRegisterForm } from '@/components/admin/admin-register-form';

export const metadata: Metadata = {
  title: '관리자 회원가입',
};

export default function AdminRegisterPage() {
  return <AdminRegisterForm />;
}
