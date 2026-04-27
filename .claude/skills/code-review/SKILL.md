---
name: code-review
description: "ChordLens 코드 품질 검토 가이드. TypeScript 타입 안전성, FSD 아키텍처 준수, API 에러 처리, 코드 컨벤션 검증 작업 시 사용. BE-FE 경계면 교차 비교 포함."
---

# ChordLens Code Review

## 검증 명령

```bash
pnpm tsc --noEmit  # TypeScript 타입 체크
pnpm fsd           # FSD 아키텍처 검증 (steiger ./src)
pnpm lint          # ESLint
```

## 검증 항목

### TypeScript

- [ ] `any` 타입 없음 — `unknown` 또는 명시적 타입 사용
- [ ] Props 인터페이스 선언 (inline 타입 금지)
- [ ] API 요청/응답 타입 `interface`로 선언
- [ ] `pnpm tsc --noEmit` 통과

### FSD 아키텍처

- [ ] `pnpm fsd` 통과
- [ ] 레이어 방향 준수 — 하위 레이어가 상위 레이어 import 금지
  - shared → 아무것도 import 안 함
  - entities → shared만 import
  - features → entities, shared
  - views → features, entities, shared
  - app → 모두
- [ ] 파일이 올바른 레이어/슬라이스/세그먼트에 위치

### API 연동

- [ ] BE 직접 호출 없음 — Next.js API proxy(`/api/*`) 경유
- [ ] 에러 처리: 400 / 500 / 504 케이스 모두 핸들링
- [ ] BE 응답 shape와 FE 타입 정의 일치

### 컨벤션

- [ ] `console.log` 없음
- [ ] `useEffect`로 데이터 페칭 없음
- [ ] `'use client'`가 불필요한 곳에 없음
- [ ] `named export` 사용 (page.tsx, layout.tsx 제외)

## BE-FE 경계면 교차 비교

FE 타입과 BE Pydantic 모델을 동시에 읽고 비교한다:

1. BE `app/models/` 에서 응답 스키마 확인
2. FE `src/features/{name}/model/types.ts` 에서 타입 확인
3. 필드명, 타입, 필수/옵셔널 일치 여부 검증
4. camelCase(FE) ↔ snake_case(BE) 변환 처리 여부 확인

## 심각도 분류

| 심각도  | 기준                            | 예시                            |
| ------- | ------------------------------- | ------------------------------- |
| 🔴 차단 | 타입 에러, FSD 위반, `any` 사용 | `pnpm tsc` 실패, 레이어 위반    |
| 🟡 경고 | 컨벤션 위반                     | `console.log`, `default export` |
| 🟢 제안 | 개선 가능한 코드                | 추상화 기회, 중복 제거          |

🔴 항목은 수정 후 재검토 필수. 🟡 이하는 보고 후 진행 가능.
