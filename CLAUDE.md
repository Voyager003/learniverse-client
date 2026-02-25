# Learniverse Client

온라인 교육 플랫폼 Learniverse의 프론트엔드 클라이언트입니다.

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
bun run e2e          # Playwright E2E
```

## 백엔드 API

- **Base URL**: `NEXT_PUBLIC_API_URL` (.env.local)
- **성공 응답**: `{ data: T, statusCode: number }`
- **에러 응답**: `{ statusCode, message, error, timestamp }`
- **페이지네이션**: `{ data: { data: T[], total, page, limit, totalPages }, statusCode }`
- **인증**: JWT Bearer 토큰 (access 15m + refresh 7d)

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

```
Phase N-1 코드 작성 → 사용자와 검증 → 커밋 → [STOP] 사용자 명령 대기
                                                    ↓ "다음 진행해줘"
Phase N-2 코드 작성 → 사용자와 검증 → 커밋 → [STOP] 사용자 명령 대기
```

### TDD (Test-Driven Development)

**순수 로직에 대해 테스트를 먼저 작성한다.**

1. RED: 실패하는 테스트를 먼저 작성
2. GREEN: 테스트를 통과하는 최소한의 코드 작성
3. REFACTOR: 코드 정리 (테스트 통과 유지)

### 테스트 전략

| 레이어 | 도구 | 대상 |
|--------|------|------|
| 순수 로직 | Vitest | API 클라이언트, 스토어, 유틸리티, Zod 스키마 |
| 사용자 흐름 | Playwright | 로그인, 수강 신청, 강의 관리 등 실제 시나리오 |

- **컴포넌트 렌더링 테스트(Testing Library)는 작성하지 않는다** — E2E에서 커버
- Vitest는 UI가 아닌 **로직**(API 통신, 상태 관리, 유효성 검증)에 집중

### 검증 절차

커밋 전 반드시 아래를 순서대로 확인한다:

1. `bun run test` — 단위 테스트 통과
2. `bun run lint` — ESLint 통과
3. `bun run build` — 빌드 성공

## Commit Convention

### Commit 단위

- 코드 추가 시: 추가한 코드 + 해당 테스트 코드 = 하나의 커밋
- 코드 수정 시: 수정한 코드 + 영향받은 테스트 수정 = 하나의 커밋
- **테스트가 성공해야만 커밋한다** (`bun run test` 통과 필수)

### Commit Message

- **한글로 작성**
- 형식: `<타입>: <설명>`
- 타입: feat, fix, refactor, test, chore, docs
- 예시:
  - `feat: 로그인 폼 컴포넌트 및 단위 테스트 추가`
  - `fix: JWT 토큰 자동 갱신 로직 수정`
  - `refactor: API 클라이언트 에러 처리 개선`

## Coding Standards

### Language

- Code comments: English
- Commit messages: Korean
- Variable/function names: English (camelCase)
- Component names: English (PascalCase)

### TypeScript Type Safety

`any` 타입은 **절대 사용하지 않는다** (ESLint `no-explicit-any: error`).

| 상황 | `any` 대신 사용할 타입 |
|---|---|
| 타입을 모를 때 | `unknown` (사용 전 타입 가드 필수) |
| 여러 타입 가능 | union 타입 (`string \| number`) |
| 객체 구조 유동적 | `Record<string, unknown>` |
| 외부 라이브러리 반환 | 인터페이스 직접 정의 |
| 테스트 mock 객체 | 인터페이스 정의 + `as unknown as TargetType` |

### Component Convention

- Server Component (기본) / Client Component ('use client' 명시)
- 공개 페이지(카탈로그, 상세) → Server Component (SEO)
- 대시보드, 폼 → Client Component (인터랙티브)
- 타입은 `lib/types/`에 중앙 관리
- API 함수는 `lib/api/`에 도메인별 분리
- TanStack Query 훅은 `lib/hooks/`에 위치

## 디렉토리 구조

```
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
```
