import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
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

export type RegisterFormValues = z.infer<typeof registerSchema>;
