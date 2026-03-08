import { z } from 'zod';
import { CourseCategory, CourseDifficulty } from '@/lib/types';

export const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

const baseRegisterSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(6, '비밀번호는 6자 이상이어야 합니다')
    .max(100, '비밀번호는 100자 이하여야 합니다'),
  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(50, '이름은 50자 이하여야 합니다'),
});

export const registerSchema = baseRegisterSchema.extend({
  role: z.enum(['student', 'tutor']),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const adminRegisterSchema = baseRegisterSchema
  .extend({
    confirmPassword: z
      .string()
      .min(6, '비밀번호는 6자 이상이어야 합니다')
      .max(100, '비밀번호는 100자 이하여야 합니다'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

export type AdminRegisterFormValues = z.infer<typeof adminRegisterSchema>;

export const courseSchema = z.object({
  title: z
    .string()
    .min(1, '강의 제목을 입력해주세요')
    .max(100, '제목은 100자 이하여야 합니다'),
  description: z
    .string()
    .min(1, '강의 설명을 입력해주세요')
    .max(2000, '설명은 2000자 이하여야 합니다'),
  category: z.nativeEnum(CourseCategory),
  difficulty: z.nativeEnum(CourseDifficulty),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

export const lectureSchema = z.object({
  title: z
    .string()
    .min(1, '레슨 제목을 입력해주세요')
    .max(200, '제목은 200자 이하여야 합니다'),
  content: z
    .string()
    .min(1, '레슨 내용을 입력해주세요')
    .max(5000, '내용은 5000자 이하여야 합니다'),
  videoUrl: z
    .string()
    .url('올바른 URL 형식이 아닙니다')
    .optional()
    .or(z.literal('')),
  order: z
    .number()
    .min(1, '순서는 1 이상이어야 합니다'),
});

export type LectureFormValues = z.infer<typeof lectureSchema>;

export const assignmentSchema = z.object({
  title: z
    .string()
    .min(1, '과제 제목을 입력해주세요')
    .max(200, '제목은 200자 이하여야 합니다'),
  description: z
    .string()
    .min(1, '과제 설명을 입력해주세요')
    .max(2000, '설명은 2000자 이하여야 합니다'),
  dueDate: z.string().optional().or(z.literal('')),
});

export type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export const submissionSchema = z.object({
  content: z
    .string()
    .min(1, '제출 내용을 입력해주세요')
    .max(5000, '내용은 5000자 이하여야 합니다'),
});

export type SubmissionFormValues = z.infer<typeof submissionSchema>;

export const feedbackSchema = z.object({
  feedback: z
    .string()
    .min(1, '피드백을 입력해주세요')
    .max(2000, '피드백은 2000자 이하여야 합니다'),
  score: z
    .number()
    .min(0, '점수는 0 이상이어야 합니다')
    .max(100, '점수는 100 이하여야 합니다')
    .optional(),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export const profileSchema = z.object({
  name: z
    .string()
    .max(50, '이름은 50자 이하여야 합니다'),
  password: z
    .string()
    .max(100, '비밀번호는 100자 이하여야 합니다')
    .refine((val) => val === '' || val.length >= 6, {
      message: '비밀번호는 6자 이상이어야 합니다',
    }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
