import { describe, it, expect } from 'vitest';
import { courseSchema, lectureSchema } from '@/lib/utils/validators';
import { CourseCategory, CourseDifficulty } from '@/lib/types';

describe('courseSchema', () => {
  const validCourse = {
    title: 'TypeScript 입문',
    description: '타입스크립트 기초를 배워봅시다',
    category: CourseCategory.PROGRAMMING,
    difficulty: CourseDifficulty.BEGINNER,
  };

  it('validates a correct course form', () => {
    const result = courseSchema.safeParse(validCourse);
    expect(result.success).toBe(true);
  });

  it('rejects empty title', () => {
    const result = courseSchema.safeParse({ ...validCourse, title: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('강의 제목을 입력해주세요');
    }
  });

  it('rejects title longer than 100 characters', () => {
    const result = courseSchema.safeParse({ ...validCourse, title: 'a'.repeat(101) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('제목은 100자 이하여야 합니다');
    }
  });

  it('rejects empty description', () => {
    const result = courseSchema.safeParse({ ...validCourse, description: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('강의 설명을 입력해주세요');
    }
  });

  it('rejects description longer than 2000 characters', () => {
    const result = courseSchema.safeParse({ ...validCourse, description: 'a'.repeat(2001) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('설명은 2000자 이하여야 합니다');
    }
  });

  it('rejects invalid category', () => {
    const result = courseSchema.safeParse({ ...validCourse, category: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid difficulty', () => {
    const result = courseSchema.safeParse({ ...validCourse, difficulty: 'invalid' });
    expect(result.success).toBe(false);
  });
});

describe('lectureSchema', () => {
  const validLecture = {
    title: '1강: 타입이란?',
    content: '타입의 개념과 필요성에 대해 알아봅니다.',
    order: 1,
  };

  it('validates a correct lecture form', () => {
    const result = lectureSchema.safeParse(validLecture);
    expect(result.success).toBe(true);
  });

  it('accepts optional videoUrl', () => {
    const result = lectureSchema.safeParse({ ...validLecture, videoUrl: 'https://example.com/video' });
    expect(result.success).toBe(true);
  });

  it('rejects empty title', () => {
    const result = lectureSchema.safeParse({ ...validLecture, title: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('레슨 제목을 입력해주세요');
    }
  });

  it('rejects empty content', () => {
    const result = lectureSchema.safeParse({ ...validLecture, content: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('레슨 내용을 입력해주세요');
    }
  });

  it('rejects order less than 1', () => {
    const result = lectureSchema.safeParse({ ...validLecture, order: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('순서는 1 이상이어야 합니다');
    }
  });

  it('rejects invalid videoUrl format', () => {
    const result = lectureSchema.safeParse({ ...validLecture, videoUrl: 'not-a-url' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('올바른 URL 형식이 아닙니다');
    }
  });
});
