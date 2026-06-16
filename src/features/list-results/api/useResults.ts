"use client";

import { useQuery } from "@tanstack/react-query";
import { getResults, resultsQueryKey } from "@/entities/result";
import type { ResultListResponse } from "@/entities/result";

export function useResults() {
  return useQuery<ResultListResponse>({
    queryKey: resultsQueryKey,
    queryFn: () => getResults(),
  });
}
