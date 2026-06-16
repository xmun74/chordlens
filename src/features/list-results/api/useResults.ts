"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getResults, resultsQueryKey } from "@/entities/result";
import type { ResultListResponse } from "@/entities/result";

export function useResults() {
  return useSuspenseQuery<ResultListResponse>({
    queryKey: resultsQueryKey,
    queryFn: () => getResults(),
  });
}
