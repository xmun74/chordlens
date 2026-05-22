"use client";

import { useResults } from "../api/useResults";
import { ResultListItemCard } from "@/entities/result";

export function ResultList() {
  const { data, isPending, isError, error, refetch } = useResults();

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-bg-card/40" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-900/20 px-6 py-4 flex items-center justify-between">
        <p className="font-sans text-sm text-red-400">
          {error?.message ?? "목록을 불러오지 못했습니다."}
        </p>
        <button
          onClick={() => void refetch()}
          className="font-sans text-sm font-semibold text-red-300 hover:text-red-200 underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
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
