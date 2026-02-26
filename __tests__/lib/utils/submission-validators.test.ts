import { describe, it, expect } from 'vitest';
import { submissionSchema, feedbackSchema } from '@/lib/utils/validators';

describe('submissionSchema', () => {
  it('validates correct submission', () => {
    const result = submissionSchema.safeParse({ content: '과제 답안입니다' });
    expect(result.success).toBe(true);
  });

  it('rejects empty content', () => {
    const result = submissionSchema.safeParse({ content: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('제출 내용을 입력해주세요');
    }
  });

  it('rejects content longer than 5000 characters', () => {
    const result = submissionSchema.safeParse({ content: 'a'.repeat(5001) });
    expect(result.success).toBe(false);
  });
});

describe('feedbackSchema', () => {
  it('validates correct feedback', () => {
    const result = feedbackSchema.safeParse({ feedback: '잘했습니다', score: 90 });
    expect(result.success).toBe(true);
  });

  it('rejects empty feedback', () => {
    const result = feedbackSchema.safeParse({ feedback: '', score: 90 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('피드백을 입력해주세요');
    }
  });

  it('rejects score below 0', () => {
    const result = feedbackSchema.safeParse({ feedback: '피드백', score: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects score above 100', () => {
    const result = feedbackSchema.safeParse({ feedback: '피드백', score: 101 });
    expect(result.success).toBe(false);
  });

  it('accepts feedback without score', () => {
    const result = feedbackSchema.safeParse({ feedback: '피드백' });
    expect(result.success).toBe(true);
  });
});
