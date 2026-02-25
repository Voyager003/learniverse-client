import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
