"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getPopularResults, popularResultsQueryKey } from "@/entities/result";
import type { ResultListResponse } from "@/entities/result";

export function usePopularResults() {
  return useSuspenseQuery<ResultListResponse>({
    queryKey: popularResultsQueryKey,
    queryFn: () => getPopularResults(),
  });
}
