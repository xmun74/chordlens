---
name: chordlens-orchestrator
description: "ChordLens 개발 작업의 메인 오케스트레이터. FE 기능 개발, BE API 개발, FE+BE 연동, 컴포넌트 추가, 버그 수정, GitHub Issue/PR 생성, 코드 리뷰 요청 시 반드시 이 스킬을 사용. 후속 작업: 기능 수정, 재구현, 업데이트, 이전 결과 개선, 다시 실행, 보완, 특정 부분만 다시 요청 시에도 반드시 사용."
---

# ChordLens Orchestrator

Plan → Implement → QA 3단계 파이프라인으로 개발 작업을 조율한다.

## 실행 모드: 하이브리드 (파이프라인)

| Phase              | 모드          | 스킬                | 팀원                          |
| ------------------ | ------------- | ------------------- | ----------------------------- |
| Phase 2: Plan      | 에이전트 팀   | chordlens-plan      | planner + plan-critic         |
| Phase 3: Implement | 에이전트 팀   | chordlens-implement | fe/be-developer + code-critic |
| Phase 4: QA        | 서브 에이전트 | chordlens-qa        | qa-reviewer                   |
| Phase 5: GitHub    | 서브 에이전트 | github-workflow     | github-manager                |

## 워크플로우

### Phase 0: 컨텍스트 확인

1. `_workspace/` 존재 여부 확인
2. 실행 모드 결정:
   - `_workspace/` **없음** → 초기 실행, Phase 1 진행
   - `_workspace/` **있음** + 부분 수정 요청 → 부분 재실행:
     - "계획만 다시" → Phase 2(Plan)만 재실행, 기존 구현 보존
     - "구현만 다시" → Phase 3(Implement)부터 재실행
     - "QA만 다시" → Phase 4(QA)만 재실행
   - `_workspace/` **있음** + 새 작업 → `_workspace/`를 `_workspace_prev_{YYYYMMDD}/`로 이동 후 Phase 1

### Phase 1: 작업 분류

1. 사용자 요청 분석
2. 유형 결정:
   - **FE 전용**: 컴포넌트, 페이지, 훅, UI 관련
   - **BE 전용**: FastAPI 엔드포인트, 서비스, Supabase 관련
   - **FE+BE 연동**: API 연동, 데이터 흐름
   - **GitHub 작업**: Issue/PR/브랜치만 필요 → Phase 5로 바로 이동
3. `_workspace/` 생성
4. `_workspace/01_task.md`에 작업 지시 저장

### Phase 2: Plan (계획 수립)

**실행 모드:** 에이전트 팀

`chordlens-plan` 스킬 실행:

```
TeamCreate(
  team_name: "chordlens-plan-team",
  members: [
    {
      name: "planner",
      model: "opus",
      prompt: """
        [.claude/agents/planner.md 전체 내용]

        작업: [_workspace/01_task.md 내용]
        작업 유형: [FE/BE/연동]

        1. src/ 디렉토리를 탐색하여 관련 기존 코드를 파악한다
        2. _workspace/02_plan.md를 작성한다
        3. 완료 후 plan-critic에게 SendMessage로 검토 요청
      """
    },
    {
      name: "plan-critic",
      model: "opus",
      prompt: """
        [.claude/agents/plan-critic.md 전체 내용]

        planner가 계획 완료 알림을 보내면:
        1. _workspace/02_plan.md를 읽는다
        2. _workspace/02_plan_critique.md를 작성한다
        3. 리더에게 판정 결과 SendMessage
      """
    }
  ]
)

TaskCreate(tasks: [
  { title: "계획 수립", assignee: "planner" },
  { title: "계획 비평", assignee: "plan-critic", depends_on: ["계획 수립"] }
])
```

완료 후 `_workspace/02_plan_critique.md` 읽어 🔴 항목 확인:

- 🔴 있음 → planner에게 수정 지시 (최대 2회)
- 통과 → TeamDelete 후 Phase 3 진행

### Phase 3: Implement (구현)

**실행 모드:** 에이전트 팀

`chordlens-implement` 스킬 실행 (작업 유형에 따라 팀 구성):

**FE 전용:**

```
TeamCreate(
  team_name: "chordlens-impl-team",
  members: [
    {
      name: "fe-developer",
      model: "opus",
      prompt: """
        [.claude/agents/fe-developer.md 전체 내용]
        [.claude/skills/fe-development/SKILL.md 전체 내용]

        _workspace/02_plan.md를 읽고 타입 우선 개발을 시작한다:
        1. 계획서의 인터페이스를 types.ts에 먼저 선언
        2. 타입 기반으로 구현
        3. pnpm tsc --noEmit 통과 확인
        4. 완료 후 code-critic에게 SendMessage
      """
    },
    {
      name: "code-critic",
      model: "opus",
      prompt: """
        [.claude/agents/code-critic.md 전체 내용]

        fe-developer 완료 알림 수신 후:
        1. _workspace/02_plan.md 읽기
        2. 변경된 파일들 Read
        3. pnpm tsc --noEmit 실행
        4. pnpm fsd 실행
        5. _workspace/04_code_critique.md 작성
        6. 리더에게 판정 SendMessage
      """
    }
  ]
)
```

