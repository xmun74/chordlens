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

  // streaming SSR: await 하지 않고 prefetch만 시작한다(비대기).
  // pending 쿼리가 dehydrate에 포함(getQueryClient 설정)되어, 서버에서 resolve되면
  // 같은 응답 스트림으로 흘러간다 → 히어로는 즉시 flush, 목록만 스트리밍.
  void queryClient.prefetchQuery({
    queryKey: popularResultsQueryKey,
    queryFn: () => getPopularResults(baseUrl),
  });
  void queryClient.prefetchQuery({
    queryKey: resultsQueryKey,
    queryFn: () => getResults(baseUrl),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePage />
    </HydrationBoundary>
  );
}
