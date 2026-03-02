# Learniverse Client

온라인 교육 플랫폼의 프론트엔드 클라이언트입니다.

## 기술 스택

| 항목 | 기술 |
|------|------|
| Framework | Next.js 16 + React 19 + TypeScript 5 |
| UI | shadcn/ui (new-york) + Tailwind CSS 4 |
| 서버 상태 | TanStack React Query |
| 클라이언트 상태 | Zustand |
| 폼 | react-hook-form + Zod |
| 단위 테스트 | Vitest + Testing Library |
| E2E 테스트 | Playwright |
| 패키지 매니저 | bun |

## 시작하기

### 사전 요구사항

- [Bun](https://bun.sh/) >= 1.0
- [Node.js](https://nodejs.org/) >= 18
- Learniverse 백엔드 서버 (NestJS)

### 설치

```bash
bun install
```

### 환경 변수

`.env.example`을 `.env.local`로 복사한 뒤 값을 설정합니다.

```bash
cp .env.example .env.local
```

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `NEXT_PUBLIC_API_URL` | 백엔드 API 기본 URL | `http://localhost:3000/api/v1` |

프로덕션(Vercel)에서는 아래 값을 권장합니다.

```bash
NEXT_PUBLIC_API_URL=https://api.<your-domain>/api/v1
```

### 실행

```bash
# 개발 서버
bun run dev

# 프로덕션 빌드
bun run build
bun run start
```

## 명령어

| 명령어 | 설명 |
|--------|------|
| `bun run dev` | 개발 서버 실행 |
| `bun run build` | 프로덕션 빌드 |
| `bun run start` | 프로덕션 서버 실행 |
| `bun run lint` | ESLint 검사 |
| `bun run test` | 단위 테스트 실행 |
| `bun run test:watch` | 단위 테스트 워치 모드 |
| `bun run test:coverage` | 테스트 커버리지 리포트 |
| `bun run e2e` | Playwright E2E 테스트 |
| `bun run e2e:ui` | Playwright UI 모드 |

## 프로젝트 구조

```
app/
├── (auth)/              # 인증 (로그인, 회원가입)
├── (main)/              # 메인 레이아웃 (헤더 + 푸터)
│   ├── courses/         # 강의 카탈로그 & 상세
│   ├── dashboard/       # 학생/튜터 대시보드
│   ├── admin/           # 관리자 페이지
│   └── profile/         # 프로필
├── layout.tsx           # Root Layout (Providers)
└── globals.css

components/
├── ui/                  # shadcn/ui 컴포넌트
├── layout/              # Header, Footer, Sidebar
├── auth/                # 로그인/회원가입 폼, RoleGuard
├── courses/             # 강의 카드, 그리드, 필터, 폼
├── lectures/            # 레슨 목록, 폼
├── enrollments/         # 수강 버튼, 진도 바
├── assignments/         # 과제 카드, 폼
├── submissions/         # 제출 폼, 피드백 폼
└── shared/              # 공통 컴포넌트

lib/
├── api/                 # API 클라이언트 & 도메인별 함수
├── hooks/               # TanStack Query 커스텀 훅
├── store/               # Zustand 스토어 (인증)
├── types/               # TypeScript 타입 정의
├── utils/               # cn(), 날짜/숫자 포맷터
└── providers/           # QueryProvider, ThemeProvider
```

## 백엔드 연동

Learniverse 백엔드(NestJS)와 연동하여 동작합니다.

- API 기본 경로: `/api/v1`
- 인증: JWT (access token 15분 + refresh token 7일)
- 역할: 학생(student), 튜터(tutor), 관리자(admin)

### 프로덕션 연동 체크리스트

1. Vercel 환경변수 `NEXT_PUBLIC_API_URL`이 `https://api.<your-domain>/api/v1`인지 확인
2. 백엔드 `APP_CORS_ORIGINS`에 Vercel 도메인이 포함되어 있는지 확인
3. 브라우저 개발자도구에서 Mixed Content/CORS 오류가 없는지 확인
