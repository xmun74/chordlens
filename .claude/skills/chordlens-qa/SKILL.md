---
name: chordlens-qa
description: "ChordLens QA 최종 검증 단계. 구현 완료 후 TypeScript, FSD, API 에러 처리, BE-FE 경계면을 종합 검증한다. 독립 실행 가능: /chordlens-qa로 직접 호출하거나 chordlens-orchestrator가 Phase 4로 호출."
---

# ChordLens QA

구현 결과를 최종 검증하는 단계. code-critic의 점진적 검토와 달리 전체를 종합 시각으로 본다.

## 실행 모드: 서브 에이전트

qa-reviewer는 단독으로 실행한다 — 구현팀의 컨텍스트에서 독립된 시각이 필요하다.

```
Agent(
  description: "ChordLens QA 최종 검증",
  subagent_type: "general-purpose",
  model: "opus",
  prompt: "[.claude/agents/qa-reviewer.md 내용] + [.claude/skills/code-review/SKILL.md 내용] + 검증 지시"
)
```

## QA 지시 포함 내용

1. `_workspace/02_plan.md` 읽어 계획 파악
2. `_workspace/04_code_critique.md` 읽어 이전 비평 결과 파악
3. 구현된 파일들을 직접 Read로 확인
4. 아래 검증 항목 전체 실행

## 검증 항목

### 자동화 검증 (명령 실행)

```bash
pnpm tsc --noEmit   # 타입 에러
pnpm fsd            # FSD 위반
pnpm lint           # ESLint
```

### 수동 검증 (코드 리뷰)

```
[ ] any 타입 없음
[ ] console.log 없음
[ ] useEffect 데이터 페칭 없음
[ ] API 에러 처리 (400/500/504) 구현
[ ] named export 사용
[ ] Props 인터페이스 선언
[ ] BE 응답 shape ↔ FE 타입 일치
```

### 경계면 교차 비교

BE/FE 연동이 있는 경우:

1. `app/models/` Pydantic 모델 읽기
2. `src/features/{name}/model/types.ts` 읽기
3. 필드명·타입·필수/옵셔널 비교

## 출력

QA 결과를 `_workspace/05_qa_report.md`에 저장:

```markdown
## 최종 판정: 통과 / 조건부 통과 / 재작업

## 자동화 검증 결과

- pnpm tsc: [결과]
- pnpm fsd: [결과]
- pnpm lint: [결과]

## 수동 검증 결과

[항목별 결과]

## 잔여 이슈

[있는 경우만]
```

판정이 "재작업"인 경우 리더에게 명시적으로 보고한다.
