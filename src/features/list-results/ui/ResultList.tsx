"use client";

import { useResults } from "../api/useResults";
import { ResultListItemCard } from "@/entities/result";

export function ResultList() {
  const { data } = useResults();

  if (data.items.length === 0) {
    return (
      <div className="rounded-xl border border-border/10 bg-bg-card/20 px-6 py-8 text-center">
        <p className="font-sans text-sm text-text-secondary">
          아직 분석된 곡이 없습니다. 위에 YouTube URL을 입력해 보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {data.items.map((item) => (
        <ResultListItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
