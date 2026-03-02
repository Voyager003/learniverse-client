export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-8">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Learniverse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
