"use client";

import { Suspense } from "react";
import { PopularList } from "./PopularList";
import { PopularListSkeleton } from "./PopularListSkeleton";

export function PopularResults(): React.JSX.Element {
  return (
    <Suspense fallback={<PopularListSkeleton />}>
      <PopularList />
    </Suspense>
  );
}
