"use client";

import { useQuery } from "@tanstack/react-query";
import { getPopularResults, popularResultsQueryKey } from "@/entities/result";
import type { ResultListResponse } from "@/entities/result";

export function usePopularResults() {
  return useQuery<ResultListResponse>({
    queryKey: popularResultsQueryKey,
    queryFn: () => getPopularResults(),
  });
}
