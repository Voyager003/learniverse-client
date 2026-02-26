import { Badge } from '@/components/ui/badge';
import { CourseDifficulty, DIFFICULTY_LABELS } from '@/lib/types';

const variantMap: Record<CourseDifficulty, 'default' | 'secondary' | 'outline'> = {
  [CourseDifficulty.BEGINNER]: 'secondary',
  [CourseDifficulty.INTERMEDIATE]: 'default',
  [CourseDifficulty.ADVANCED]: 'outline',
};

interface DifficultyBadgeProps {
  difficulty: CourseDifficulty;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <Badge variant={variantMap[difficulty]}>
      {DIFFICULTY_LABELS[difficulty]}
    </Badge>
  );
}
