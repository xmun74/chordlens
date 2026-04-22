---
name: fe-development
description: "ChordLens FE 개발 가이드. 컴포넌트 생성, 기능 구현, API 연동, FSD 규칙 적용, TypeScript 타입 안전성 확보 작업 시 반드시 사용. Next.js 16 App Router, FSD v2.1, TanStack Query, Tailwind CSS v4 규칙 포함."
---

# ChordLens FE Development

ChordLens 프론트엔드 개발 규칙과 패턴.

## 기술 스택

- Next.js 16.2.2 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- TanStack Query v5
- vexchords (코드 다이어그램)
- Feature-Sliced Design v2.1

## 컴포넌트 작성 규칙

```tsx
// named export 사용 (page.tsx, layout.tsx 제외)
// Props는 interface로 별도 선언

interface ChordCardProps {
  chord: Chord;
  onClick?: (chord: Chord) => void;
}

export function ChordCard({ chord, onClick }: ChordCardProps) {
  // ...
}
```

**금지:**

- `any` 타입 — `unknown` 또는 명시적 타입으로 대체
- `export default` (page.tsx, layout.tsx 제외)
- `useEffect`로 데이터 페칭 — Server Component 또는 TanStack Query 사용
- `console.log` 커밋
- 불필요한 `'use client'` — 인터랙션/훅이 필요한 경우에만

## FSD 파일 위치

| 레이어   | 경로                   | 내용                                 |
| -------- | ---------------------- | ------------------------------------ |
| app      | `src/app/`             | Next.js 페이지, 레이아웃, API 라우트 |
| views    | `src/views/{name}/`    | 페이지 조합 컴포넌트                 |
| features | `src/features/{name}/` | 사용자 시나리오 단위 기능            |
| entities | `src/entities/{name}/` | 비즈니스 엔티티 (chord, video)       |
| shared   | `src/shared/`          | 공통 유틸, UI, API                   |

FSD 규칙 검증: `pnpm fsd` (steiger ./src)

## API 연동

```typescript
// src/shared/api/railwayClient.ts 공통 유틸 사용
// fetch 직접 사용 금지

// 요청/응답 타입 반드시 interface로 선언
interface ExtractRequest {
  url: string;
}

interface ExtractResponse {
  chords: ChordData[];
  // ...
}

// 에러 처리: 400 / 500 / 504 케이스 모두 핸들링
```

## 데이터 페칭 패턴

- **Server Component**: 정적 데이터, SEO 필요 시 (기본값)
- **TanStack Query useMutation**: 사용자 액션으로 트리거되는 데이터 변경
- **TanStack Query useQuery**: 대화형 동적 데이터

## 현재 엔티티

| 엔티티 | 경로                  | 내용                                                                     |
| ------ | --------------------- | ------------------------------------------------------------------------ |
| chord  | `src/entities/chord/` | ChordDiagram, ChordGrid, ChordTimeline, LyricsSection, LyricsChordPlayer |
| video  | `src/entities/video/` | VideoCard                                                                |

## 현재 기능

| 기능          | 경로                          | 내용                                                          |
| ------------- | ----------------------------- | ------------------------------------------------------------- |
| extract-chord | `src/features/extract-chord/` | UrlInputForm, LoadingState, useExtractChord, extractChord API |
| share-result  | `src/features/share-result/`  | ShareButton                                                   |

## 작업 완료 전 체크

- [ ] `pnpm tsc --noEmit` 통과
- [ ] `pnpm fsd` 통과
- [ ] `any` 타입 없음
- [ ] `console.log` 없음
- [ ] API 에러 처리 (400/500/504) 구현
- [ ] Props 인터페이스 선언
- [ ] named export 사용
