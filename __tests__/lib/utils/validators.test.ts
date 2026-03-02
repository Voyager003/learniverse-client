import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '@/lib/utils/validators';

describe('loginSchema', () => {
  it('유효한 로그인 데이터를 통과시킨다', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('이메일이 비어있으면 실패한다', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('이메일 형식이 올바르지 않으면 실패한다', () => {
    const result = loginSchema.safeParse({
      email: 'not-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('비밀번호가 6자 미만이면 실패한다', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('유효한 회원가입 데이터를 통과시킨다', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'student',
    });
    expect(result.success).toBe(true);
  });

  it('튜터 role 값도 통과시킨다', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'tutor',
    });
    expect(result.success).toBe(true);
  });

  it('이름이 비어있으면 실패한다', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      name: '',
      role: 'student',
    });
    expect(result.success).toBe(false);
  });

  it('이름이 50자를 초과하면 실패한다', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      name: 'a'.repeat(51),
      role: 'student',
    });
    expect(result.success).toBe(false);
  });

  it('비밀번호가 100자를 초과하면 실패한다', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'a'.repeat(101),
      name: 'Test',
      role: 'student',
    });
    expect(result.success).toBe(false);
  });

  it('허용되지 않은 role 값이면 실패한다', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test',
      role: 'admin',
    });
    expect(result.success).toBe(false);
  });
});
