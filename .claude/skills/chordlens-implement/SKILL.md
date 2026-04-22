---
name: chordlens-implement
description: "ChordLens 구현 단계. _workspace/02_plan.md 계획서를 기반으로 TDD(Vitest 설치 시) 또는 타입 우선 개발 후 code-critic 독립 비평까지. fe-developer/be-developer + code-critic 팀. 독립 실행 가능: /chordlens-implement로 직접 호출하거나 chordlens-orchestrator가 Phase 3으로 호출."
---

# ChordLens Implement

계획서를 기반으로 구현하고 코드 비평으로 검증하는 단계.

## 전제 조건

`_workspace/02_plan.md` 존재 필수. 없으면 chordlens-plan 스킬을 먼저 실행한다.

## 실행 모드: 에이전트 팀

## 개발 사이클 선택

스킬 시작 시 Vitest 설치 여부를 먼저 확인한다:

```bash
grep -q "vitest" package.json && echo "TDD" || echo "TYPE_FIRST"
```

| 환경        | 사이클                                      |
| ----------- | ------------------------------------------- |
| Vitest 있음 | **TDD 사이클** (RED → GREEN → REFACTOR)     |
| Vitest 없음 | **타입 우선 사이클** (TYPE → IMPL → VERIFY) |

---

## TDD 사이클 (Vitest 설치 시)

```
1. RED    — 실패하는 테스트 작성 (pnpm test 실패 확인)
     ↓
2. GREEN  — 테스트를 통과하는 최소 구현 (pnpm test 통과)
     ↓
3. REFACTOR — 품질 개선 (pnpm test 유지, pnpm tsc + fsd 통과)
     ↓
4. code-critic 검토
```

### 테스트 작성 기준

**컴포넌트 테스트** (`src/**/__tests__/*.test.tsx`):

```typescript
// Vitest + @testing-library/react 기준
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ChordCard } from '../ChordCard'

describe('ChordCard', () => {
  it('코드명을 렌더링한다', () => {
    render(<ChordCard chord={{ name: 'Am', frets: [] }} />)
    expect(screen.getByText('Am')).toBeInTheDocument()
  })
})
```

**훅 테스트** (`src/**/__tests__/*.test.ts`):

```typescript
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useExtractChord } from "../useExtractChord";

describe("useExtractChord", () => {
  it("초기 상태가 idle이다", () => {
    const { result } = renderHook(() => useExtractChord());
    expect(result.current.status).toBe("idle");
  });
});
```

**유틸 테스트** (`src/shared/**/__tests__/*.test.ts`):

```typescript
import { describe, it, expect } from "vitest";
import { parseYoutubeUrl } from "../youtube";

describe("parseYoutubeUrl", () => {
  it("유효한 URL에서 ID를 추출한다", () => {
    expect(parseYoutubeUrl("https://youtu.be/abc123")).toBe("abc123");
  });
});
```

### RED 단계 원칙

- 테스트는 계획서의 인터페이스/동작 명세를 기반으로 작성한다
- 구현이 없으므로 반드시 실패해야 한다 — `pnpm test`가 통과하면 테스트가 잘못된 것
- 한 번에 하나의 동작만 검증하는 작은 테스트로 시작한다
- 파일 경로: 테스트 대상 파일과 같은 위치의 `__tests__/` 폴더

### GREEN 단계 원칙

- 테스트를 통과하는 **최소한의** 코드만 작성한다 — 과도한 추상화 금지
- 타입 에러도 함께 해결한다 (`pnpm tsc --noEmit` 통과)
- 코드 품질은 REFACTOR 단계에서 개선한다

### REFACTOR 단계 원칙

- `pnpm test`가 계속 통과하는 상태에서만 리팩토링한다
- `pnpm fsd`로 FSD 위반 확인 및 수정
- `console.log`, `any` 타입, 중복 코드 제거

### TaskCreate (TDD 사이클):

