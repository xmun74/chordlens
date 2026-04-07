import type { ChordResult } from "@/shared/model";

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * YouTube URL로 코드 분석 요청.
 * 실제 백엔드 유무와 관계없이 항상 /api/extract (Next.js Route)를 거침.
 * 백엔드가 없으면 Route Handler 내부에서 Mock 데이터를 반환.
 */
export async function extractChords(youtubeUrl: string): Promise<ChordResult> {
  // 프론트에서 로딩 애니메이션(3.5초)이 돌아가는 동안 실제 요청도 진행
  const [result] = await Promise.all([
    fetch("/api/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: youtubeUrl }),
    }).then(async (res) => {
      if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
      return res.json() as Promise<ChordResult>;
    }),
    delay(3500), // 로딩 애니메이션 최소 시간 보장
  ]);

  return result;
}
