# CodeLens

YouTube 영상에서 기타 코드를 자동 분석해주는 웹 앱입니다.
링크를 붙여넣으면 코드 진행, 타임라인, 다이어그램을 즉시 확인할 수 있습니다.

---

## Quick Start

### 요구 사항

- Node.js 20+
- pnpm 10+

### 설치 및 실행

```bash
pnpm install
cp .env.example .env # .env.example을 복사해서 설정
pnpm dev
```

---

## Tech Stack

| 분야                   | 패키지                                                    | 버전   |
| ---------------------- | --------------------------------------------------------- | ------ |
| 라이브러리, 프레임워크 | [Next.js](https://nextjs.org)                             | 16.2.2 |
|                        | [React](https://react.dev)                                | 19.2.4 |
|                        | [TypeScript](https://www.typescriptlang.org)              | 5      |
| Styling                | [Tailwind CSS](https://tailwindcss.com)                   | 4      |
| State & Data           | [TanStack Query](https://tanstack.com/query)              | 5.96.2 |
|                        | [next-themes](https://github.com/pacocoursey/next-themes) | 0.4.6  |
| UI                     | [vexchords](https://github.com/0xfe/vexchords)            | 1.2.0  |
| DX                     | [ESLint](https://eslint.org)                              | 9      |
|                        | [Prettier](https://prettier.io)                           | 3.8.1  |
|                        | [Husky](https://typicode.github.io/husky)                 | 9.1.7  |
|                        | [lint-staged](https://github.com/lint-staged/lint-staged) | 16.4.0 |
|                        | [Commitlint](https://commitlint.js.org)                   | 20.5.0 |
|                        | [Steiger](https://github.com/feature-sliced/steiger)      | 0.5.11 |

---

## Architecture

Feature-Sliced Design (FSD) 기반 폴더 구조

```
src/
├── app/              # Next.js App Router (layout, page, api routes)
├── shared/           # 공통 유틸, API 클라이언트, UI 원자 컴포넌트
├── entities/         # 도메인 모델 (chord, video)
├── features/         # 사용자 시나리오 (extract-chord, share-result)
└── views/            # 페이지 단위 조합 컴포넌트
```

> Next.js의 `app/` 폴더와 FSD의 `pages/` 레이어가 충돌하지 않도록 pages 레이어를 `views/`로 명명합니다.
> fsd 폴더 구조에서 `widgets/` 폴더 미사용(skills 폴더에 반영)

---

## Environment Variables

| 변수          | 설명                            | 기본값              |
| ------------- | ------------------------------- | ------------------- |
| `RAILWAY_URL` | 백엔드 API 서버 URL (서버 전용) | 미설정 시 Mock 사용 |

> `RAILWAY_URL`이 없으면 `/api/extract` Route Handler가 Mock 데이터를 반환합니다.
> `NEXT_PUBLIC_` 접두사 없이 서버 사이드에서만 참조되므로 클라이언트에 노출되지 않습니다.

---

## 명령어

```bash
pnpm dev            # 개발 서버 실행 (Turbopack)
pnpm build          # 프로덕션 빌드
pnpm start          # 프로덕션 서버 실행

pnpm lint           # ESLint 검사
pnpm lint:fix       # ESLint 자동 수정
pnpm format         # Prettier 전체 포맷
pnpm format:check   # Prettier 포맷 검사

pnpm fsd            # Steiger FSD 아키텍처 검사
```

---

## Features

- **YouTube URL 분석** — 링크 붙여넣기 → 코드 자동 추출
- **Analysis Pipeline** — 3단계 로딩 상태 (Extracting → Recognizing → Done)
- **코드 타임라인** — 타임스탬프별 코드 진행 가로 스크롤 시각화
- **코드 다이어그램** — vexchords 기반 기타 운지법 SVG 렌더링
- **결과 공유** — 분석 결과 URL 클립보드 복사
- **Mock 모드** — 백엔드 없이 로컬에서 즉시 테스트 가능

---

© 2026 CodeLens.
