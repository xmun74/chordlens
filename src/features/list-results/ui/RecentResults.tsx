"use client";

import { Suspense } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { ResultList } from "./ResultList";
import { ResultListSkeleton } from "./ResultListSkeleton";
import { ResultListError } from "./ResultListError";

export function RecentResults(): React.JSX.Element {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallback={({ error, reset }) => <ResultListError error={error} reset={reset} />}
        >
          <Suspense fallback={<ResultListSkeleton />}>
            <ResultList />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
