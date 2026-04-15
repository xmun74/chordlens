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
  const result = await fetch("/api/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: youtubeUrl }),
  }).then(async (res) => {
    if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
    return res.json() as Promise<ChordResult>;
  });

  // 캐시 미스일 때만 애니메이션 최소 시간 보장 (실제 처리는 30s+ 걸리므로 사실상 무의미하지만 안전장치)
  if (!result.cached) {
    await delay(3500);
  }

  return result;
}
