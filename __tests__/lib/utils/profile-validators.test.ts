import { describe, it, expect } from 'vitest';
import { profileSchema } from '@/lib/utils/validators';

describe('profileSchema', () => {
  it('이름만 변경 시 유효하다', () => {
    const result = profileSchema.safeParse({ name: '새이름', password: '' });
    expect(result.success).toBe(true);
  });

  it('비밀번호만 변경 시 유효하다', () => {
    const result = profileSchema.safeParse({ name: '', password: 'newpass123' });
    expect(result.success).toBe(true);
  });

  it('이름과 비밀번호 모두 변경 시 유효하다', () => {
    const result = profileSchema.safeParse({ name: '새이름', password: 'newpass123' });
    expect(result.success).toBe(true);
  });

  it('비밀번호가 6자 미만이면 실패한다', () => {
    const result = profileSchema.safeParse({ name: '', password: '12345' });
    expect(result.success).toBe(false);
  });

  it('이름이 50자를 초과하면 실패한다', () => {
    const result = profileSchema.safeParse({ name: 'a'.repeat(51), password: '' });
    expect(result.success).toBe(false);
  });

  it('이름과 비밀번호 모두 비어있으면 유효하다', () => {
    const result = profileSchema.safeParse({ name: '', password: '' });
    expect(result.success).toBe(true);
  });

  it('비밀번호가 100자를 초과하면 실패한다', () => {
    const result = profileSchema.safeParse({ name: '', password: 'a'.repeat(101) });
    expect(result.success).toBe(false);
  });
});
