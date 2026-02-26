import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-3">
      <Progress value={progress} className="flex-1" />
      <span className="text-sm font-medium tabular-nums">{progress}%</span>
    </div>
  );
}
