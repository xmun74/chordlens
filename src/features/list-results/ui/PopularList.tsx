"use client";

import { usePopularResults } from "../api/usePopularResults";
import { ResultListItemCard } from "@/entities/result";

export function PopularList() {
  const { data, isPending, isError } = usePopularResults();

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-bg-card/40" />
        ))}
      </div>
    );
  }

  if (isError || !data || data.items.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-2">
      {data.items.map((item) => (
        <ResultListItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
