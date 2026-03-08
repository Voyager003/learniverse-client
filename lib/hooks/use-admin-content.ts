'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminContentApi } from '@/lib/api/admin-content';
import type {
  AdminAssignmentQuery,
  AdminCourseQuery,
  AdminModerationRequest,
  AdminSubmissionQuery,
} from '@/lib/types';

const ADMIN_COURSES_KEY = 'admin-courses';
const ADMIN_ASSIGNMENTS_KEY = 'admin-assignments';
const ADMIN_SUBMISSIONS_KEY = 'admin-submissions';

export function useAdminCourses(query?: AdminCourseQuery) {
  return useQuery({
    queryKey: [ADMIN_COURSES_KEY, query],
    queryFn: () => adminContentApi.getCourses(query),
  });
}

export function useAdminCourse(id: string | null) {
  return useQuery({
    queryKey: [ADMIN_COURSES_KEY, id],
    queryFn: () => adminContentApi.getCourse(id!),
    enabled: !!id,
  });
}

export function useUpdateAdminCourseModeration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AdminModerationRequest }) =>
      adminContentApi.updateCourseModeration(id, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_COURSES_KEY] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_COURSES_KEY, variables.id] });
    },
  });
}

export function useAdminAssignments(query?: AdminAssignmentQuery) {
  return useQuery({
    queryKey: [ADMIN_ASSIGNMENTS_KEY, query],
    queryFn: () => adminContentApi.getAssignments(query),
  });
}

export function useAdminAssignment(id: string | null) {
  return useQuery({
    queryKey: [ADMIN_ASSIGNMENTS_KEY, id],
    queryFn: () => adminContentApi.getAssignment(id!),
    enabled: !!id,
  });
}

export function useUpdateAdminAssignmentModeration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AdminModerationRequest }) =>
      adminContentApi.updateAssignmentModeration(id, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_ASSIGNMENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_ASSIGNMENTS_KEY, variables.id] });
    },
  });
}

export function useAdminSubmissions(query?: AdminSubmissionQuery) {
  return useQuery({
    queryKey: [ADMIN_SUBMISSIONS_KEY, query],
    queryFn: () => adminContentApi.getSubmissions(query),
  });
}

export function useAdminSubmission(id: string | null) {
  return useQuery({
    queryKey: [ADMIN_SUBMISSIONS_KEY, id],
    queryFn: () => adminContentApi.getSubmission(id!),
    enabled: !!id,
  });
}

export function useUpdateAdminSubmissionModeration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AdminModerationRequest }) =>
      adminContentApi.updateSubmissionModeration(id, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_SUBMISSIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_SUBMISSIONS_KEY, variables.id] });
    },
  });
}
