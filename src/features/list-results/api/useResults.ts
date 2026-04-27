"use client";

import { useQuery } from "@tanstack/react-query";
import { getResults } from "@/entities/result";
import type { ResultListResponse } from "@/entities/result";

export const resultsQueryKey = ["results"] as const;

export function useResults() {
  return useQuery<ResultListResponse>({
    queryKey: resultsQueryKey,
    queryFn: getResults,
    refetchOnMount: "always",
  });
}
