export enum Role {
  STUDENT = 'student',
  TUTOR = 'tutor',
  ADMIN = 'admin',
}

export enum CourseCategory {
  PROGRAMMING = 'programming',
  DATA_SCIENCE = 'data_science',
  DESIGN = 'design',
  BUSINESS = 'business',
  MARKETING = 'marketing',
  LANGUAGE = 'language',
}

export enum CourseDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum EnrollmentStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
}

export enum SubmissionStatus {
  SUBMITTED = 'submitted',
  REVIEWED = 'reviewed',
  RETURNED = 'returned',
}

export const CATEGORY_LABELS: Record<CourseCategory, string> = {
  [CourseCategory.PROGRAMMING]: '프로그래밍',
  [CourseCategory.DATA_SCIENCE]: '데이터 사이언스',
  [CourseCategory.DESIGN]: '디자인',
  [CourseCategory.BUSINESS]: '비즈니스',
  [CourseCategory.MARKETING]: '마케팅',
  [CourseCategory.LANGUAGE]: '어학',
};

export const DIFFICULTY_LABELS: Record<CourseDifficulty, string> = {
  [CourseDifficulty.BEGINNER]: '입문',
  [CourseDifficulty.INTERMEDIATE]: '중급',
  [CourseDifficulty.ADVANCED]: '고급',
};

export const ROLE_LABELS: Record<Role, string> = {
  [Role.STUDENT]: '학생',
  [Role.TUTOR]: '튜터',
  [Role.ADMIN]: '관리자',
};

export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  [EnrollmentStatus.ACTIVE]: '수강 중',
  [EnrollmentStatus.COMPLETED]: '완료',
  [EnrollmentStatus.DROPPED]: '중도 포기',
};

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  [SubmissionStatus.SUBMITTED]: '제출됨',
  [SubmissionStatus.REVIEWED]: '평가 완료',
  [SubmissionStatus.RETURNED]: '반려됨',
};
