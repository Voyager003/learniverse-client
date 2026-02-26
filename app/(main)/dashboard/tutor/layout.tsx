import { Sidebar } from '@/components/layout/sidebar';

export default function TutorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
