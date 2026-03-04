'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentsApi } from '@/lib/api/assignments';
import type { CreateAssignmentRequest } from '@/lib/types';

const ASSIGNMENTS_KEY = 'assignments';

export function useAssignments(courseId: string) {
  return useQuery({
    queryKey: [ASSIGNMENTS_KEY, courseId],
    queryFn: () => assignmentsApi.getAssignments(courseId),
    enabled: !!courseId,
  });
}

export function useCreateAssignment(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAssignmentRequest) =>
      assignmentsApi.createAssignment(courseId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [ASSIGNMENTS_KEY, courseId] }),
  });
}
