# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

---

# ChordLens 프로젝트 컨텍스트

YouTube URL을 입력하면 기타 코드를 자동 분석해 반환하는 서비스.

## 프로젝트 구조

- **FE** (chordlens): Next.js 16, TypeScript, App Router, TanStack Query, Tailwind CSS, vexchords
- **BE** (chordlens-be): Python 3.11, FastAPI 0.111, Supabase (PostgreSQL), Docker

---

## GitHub 작업 방식

### Issue 생성 시

- FE 작업 → chordlens repo에 Issue 생성, 라벨 `FE` 추가
- BE 작업 → chordlens-be repo에 Issue 생성, 라벨 `BE` 추가
- FE+BE 연동 작업 → chordlens repo에 Issue 생성, 라벨 `FE`, `BE` 둘 다 추가
- 템플릿 형식 반드시 사용 (feat / bug / chore)

### 작업 시작 시

1. 해당 repo Issue 확인
2. 브랜치 생성: `feat/#이슈번호-작업명` / `fix/#이슈번호-작업명`
3. Issue 상태 → In Progress로 변경

### 커밋 메시지

```
feat: #12 로그인 페이지 구현
fix: #15 코드 분석 API 타임아웃 수정
chore: #9 ESLint 설정 추가
```

### 작업 완료 시

1. PR 생성 (pull_request_template.md 형식 사용)
2. PR 본문에 `closes #이슈번호` 반드시 포함
3. Issue 상태 → Done으로 변경

---

## 하네스 규칙

### FE - 컴포넌트 생성 시

- `<script>` 없이 함수형 컴포넌트로 작성
- Props는 `interface`로 별도 선언
- `named export` 사용
- `'use client'`는 인터랙션/훅이 필요한 경우만
- 파일 위치: `src/components/` 하위 적절한 폴더

### FE - API 연동 시

- BE 엔드포인트: `POST /extract`, `GET /health`
- 요청/응답 타입 반드시 `interface`로 선언
- 에러 처리: `400` / `500` / `504` 케이스 모두 핸들링
- fetch 대신 공통 api 유틸 함수 사용 (없으면 생성)

### FE 금지

- `any` 타입 사용 금지
- `useEffect`로 데이터 페칭 금지 (Server Component 또는 React Query 사용)
- `console.log` 커밋 금지

### BE - 라우터 생성 시

- 파일 위치: `app/routers/`
- 요청/응답 스키마는 `app/models/`에 Pydantic으로 선언
- 에러는 `HTTPException(status_code=..., detail=...)` 형태
- 비즈니스 로직은 `app/services/`에 분리

### BE - 서비스 생성 시

- 파일 위치: `app/services/`
- Supabase 접근은 `app/db.py` 싱글턴 사용
- 환경 변수는 `app/core/config.py` 통해서만 접근

### BE 금지

- 라우터에 비즈니스 로직 직접 작성 금지
- 환경 변수 직접 `os.environ` 접근 금지

---

## 하네스: ChordLens

**목표:** FE/BE 개발, 코드 리뷰, GitHub 워크플로우를 에이전트 팀으로 조율

**트리거:** FE 기능 개발, BE API 개발, API 연동, 컴포넌트 추가, 버그 수정, GitHub Issue/PR 생성 등 ChordLens 개발 작업 요청 시 `chordlens-orchestrator` 스킬을 사용하라. 단계별 직접 호출도 가능: `chordlens-plan`, `chordlens-implement`, `chordlens-qa`. 단순 질문은 직접 응답 가능.

**변경 이력:**

| 날짜       | 변경 내용                                             | 대상                                                                                                                            | 사유                                                |
| ---------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 2026-04-22 | 초기 구성                                             | 전체                                                                                                                            | -                                                   |
| 2026-04-22 | Plan→Implement→QA 3단계 파이프라인 추가               | orchestrator, 에이전트 3개(planner/plan-critic/code-critic), 스킬 3개(plan/implement/qa)                                        | 계획 수립 + 독립 비평 + 타입 우선 개발 도입         |
| 2026-04-27 | Superpowers + revfactory/harness 방식으로 전체 재구축 | 에이전트 7개(planner/plan-critic/fe-developer/be-developer/code-critic/qa-reviewer/github-manager), 스킬 8개(orchestrator 포함) | 도메인 지식(vexchords/autochord/yt-dlp) 스킬에 통합 |
