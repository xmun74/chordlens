import type { ResultListResponse } from "../model/types";

export async function getResults(): Promise<ResultListResponse> {
  const res = await fetch("/api/results");

  if (res.status === 504) {
    throw new Error("요청 시간이 초과되었습니다.");
  }
  if (res.status === 400) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail ?? "잘못된 요청입니다.");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail ?? "목록을 불러오지 못했습니다.");
  }

  return res.json() as Promise<ResultListResponse>;
}
