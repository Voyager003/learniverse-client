'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsApi } from '@/lib/api/enrollments';
import type { CreateEnrollmentRequest, UpdateProgressRequest } from '@/lib/types';

const ENROLLMENTS_KEY = 'enrollments';

export function useMyEnrollments() {
  return useQuery({
    queryKey: [ENROLLMENTS_KEY, 'my'],
    queryFn: async () => {
      const result = await enrollmentsApi.getMyEnrollments();
      return result.data;
    },
  });
}

export function useEnrollment(id: string) {
  return useQuery({
    queryKey: [ENROLLMENTS_KEY, id],
    queryFn: async () => {
      const result = await enrollmentsApi.getMyEnrollments();
      const enrollment = result.data.find((e) => e.id === id);
      if (!enrollment) throw new Error('Enrollment not found');
      return enrollment;
    },
    enabled: !!id,
  });
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateEnrollmentRequest) => enrollmentsApi.createEnrollment(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [ENROLLMENTS_KEY, 'my'] }),
  });
}

export function useUpdateProgress(enrollmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateProgressRequest) =>
      enrollmentsApi.updateProgress(enrollmentId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENROLLMENTS_KEY, enrollmentId] });
      queryClient.invalidateQueries({ queryKey: [ENROLLMENTS_KEY, 'my'] });
    },
  });
}
