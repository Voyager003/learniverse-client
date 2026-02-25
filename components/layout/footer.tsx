import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-8 md:flex-row md:justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Learniverse. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <Link
            href="/courses"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            강의 탐색
          </Link>
        </nav>
      </div>
    </footer>
  );
}
