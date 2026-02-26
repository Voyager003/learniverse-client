import { describe, it, expect } from 'vitest';
import { assignmentSchema } from '@/lib/utils/validators';

describe('assignmentSchema', () => {
  const valid = {
    title: '과제 1',
    description: '첫 번째 과제입니다',
  };

  it('validates correct assignment', () => {
    const result = assignmentSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('accepts optional dueDate', () => {
    const result = assignmentSchema.safeParse({ ...valid, dueDate: '2026-03-01' });
    expect(result.success).toBe(true);
  });

  it('accepts empty dueDate', () => {
    const result = assignmentSchema.safeParse({ ...valid, dueDate: '' });
    expect(result.success).toBe(true);
  });

  it('rejects empty title', () => {
    const result = assignmentSchema.safeParse({ ...valid, title: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('과제 제목을 입력해주세요');
    }
  });

  it('rejects empty description', () => {
    const result = assignmentSchema.safeParse({ ...valid, description: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('과제 설명을 입력해주세요');
    }
  });
});
