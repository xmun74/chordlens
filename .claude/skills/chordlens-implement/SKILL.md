---
name: chordlens-implement
description: "ChordLens 구현 단계. _workspace/02_plan.md 계획서를 기반으로 타입 우선 개발 후 code-critic 독립 비평까지. fe-developer/be-developer + code-critic 팀. 독립 실행 가능: chordlens-orchestrator가 Phase 3으로 호출하거나 구현만 단독으로 요청 시 직접 사용."
---

# ChordLens Implement

계획서를 기반으로 구현하고 코드 비평으로 검증하는 단계.

## 전제 조건

`_workspace/02_plan.md` 존재 필수. 없으면 chordlens-plan 스킬을 먼저 실행한다.

## 실행 모드: 에이전트 팀

## 개발 사이클: 타입 우선

```
1. TYPE   — 계획서 인터페이스를 types.ts에 먼저 선언 (구현 없음)
     ↓
2. IMPL   — 타입을 만족하는 구현 (pnpm tsc 통과)
     ↓
3. VERIFY — pnpm fsd 통과, 컨벤션 체크
     ↓
4. code-critic 검토
```

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
               + _workspace/02_plan.md 읽기 + 타입 우선 사이클로 구현 시작"
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
{
  name: "be-developer",
  model: "opus",
  prompt: "[.claude/agents/be-developer.md] + [.claude/skills/be-development/SKILL.md]
           + 계획서 기반 구현"
}
```

## TaskCreate

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

## 워크플로우

### Phase 1: 환경 확인

1. `_workspace/02_plan.md` Read
2. `_workspace/02_plan_critique.md` 읽어 미해결 🔴 항목 없는지 확인
3. 작업 유형 결정 (FE/BE/연동) → 팀 구성

### Phase 2: 구현

위 TaskCreate 실행.

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
2. 구현 완료 보고 (변경 파일 목록)

## 산출물

| 파일                             | 내용                           |
| -------------------------------- | ------------------------------ |
| `_workspace/04_code_critique.md` | 비평 결과, 실행 결과           |
| 실제 소스 파일                   | 계획서 기준 생성/수정된 파일들 |
