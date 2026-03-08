import { ApiClientError } from '@/lib/api/client';

export type ErrorActionContext =
  | 'auth.login'
  | 'auth.adminLogin'
  | 'auth.register'
  | 'admin.users.query'
  | 'admin.user.status'
  | 'admin.user.role'
  | 'admin.user.sessions'
  | 'enrollment.create'
  | 'profile.update'
  | 'assignment.submit'
  | 'assignment.create'
  | 'submission.feedback.save'
  | 'course.create'
  | 'course.update'
  | 'course.delete'
  | 'course.publish'
  | 'lecture.create'
  | 'lecture.update'
  | 'lecture.delete'
  | 'progress.update'
  | 'query.generic';

type ParsedError = {
  statusCode?: number;
  message: string;
};

function parseError(error: unknown): ParsedError {
  if (error instanceof ApiClientError) {
    return { statusCode: error.statusCode, message: error.message };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: '' };
}

function includesMessage(message: string, expected: string): boolean {
  return message.toLowerCase().includes(expected.toLowerCase());
}

const fallbackMessages: Record<ErrorActionContext, string> = {
  'auth.login': '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
  'auth.adminLogin': '관리자 로그인에 실패했습니다. 계정 정보를 확인해주세요.',
  'auth.register': '회원가입에 실패했습니다. 다시 시도해주세요.',
  'admin.users.query': '사용자 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
  'admin.user.status': '사용자 상태 변경에 실패했습니다. 잠시 후 다시 시도해주세요.',
  'admin.user.role': '사용자 역할 변경에 실패했습니다. 잠시 후 다시 시도해주세요.',
  'admin.user.sessions': '사용자 세션 해제에 실패했습니다. 잠시 후 다시 시도해주세요.',
  'enrollment.create': '수강 신청에 실패했습니다. 잠시 후 다시 시도해주세요.',
  'profile.update': '프로필 수정에 실패했습니다. 잠시 후 다시 시도해주세요.',
  'assignment.submit': '과제 제출에 실패했습니다. 잠시 후 다시 시도해주세요.',
  'assignment.create': '과제 출제에 실패했습니다. 잠시 후 다시 시도해주세요.',
  'submission.feedback.save': '피드백 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
  'course.create': '강의 생성에 실패했습니다. 잠시 후 다시 시도해주세요.',
  'course.update': '강의 수정에 실패했습니다. 잠시 후 다시 시도해주세요.',
  'course.delete': '강의 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.',
  'course.publish': '상태 변경에 실패했습니다. 잠시 후 다시 시도해주세요.',
  'lecture.create': '레슨 추가에 실패했습니다. 잠시 후 다시 시도해주세요.',
  'lecture.update': '레슨 수정에 실패했습니다. 잠시 후 다시 시도해주세요.',
  'lecture.delete': '레슨 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.',
  'progress.update': '진도 업데이트에 실패했습니다. 잠시 후 다시 시도해주세요.',
  'query.generic': '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.',
};

export function getUserFacingErrorMessage(
  error: unknown,
  context: ErrorActionContext,
): string {
  const { statusCode, message } = parseError(error);

  if (context === 'profile.update' && message === '변경 사항이 없습니다') {
    return message;
  }

  switch (context) {
    case 'auth.login':
      if (statusCode === 401) {
        return '이메일 또는 비밀번호가 올바르지 않습니다.';
      }
      break;
    case 'auth.adminLogin':
      if (statusCode === 401) {
        return '관리자 계정 정보가 올바르지 않거나 비활성화된 계정입니다.';
      }
      if (statusCode === 403) {
        return '관리자 계정만 로그인할 수 있습니다.';
      }
      break;
    case 'auth.register':
      if (statusCode === 409) {
        return '이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.';
      }
      if (statusCode === 400) {
        return '회원가입 요청이 올바르지 않습니다. 입력값을 확인해주세요.';
      }
      break;
    case 'admin.users.query':
      if (statusCode === 403) {
        return '관리자 권한이 필요한 페이지입니다.';
      }
      break;
    case 'admin.user.status':
      if (statusCode === 404) {
        return '사용자를 찾을 수 없습니다.';
      }
      if (statusCode === 400 && includesMessage(message, 'cannot deactivate your own account')) {
        return '본인 계정은 비활성화할 수 없습니다.';
      }
      if (statusCode === 400 && includesMessage(message, 'at least one active admin must remain')) {
        return '활성 관리자 계정은 최소 1명 이상 유지되어야 합니다.';
      }
      break;
    case 'admin.user.role':
      if (statusCode === 404) {
        return '사용자를 찾을 수 없습니다.';
      }
      if (statusCode === 400 && includesMessage(message, 'cannot change your own role')) {
        return '본인 역할은 변경할 수 없습니다.';
      }
      if (statusCode === 400 && includesMessage(message, 'at least one active admin must remain')) {
        return '활성 관리자 계정은 최소 1명 이상 유지되어야 합니다.';
      }
      break;
    case 'admin.user.sessions':
      if (statusCode === 404) {
        return '사용자를 찾을 수 없습니다.';
      }
      break;
    case 'enrollment.create':
      if (statusCode === 409) {
        return '이미 수강 중인 강의입니다.';
      }
      if (statusCode === 403 && includesMessage(message, 'insufficient permissions')) {
        return '튜터는 수강 신청이 불가능합니다.';
      }
      if (statusCode === 404) {
        return '존재하지 않는 강의입니다.';
      }
      break;
    case 'assignment.submit':
      if (statusCode === 400 && includesMessage(message, 'assignment is not published')) {
        return '아직 공개되지 않은 과제입니다.';
      }
      if (statusCode === 403) {
        return '학생만 과제를 제출할 수 있습니다.';
      }
      if (statusCode === 404) {
        return '과제를 찾을 수 없습니다.';
      }
      break;
    case 'assignment.create':
      if (statusCode === 403) {
        return '튜터만 과제를 출제할 수 있습니다.';
      }
      if (statusCode === 404) {
        return '강의를 찾을 수 없습니다.';
      }
      break;
    case 'submission.feedback.save':
      if (statusCode === 403) {
        return '이 강의의 튜터만 피드백을 저장할 수 있습니다.';
      }
      if (statusCode === 404) {
        return '제출물을 찾을 수 없습니다.';
      }
      break;
    case 'profile.update':
      if (statusCode === 400) {
        return '입력값을 다시 확인해주세요.';
      }
      break;
    case 'course.create':
    case 'course.update':
    case 'course.delete':
    case 'course.publish':
    case 'lecture.create':
    case 'lecture.update':
    case 'lecture.delete':
    case 'progress.update':
      if (statusCode === 403) {
        return '해당 작업을 수행할 권한이 없습니다.';
      }
      if (statusCode === 404) {
        return '대상을 찾을 수 없습니다.';
      }
      break;
    case 'query.generic':
      break;
    default:
      break;
  }

  return fallbackMessages[context];
}
