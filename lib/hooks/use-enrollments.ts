'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsApi } from '@/lib/api/enrollments';
import type { CreateEnrollmentRequest, UpdateProgressRequest } from '@/lib/types';

const ENROLLMENTS_KEY = 'enrollments';

export function useMyEnrollments() {
  return useQuery({
    queryKey: [ENROLLMENTS_KEY, 'me'],
    queryFn: () => enrollmentsApi.getMyEnrollments(),
  });
}

export function useEnrollment(id: string) {
  return useQuery({
    queryKey: [ENROLLMENTS_KEY, id],
    queryFn: () => enrollmentsApi.getEnrollment(id),
    enabled: !!id,
  });
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateEnrollmentRequest) => enrollmentsApi.createEnrollment(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [ENROLLMENTS_KEY] }),
  });
}

export function useUpdateProgress(enrollmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateProgressRequest) =>
      enrollmentsApi.updateProgress(enrollmentId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENROLLMENTS_KEY, enrollmentId] });
      queryClient.invalidateQueries({ queryKey: [ENROLLMENTS_KEY, 'me'] });
    },
  });
}
