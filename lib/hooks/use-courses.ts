'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api/courses';
import { useAuthStore } from '@/lib/store/auth-store';
import type {
  CourseQuery,
  CreateCourseRequest,
  UpdateCourseRequest,
  CreateLectureRequest,
  UpdateLectureRequest,
} from '@/lib/types';

const COURSES_KEY = 'courses';
const MY_COURSES_KEY = 'my-courses';

export function useMyCourses() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: [MY_COURSES_KEY, user?.id],
    queryFn: () => coursesApi.getMyCourses(user!.id),
    enabled: !!user?.id,
  });
}

export function useCourses(query?: CourseQuery) {
  return useQuery({
    queryKey: [COURSES_KEY, query],
    queryFn: () => coursesApi.getCourses(query),
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: [COURSES_KEY, id],
    queryFn: () => coursesApi.getCourse(id),
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCourseRequest) => coursesApi.createCourse(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_KEY] });
      queryClient.invalidateQueries({ queryKey: [MY_COURSES_KEY] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateCourseRequest }) =>
      coursesApi.updateCourse(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_KEY] });
      queryClient.invalidateQueries({ queryKey: [MY_COURSES_KEY] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coursesApi.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_KEY] });
      queryClient.invalidateQueries({ queryKey: [MY_COURSES_KEY] });
    },
  });
}

export function useCreateLecture(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateLectureRequest) => coursesApi.createLecture(courseId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [COURSES_KEY, courseId] }),
  });
}

export function useUpdateLecture(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lectureId, body }: { lectureId: string; body: UpdateLectureRequest }) =>
      coursesApi.updateLecture(courseId, lectureId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [COURSES_KEY, courseId] }),
  });
}

export function useDeleteLecture(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lectureId: string) => coursesApi.deleteLecture(courseId, lectureId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [COURSES_KEY, courseId] }),
  });
}