**BE 포함 시 be-developer 추가:**

```
{
  name: "be-developer",
  model: "opus",
  prompt: "[.claude/agents/be-developer.md] + [.claude/skills/be-development/SKILL.md] + _workspace/02_plan.md 기반 구현"
}
```

완료 후 `_workspace/04_code_critique.md` 읽어 🔴 확인:

- 🔴 있음 → fe-developer에게 수정 지시 (최대 2회)
- 통과 → TeamDelete 후 Phase 4 진행

### Phase 4: QA (최종 검증)

**실행 모드:** 서브 에이전트

```
Agent(
  description: "ChordLens QA 최종 검증",
  subagent_type: "general-purpose",
  model: "opus",
  prompt: """
    [.claude/agents/qa-reviewer.md 전체 내용]
    [.claude/skills/code-review/SKILL.md 전체 내용]
    [.claude/skills/chordlens-qa/SKILL.md 전체 내용]

    1. _workspace/02_plan.md 읽기
    2. _workspace/04_code_critique.md 읽기
    3. 구현 파일들 Read로 확인
    4. pnpm tsc --noEmit, pnpm fsd, pnpm lint 실행
    5. BE-FE 경계면 교차 비교 (연동 작업인 경우)
    6. _workspace/05_qa_report.md 작성
  """
)
```

QA 판정이 "재작업"인 경우:

- fe-developer/be-developer에게 수정 지시
- QA 재실행 (최대 1회)

### Phase 5: GitHub (선택)

사용자에게 GitHub 처리 여부 확인 후:

```
Agent(
  description: "GitHub 워크플로우 실행",
  subagent_type: "general-purpose",
  model: "opus",
  prompt: """
    [.claude/agents/github-manager.md 전체 내용]
    [.claude/skills/github-workflow/SKILL.md 전체 내용]

    작업 유형: [feat/fix/chore]
    작업 내용: [_workspace/01_task.md 요약]
    영향 범위: [FE/BE/연동]
  """
)
```

### Phase 6: 정리

1. `_workspace/` 보존
2. 결과 요약:
   - 구현된 파일 목록
   - QA 최종 판정
   - GitHub 처리 여부
3. 피드백 수집

## 데이터 흐름

```
사용자 요청
    ↓
_workspace/01_task.md
    ↓
[Plan Team] planner ←→ plan-critic
    ↓
_workspace/02_plan.md + 02_plan_critique.md
    ↓ TeamDelete
[Impl Team] fe-developer ←→ code-critic
    ↓
실제 소스 파일 + _workspace/04_code_critique.md
    ↓ TeamDelete
[QA Sub-agent] qa-reviewer
    ↓
_workspace/05_qa_report.md
    ↓ (선택)
[GitHub Sub-agent] github-manager
```

## 에러 핸들링

| 상황                         | 전략                                             |
| ---------------------------- | ------------------------------------------------ |
| 계획 비평 🔴 2회 이후 미해결 | 사용자에게 계획 검토 요청                        |
| 구현 비평 🔴 2회 이후 미해결 | 리더가 직접 수정 제안                            |
| QA 재작업 1회 이후 미해결    | 사용자에게 보고, 수동 처리 제안                  |
| 팀원 실패                    | SendMessage로 상태 확인 → 1회 재시도 → 누락 명시 |
| 계획서 없이 Implement 요청   | Plan 단계 먼저 실행 안내                         |

## 테스트 시나리오

### 정상 흐름 (FE 기능)

1. "ChordTimeline에 자동 스크롤 기능 추가"
2. Phase 1: FE 전용 분류
3. Phase 2: planner 계획 → plan-critic 통과
4. Phase 3: fe-developer 타입 정의 → 구현 → code-critic 통과
5. Phase 4: qa-reviewer `pnpm tsc + fsd + lint` 전부 통과
6. Phase 5: GitHub PR 생성
7. `_workspace/05_qa_report.md` 최종 판정: 통과

### 에러 흐름 (비평 루프)

1. Phase 3에서 code-critic이 FSD 위반 발견 (features에서 app 직접 import)
2. fe-developer에게 수정 지시
3. 수정 후 `pnpm fsd` 통과
4. Phase 4 QA 진행
