---
name: chordlens-plan
description: "ChordLens 작업 계획 단계. 구현 전 FSD 레이어 설계, 파일 목록, 타입 인터페이스 정의. planner + plan-critic 팀으로 계획 수립 후 독립 비평까지 완료한다. 독립 실행 가능: /chordlens-plan으로 직접 호출하거나 chordlens-orchestrator가 Phase 2로 호출."
---

# ChordLens Plan

구현 전 계획을 수립하고 독립 비평으로 검증하는 단계.

## 실행 모드: 에이전트 팀

## 팀 구성

```
TeamCreate(
  team_name: "chordlens-plan-team",
  members: [
    {
      name: "planner",
      model: "opus",
      prompt: "[.claude/agents/planner.md 내용] + 작업 지시 + 기존 코드 탐색 시작"
    },
    {
      name: "plan-critic",
      model: "opus",
      prompt: "[.claude/agents/plan-critic.md 내용] + _workspace/02_plan.md 완성 알림 대기"
    }
  ]
)
```

## 워크플로우

### Phase 1: 준비

1. `_workspace/` 생성 (없는 경우)
2. planner에게 작업 지시 SendMessage

### Phase 2: 계획 수립

```
TaskCreate(tasks: [
  { title: "계획 수립", assignee: "planner", description: "기존 코드 탐색 후 _workspace/02_plan.md 작성" },
  { title: "계획 비평", assignee: "plan-critic", description: "_workspace/02_plan.md 읽고 _workspace/02_plan_critique.md 작성", depends_on: ["계획 수립"] }
])
```

**통신:**

- planner → plan-critic: "계획서 작성 완료, 검토 요청" SendMessage
- plan-critic → 리더: "비평 완료, 판정: [통과/수정 필요]" SendMessage

### Phase 3: 비평 반영

1. `_workspace/02_plan_critique.md` 읽기
2. 🔴 차단 항목 있는 경우:
   - planner에게 수정 지시 SendMessage
   - planner 수정 완료 후 plan-critic 재검토 (최대 2회)
3. 🟡 이하이거나 통과인 경우: 다음 단계 진행

### Phase 4: 정리

1. TeamDelete
2. 리더에게 계획 완료 보고
3. `_workspace/02_plan.md`, `_workspace/02_plan_critique.md` 경로 반환

## 산출물

| 파일                             | 내용                                  |
| -------------------------------- | ------------------------------------- |
| `_workspace/02_plan.md`          | 파일 목록, 타입 인터페이스, 구현 순서 |
| `_workspace/02_plan_critique.md` | 비평 결과, 판정                       |
