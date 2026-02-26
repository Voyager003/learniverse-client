'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionsApi } from '@/lib/api/submissions';
import type { CreateSubmissionRequest, AddFeedbackRequest } from '@/lib/types';

const SUBMISSIONS_KEY = 'submissions';

export function useSubmissions(assignmentId: string) {
  return useQuery({
    queryKey: [SUBMISSIONS_KEY, assignmentId],
    queryFn: () => submissionsApi.getSubmissions(assignmentId),
    enabled: !!assignmentId,
  });
}

export function useCreateSubmission(assignmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateSubmissionRequest) =>
      submissionsApi.createSubmission(assignmentId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [SUBMISSIONS_KEY, assignmentId] }),
  });
}

export function useAddFeedback(assignmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ submissionId, body }: { submissionId: string; body: AddFeedbackRequest }) =>
      submissionsApi.addFeedback(assignmentId, submissionId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [SUBMISSIONS_KEY, assignmentId] }),
  });
}
