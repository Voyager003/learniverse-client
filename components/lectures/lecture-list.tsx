import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BookOpen } from 'lucide-react';
import type { LectureResponse } from '@/lib/types';

interface LectureListProps {
  lectures: LectureResponse[];
}

export function LectureList({ lectures }: LectureListProps) {
  if (lectures.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        아직 등록된 레슨이 없습니다.
      </p>
    );
  }

  const sorted = [...lectures].sort((a, b) => a.order - b.order);

  return (
    <Accordion type="multiple" className="w-full">
      {sorted.map((lecture, index) => (
        <AccordionItem key={lecture.id} value={lecture.id}>
          <AccordionTrigger className="text-left">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {index + 1}
              </span>
              <span>{lecture.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-10">
              <p className="text-sm text-muted-foreground">{lecture.content}</p>
              {lecture.videoUrl && (
                <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                  <BookOpen className="h-4 w-4" />
                  <span>영상 자료 포함</span>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
