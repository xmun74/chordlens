import type { ResultListResponse } from "../model/types";

export async function getPopularResults(baseUrl = ""): Promise<ResultListResponse> {
  // baseUrl 빈 값=브라우저 상대 URL, 절대 URL=서버 RSC prefetch. cache:"no-store"는 precedent getResultById와 일치.
  const res = await fetch(`${baseUrl}/api/results/popular`, { cache: "no-store" });
  if (!res.ok) return { items: [], total: 0 };
  return res.json() as Promise<ResultListResponse>;
}
