import { cache } from "react";
import { headers } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/shared/lib/getQueryClient";
import {
  getResults,
  getPopularResults,
  resultsQueryKey,
  popularResultsQueryKey,
} from "@/entities/result";
import { HomePage } from "@/views/home";

const getBaseUrl = cache(async (): Promise<string> => {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  return `${host.startsWith("localhost") ? "http" : "https"}://${host}`;
});

export default async function Home() {
  const queryClient = getQueryClient();
  const baseUrl = await getBaseUrl();

  // 실패 허용: prefetchQuery reject가 allSettled로 page render를 reject하지 않음.
  // v5 기본 dehydrate는 에러 쿼리를 redact → 정상 응답만 첫 HTML에 동봉(워터폴 제거).
  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: popularResultsQueryKey,
      queryFn: () => getPopularResults(baseUrl),
    }),
    queryClient.prefetchQuery({
      queryKey: resultsQueryKey,
      queryFn: () => getResults(baseUrl),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePage />
    </HydrationBoundary>
  );
}
