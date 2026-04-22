# Claude Code Skills

이 프로젝트(chordlens)에 구성된 Claude Code 스킬 목록과 사용법.

## 파이프라인 흐름

```
사용자 요청
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  chordlens-orchestrator                             │
│                                                     │
│  Phase 0  컨텍스트 확인                                │
│           _workspace/ 유무 → 초기/재실행/부분 분기        │
│                │                                    │
│  Phase 1  작업 분류                                   │
│           FE / BE / 연동 / GitHub                    │
└─────────────────┬───────────────────────────────────┘
                  │
    ┌─────────────▼──────────────┐
    │     Phase 2: PLAN          │  에이전트 팀
    │                            │
    │  planner                   │
    │    코드 탐색 → 계획 수립       │
    │    02_plan.md              │
    │         │                  │
    │  plan-critic               │
    │    독립 비평                 │
    │    02_plan_critique.md     │
    │         │                  │
    │    🔴 있음? ──► 수정 (×2)     │
    └─────────┬──────────────────┘
              │ TeamDelete
    ┌─────────▼──────────────────┐
    │   Phase 3: IMPLEMENT       │  에이전트 팀
    │                            │
    │  fe-developer              │
    │  ┌── Vitest 있음 ────────┐   │
    │  │ RED   테스트 작성       │  │
    │  │ GREEN 최소 구현        │  │
    │  │ REFACTOR 개선         │  │
    │  ├── Vitest 없음 ────────┤  │
    │  │ TYPE  인터페이스 선언    │  │
    │  │ IMPL  구현             │ │
    │  │ VERIFY tsc + fsd      │ │
    │  └───────────────────────┘ │
    │         │                  │
    │  code-critic               │
    │    독립 비평 + tsc/fsd 실행    │
    │    04_code_critique.md     │
    │         │                  │
    │    🔴 있음? ──► 수정 (×2)     │
    └─────────┬──────────────────┘
              │ TeamDelete
    ┌─────────▼──────────────────┐
    │     Phase 4: QA            │  서브 에이전트
    │                            │
    │  qa-reviewer               │
    │    pnpm tsc / fsd / lint   │
    │    BE-FE 경계면 비교          │
    │    05_qa_report.md         │
    │         │                  │
    │    재작업? ──► 수정 (×1)      │
    └─────────┬──────────────────┘
              │ (선택)
    ┌─────────▼──────────────────┐
    │   Phase 5: GitHub          │  서브 에이전트
    │                            │
    │  github-manager            │
    │    Issue / 브랜치 / PR       │
    └────────────────────────────┘
```

### \_workspace 산출물

```
_workspace/
├── 01_task.md              ← 작업 지시 원문
├── 02_plan.md              ← 파일 목록 + 타입 인터페이스 + 구현 순서
├── 02_plan_critique.md     ← 계획 비평 결과
├── 04_code_critique.md     ← 코드 비평 결과 (tsc/fsd 실행 결과 포함)
└── 05_qa_report.md         ← 최종 QA 보고서
```

---

## 에이전트

| 에이전트       | 단계      | 역할                                          |
| -------------- | --------- | --------------------------------------------- |
| planner        | Plan      | 기존 코드 탐색 후 파일 목록·타입·순서 설계    |
| plan-critic    | Plan      | 계획서 독립 비평 (컨텍스트 격리)              |
| fe-developer   | Implement | TDD 또는 타입 우선으로 FE 구현                |
| be-developer   | Implement | FastAPI 클린 아키텍처로 BE 구현               |
| code-critic    | Implement | 코드 독립 비평 + tsc/fsd 실행 (컨텍스트 격리) |
| qa-reviewer    | QA        | 전체 종합 검증                                |
| github-manager | GitHub    | Issue/브랜치/PR 관리                          |

---

## 스킬 목록

### 파이프라인 스킬 (자동 트리거)

| 스킬                                                      | 설명                   | 활성화 조건                      |
| --------------------------------------------------------- | ---------------------- | -------------------------------- |
| [chordlens-orchestrator](chordlens-orchestrator/SKILL.md) | 전체 파이프라인 진입점 | ChordLens 개발 작업 요청 시      |
| [chordlens-plan](chordlens-plan/SKILL.md)                 | Plan 단계              | `/chordlens-plan` 직접 호출      |
| [chordlens-implement](chordlens-implement/SKILL.md)       | Implement 단계         | `/chordlens-implement` 직접 호출 |
| [chordlens-qa](chordlens-qa/SKILL.md)                     | QA 단계                | `/chordlens-qa` 직접 호출        |

