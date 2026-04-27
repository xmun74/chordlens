import type { ResultListResponse } from "../model/types";

export async function getPopularResults(): Promise<ResultListResponse> {
  const res = await fetch("/api/results/popular");
  if (!res.ok) return { items: [], total: 0 };
  return res.json() as Promise<ResultListResponse>;
}
