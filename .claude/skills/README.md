# Claude Code Skills

이 프로젝트(codelens)에 구성된 Claude Code 스킬 목록과 사용법.

## 스킬 목록

### 자동 활성화

| 스킬                                                                | 설명                                 | 활성화 조건                                   |
| ------------------------------------------------------------------- | ------------------------------------ | --------------------------------------------- |
| [feature-sliced-design](feature-sliced-design/SKILL.md)             | FSD v2.1 아키텍처 규칙 적용          | 파일 구조, 레이어/슬라이스/세그먼트 관련 작업 |
| [vercel-react-best-practices](vercel-react-best-practices/SKILL.md) | React/Next.js 성능 최적화 (70+ 규칙) | 컴포넌트 작성, 리팩토링, 데이터 페칭 작업     |
| [web-design-guidelines](web-design-guidelines/SKILL.md)             | UI/UX 가이드라인 검증                | UI 리뷰, 접근성 감사 요청                     |

### 수동 호출

| 스킬                                                                    | 설명                               | 사용 시점                                |
| ----------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------- |
| [frontend-design](frontend-design/SKILL.md)                             | 프로덕션급 UI 컴포넌트/페이지 생성 | 신규 UI 빌드, 스타일링, 디자인 개선 요청 |
| [vercel-react-view-transitions](vercel-react-view-transitions/SKILL.md) | View Transition API 애니메이션     | 페이지 전환, 라우트 변경 애니메이션 구현 |

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

## 디렉토리 구조

```
.claude/skills/
├── README.md                              ← 현재 파일
├── feature-sliced-design/
│   ├── SKILL.md
│   └── rules/                            # FSD 규칙
├── frontend-design/
│   └── SKILL.md
├── vercel-react-best-practices/
│   ├── SKILL.md
│   └── rules/                            # 성능 규칙 70+개
├── vercel-react-view-transitions/
│   └── SKILL.md
└── web-design-guidelines/
    └── SKILL.md
```

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