### 참조 스킬 (에이전트가 내부적으로 사용)

| 스킬                                        | 설명                                           |
| ------------------------------------------- | ---------------------------------------------- |
| [fe-development](fe-development/SKILL.md)   | FE 개발 규칙 (FSD, TypeScript, TanStack Query) |
| [be-development](be-development/SKILL.md)   | BE 개발 규칙 (FastAPI, Supabase)               |
| [github-workflow](github-workflow/SKILL.md) | GitHub 작업 프로세스                           |
| [code-review](code-review/SKILL.md)         | 코드 품질 기준                                 |

### 마켓플레이스 스킬

#### 자동 활성화

| 스킬                                                                | 설명                                 | 활성화 조건                                   |
| ------------------------------------------------------------------- | ------------------------------------ | --------------------------------------------- |
| [feature-sliced-design](feature-sliced-design/SKILL.md)             | FSD v2.1 아키텍처 규칙 적용          | 파일 구조, 레이어/슬라이스/세그먼트 관련 작업 |
| [vercel-react-best-practices](vercel-react-best-practices/SKILL.md) | React/Next.js 성능 최적화 (70+ 규칙) | 컴포넌트 작성, 리팩토링, 데이터 페칭 작업     |
| [web-design-guidelines](web-design-guidelines/SKILL.md)             | UI/UX 가이드라인 검증                | UI 리뷰, 접근성 감사 요청                     |

#### 수동 호출

| 스킬                                                                    | 설명                               | 사용 시점                                |
| ----------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------- |
| [frontend-design](frontend-design/SKILL.md)                             | 프로덕션급 UI 컴포넌트/페이지 생성 | 신규 UI 빌드, 스타일링, 디자인 개선 요청 |
| [vercel-react-view-transitions](vercel-react-view-transitions/SKILL.md) | View Transition API 애니메이션     | 페이지 전환, 라우트 변경 애니메이션 구현 |

---

## 워크플로우

### 신규 기능 개발

```
FSD 슬라이스 설계 → 구현 → UI 빌드 → 리뷰
```

1. **FSD 설계** — `feature-sliced-design` 스킬이 레이어/슬라이스/세그먼트 규칙 자동 적용
2. **구현** — `vercel-react-best-practices` 스킬이 React/Next.js 성능 패턴 자동 지원
3. **UI 빌드** — `frontend-design` 스킬로 프로덕션급 UI 생성
4. **리뷰** — `web-design-guidelines` 스킬로 접근성/UX 검증

### 페이지 전환 애니메이션 추가

```
vercel-react-view-transitions → <ViewTransition> 구현
```

---

## 프로젝트 스택

| 항목       | 내용                        |
| ---------- | --------------------------- |
| 프레임워크 | Next.js 16.2.2 (App Router) |
| 언어       | TypeScript                  |
| UI         | React 19, Tailwind CSS v4   |
| 데이터     | TanStack Query v5           |
| 아키텍처   | Feature-Sliced Design v2.1  |
| 검증       | steiger (`pnpm fsd`)        |
| 커밋       | commitlint (conventional)   |

---

## 디렉토리 구조

```
.claude/skills/
├── README.md                              ← 현재 파일
├── chordlens-orchestrator/
│   └── SKILL.md
├── chordlens-plan/
│   └── SKILL.md
├── chordlens-implement/
│   └── SKILL.md
├── chordlens-qa/
│   └── SKILL.md
├── fe-development/
│   └── SKILL.md
├── be-development/
│   └── SKILL.md
├── github-workflow/
│   └── SKILL.md
├── code-review/
│   └── SKILL.md
├── feature-sliced-design/
│   ├── SKILL.md
│   └── rules/
├── frontend-design/
│   └── SKILL.md
├── vercel-react-best-practices/
│   ├── SKILL.md
│   └── rules/
├── vercel-react-view-transitions/
│   └── SKILL.md
└── web-design-guidelines/
    └── SKILL.md
```

---

## TDD 활성화

현재 타입 우선 사이클로 동작 중. Vitest 설치 시 자동으로 TDD 사이클로 전환:

```bash
pnpm add -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

---

## 스킬 관리

```bash
# 설치된 스킬 확인
npx skills list

# 스킬 추가 (Claude Code 전용)
npx skills add <source> --agent claude-code

# 스킬 업데이트
npx skills update

# skills-lock.json 기준 복원
npx skills experimental_install
```
