import { defineConfig } from "steiger";
import fsd from "@feature-sliced/steiger-plugin";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Next.js App Router의 app/ 폴더와 views/ 폴더는 FSD 레이어 스캔에서 제외.
    // app/ → Next.js 라우팅 전담, views/ → pages 레이어 대체 (Next.js 충돌 방지)
    // 이 두 폴더가 slices를 import하므로 insignificant-slice 오탐이 발생할 수 있음.
    ignores: ["./src/app/**", "./src/views/**", "./src/vexchords.d.ts"],
  },
  {
    // app/과 views/에서 참조되는 슬라이스들이 "참조 없음"으로 오탐되는 것을 방지
    files: ["./src/entities/**", "./src/features/**"],
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
]);
