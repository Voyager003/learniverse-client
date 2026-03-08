'use client';

import type { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

interface AdminDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isLoading: boolean;
  children: ReactNode;
}

export function AdminDetailDialog({
  open,
  onOpenChange,
  title,
  description,
  isLoading,
  children,
}: AdminDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {isLoading ? <LoadingSpinner className="min-h-40" /> : children}
      </DialogContent>
    </Dialog>
  );
}
