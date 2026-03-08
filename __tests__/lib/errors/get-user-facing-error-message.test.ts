import { describe, expect, it } from 'vitest';
import { ApiClientError } from '@/lib/api/client';
import { getUserFacingErrorMessage } from '@/lib/errors/get-user-facing-error-message';

describe('getUserFacingErrorMessage', () => {
  it('수강 신청 권한 에러를 튜터 전용 메시지로 변환한다', () => {
    const error = new ApiClientError(403, 'Insufficient permissions');

    expect(getUserFacingErrorMessage(error, 'enrollment.create')).toBe(
      '튜터는 수강 신청이 불가능합니다.',
    );
  });

  it('중복 수강 신청을 사용자 친화 메시지로 변환한다', () => {
    const error = new ApiClientError(409, 'Already enrolled in this course');

    expect(getUserFacingErrorMessage(error, 'enrollment.create')).toBe(
      '이미 수강 중인 강의입니다.',
    );
  });

  it('비공개 과제 제출 에러를 의미 있는 메시지로 변환한다', () => {
    const error = new ApiClientError(400, 'Assignment is not published');

    expect(getUserFacingErrorMessage(error, 'assignment.submit')).toBe(
      '아직 공개되지 않은 과제입니다.',
    );
  });

  it('회원가입 중복 이메일을 사용자 친화 메시지로 변환한다', () => {
    const error = new ApiClientError(409, 'Conflict');

    expect(getUserFacingErrorMessage(error, 'auth.register')).toBe(
      '이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.',
    );
  });

  it('관리자 로그인 권한 에러를 관리자 전용 메시지로 변환한다', () => {
    const error = new ApiClientError(403, 'Only administrators can access this endpoint');

    expect(getUserFacingErrorMessage(error, 'auth.adminLogin')).toBe(
      '관리자 계정만 로그인할 수 있습니다.',
    );
  });

  it('알 수 없는 전역 에러는 generic fallback을 반환한다', () => {
    expect(getUserFacingErrorMessage(new Error('network error'), 'query.generic')).toBe(
      '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.',
    );
  });

  it('프로필 변경 없음 에러는 원문을 유지한다', () => {
    expect(getUserFacingErrorMessage(new Error('변경 사항이 없습니다'), 'profile.update')).toBe(
      '변경 사항이 없습니다',
    );
  });
});