```
TaskCreate(tasks: [
  { title: "RED: 테스트 작성", assignee: "fe-developer",
    description: "계획서 동작 명세 기반으로 실패하는 테스트 작성. pnpm test 실패 확인" },
  { title: "GREEN: 최소 구현", assignee: "fe-developer",
    description: "테스트 통과하는 최소 코드 작성. pnpm test + pnpm tsc 통과 확인",
    depends_on: ["RED: 테스트 작성"] },
  { title: "REFACTOR: 품질 개선", assignee: "fe-developer",
    description: "pnpm test 유지하며 리팩토링. pnpm fsd 통과 확인",
    depends_on: ["GREEN: 최소 구현"] },
  { title: "코드 비평", assignee: "code-critic",
    description: "_workspace/02_plan.md 대조 및 구현 전체 검토",
    depends_on: ["REFACTOR: 품질 개선"] }
])
```

---

## 타입 우선 사이클 (Vitest 없을 때)

`pnpm tsc --noEmit`이 타입 에러를 잡는 레드/그린 역할을 한다:

```
1. TYPE   — 계획서 인터페이스를 types.ts에 먼저 선언 (구현 없음)
     ↓
2. IMPL   — 타입을 만족하는 구현 (pnpm tsc 통과)
     ↓
3. VERIFY — pnpm fsd 통과, 컨벤션 체크
     ↓
4. code-critic 검토
```

### TaskCreate (타입 우선):

```
TaskCreate(tasks: [
  { title: "타입 정의", assignee: "fe-developer",
    description: "계획서 인터페이스를 types.ts에 먼저 선언. 구현 없음" },
  { title: "구현", assignee: "fe-developer",
    description: "타입 기반으로 구현. pnpm tsc --noEmit 통과 확인",
    depends_on: ["타입 정의"] },
  { title: "코드 비평", assignee: "code-critic",
    description: "_workspace/02_plan.md 대조 후 구현 검토",
    depends_on: ["구현"] }
])
```

---

## 팀 구성

**FE 전용:**

```
TeamCreate(
  team_name: "chordlens-impl-team",
  members: [
    {
      name: "fe-developer",
      model: "opus",
      prompt: "[.claude/agents/fe-developer.md] + [.claude/skills/fe-development/SKILL.md]
               + _workspace/02_plan.md 읽기
               + [TDD or 타입 우선] 사이클로 구현 시작"
    },
    {
      name: "code-critic",
      model: "opus",
      prompt: "[.claude/agents/code-critic.md] + 구현 완료 알림 대기"
    }
  ]
)
```

**BE 포함 시 be-developer 추가:**

```
{ name: "be-developer", model: "opus",
  prompt: "[.claude/agents/be-developer.md] + [.claude/skills/be-development/SKILL.md] + 계획서 기반 구현" }
```

## 워크플로우

### Phase 1: 환경 확인 및 계획 확인

1. `grep -q "vitest" package.json` 실행 → 개발 사이클 결정
2. `_workspace/02_plan.md` Read
3. `_workspace/02_plan_critique.md` 읽어 미해결 🔴 항목 없는지 확인
4. 팀 구성

### Phase 2: 구현 (TDD or 타입 우선)

위 사이클에 따른 TaskCreate 실행.

**통신 규칙:**

- fe-developer → code-critic: "구현 완료, 변경 파일 목록: [...]" SendMessage
- code-critic → 리더: "비평 완료, 판정: [통과/수정 필요]" SendMessage

### Phase 3: 비평 반영

1. `_workspace/04_code_critique.md` Read
2. 🔴 차단 항목 있는 경우:
   - fe-developer에게 수정 지시 (최대 2회)
   - 2회 이후 해결 안 되면 리더 직접 개입
3. 통과 시 다음 단계

### Phase 4: 정리

1. TeamDelete
2. 구현 완료 보고 (변경 파일 목록, 사용한 사이클 명시)

## 산출물

| 파일                             | 내용                             |
| -------------------------------- | -------------------------------- |
| `_workspace/04_code_critique.md` | 비평 결과, 실행 결과             |
| 실제 소스 파일                   | 계획서 기준 생성/수정된 파일들   |
| `src/**/__tests__/`              | TDD 사이클 시 생성된 테스트 파일 |

## Vitest 설치 방법 (참고)

현재 미설치 상태. 추가하려면:

```bash
pnpm add -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

`vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
});
```

`src/test/setup.ts`:

```typescript
import "@testing-library/jest-dom";
```

`package.json`에 추가:

```json
"scripts": {
  "test": "vitest",
  "test:run": "vitest run"
}
```
