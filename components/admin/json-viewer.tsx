import { cn } from '@/lib/utils';

interface JsonViewerProps {
  value: unknown;
  emptyLabel?: string;
  className?: string;
}

export function JsonViewer({ value, emptyLabel = '없음', className }: JsonViewerProps) {
  if (value === null || value === undefined) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <pre
      className={cn(
        'overflow-x-auto rounded-lg border bg-muted/20 p-3 text-xs leading-6 text-foreground',
        className,
      )}
    >
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}
