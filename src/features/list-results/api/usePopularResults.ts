"use client";

import { useQuery } from "@tanstack/react-query";
import { getPopularResults } from "@/entities/result";
import type { ResultListResponse } from "@/entities/result";

export const popularResultsQueryKey = ["results", "popular"] as const;

export function usePopularResults() {
  return useQuery<ResultListResponse>({
    queryKey: popularResultsQueryKey,
    queryFn: getPopularResults,
    refetchOnMount: "always",
  });
}
