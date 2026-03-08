# Learniverse Client

온라인 교육 플랫폼 Learniverse의 클라이언트입니다.

## 기술 스택

- **Framework**: Next.js 16 + React 19 + TypeScript 5
- **UI**: shadcn/ui (new-york) + Tailwind CSS 4
- **서버 상태**: TanStack React Query
- **클라이언트 상태**: Zustand (auth)
- **폼**: react-hook-form + Zod
- **테스트**: Vitest (순수 로직 단위 테스트), Playwright (E2E 사용자 흐름)
- **패키지 매니저**: bun

## 명령어

```bash
bun run dev          # 개발 서버
bun run build        # 프로덕션 빌드
bun run lint         # ESLint
bun run test         # Vitest 단위 테스트
bun run test:watch   # Vitest 워치 모드
bun run e2e          # Playwright E2E 전체
bun run e2e:admin    # Playwright 관리자 핵심 흐름 E2E
```

## 백엔드 API

- **Base URL**: `NEXT_PUBLIC_API_URL` (.env.local)
- **성공 응답**: `{ data: T, statusCode: number }`
- **에러 응답**: `{ statusCode, message, error, timestamp }`
- **페이지네이션**: `{ data: { data: T[], total, page, limit, totalPages }, statusCode }`
- **인증**: JWT Bearer 토큰 (access 15m + refresh 7d)

## 주요 기능

### 학생/튜터 사용자 흐름
- 로그인/회원가입
- 강의 탐색 및 상세 조회
- 수강 신청과 진도 관리
- 튜터 강의/레슨/과제/제출물 관리

### 관리자 콘솔
- 관리자 전용 로그인 진입점 분리
- 사용자 활성/비활성, 역할 변경, 세션 강제 해제
- 강좌/과제/제출물 hide/unhide moderation
- 수강 운영 조회와 멱등성 키 조회
- 관리자 조치 이력 감사 로그 조회

## Development Workflow

### Phase 진행 프로세스

각 Phase는 세부 단계(Phase N-1, N-2, ...)로 나뉘며, 다음 절차를 따른다:

1. **계획**: Phase 시작 시 세부 단계별 작업 목록을 제시한다
2. **단계별 실행**: 각 세부 단계마다:
   - 코드를 작성한다
   - **사용자와 문답을 통해 함께 검증한다** (테스트 결과, 린트, 코드 리뷰)
   - 검증 통과 후 커밋한다
3. **대기**: 세부 단계가 끝나면 **반드시 사용자의 다음 진행 명령을 기다린다**
4. **절대 하지 않는다**: 사용자 명령 없이 다음 세부 단계로 자동 진행

### 테스트 전략

| 레이어 | 도구 | 대상 |
|--------|------|------|
| 순수 로직 | Vitest | API 클라이언트, 스토어, 유틸리티, Zod 스키마 |
| 사용자 흐름 | Playwright | 로그인, 수강 신청, 강의 관리, 관리자 백오피스 핵심 흐름 |

- **컴포넌트 렌더링 테스트(Testing Library)는 작성하지 않는다** — E2E에서 커버
- Vitest는 UI가 아닌 **로직**(API 통신, 상태 관리, 유효성 검증)에 집중

### 검증 절차

커밋 전 반드시 아래를 순서대로 확인한다:

1. `bun run test` — 단위 테스트 통과
2. `bun run lint` — ESLint 통과
3. `bun run build` — 빌드 성공

## 디렉토리 구조

```text
app/(auth)/      — 인증 (로그인, 회원가입)
app/(main)/      — 메인 (헤더+푸터 레이아웃)
components/ui/   — shadcn/ui 컴포넌트
components/*/    — 도메인별 컴포넌트
lib/api/         — API 클라이언트 & 도메인 함수
lib/hooks/       — TanStack Query 커스텀 훅
lib/store/       — Zustand 스토어
lib/types/       — TypeScript 타입 정의
lib/utils/       — 유틸리티 함수
lib/providers/   — React Provider
e2e/             — Playwright 사용자 흐름 테스트
```

## 테스트

```bash
# Unit test
bun run test

# Coverage
bun run test:coverage

# E2E 환경 기동
bun run e2e:setup

# E2E 전체
bun run e2e

# Admin 핵심 흐름만
bun run e2e:admin

# E2E 환경 정리
bun run e2e:teardown
```

### E2E 실행 순서

`bun run e2e`와 `bun run e2e:admin`은 backend API가 먼저 올라와 있어야 합니다.
이 저장소에서는 아래 순서로 실행하는 것을 기본으로 합니다.

```bash
bun run e2e:setup
bun run e2e          # 또는 bun run e2e:admin
bun run e2e:teardown
```
