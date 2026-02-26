import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '내 학습',
};

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
