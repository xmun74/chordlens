import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // 타입 목록 (Conventional Commits 기반)
    "type-enum": [
      2,
      "always",
      [
        "feat", // 새 기능
        "fix", // 버그 수정
        "docs", // 문서
        "style", // 포맷 (코드 변경 없음)
        "refactor", // 리팩터링
        "test", // 테스트
        "chore", // 빌드/설정
        "perf", // 성능 개선
        "ci", // CI/CD
        "revert", // 되돌리기
      ],
    ],
    "subject-case": [2, "always", "lower-case"],
    "subject-max-length": [2, "always", 72],
    "body-max-line-length": [2, "always", 100],
  },
};

export default config;
