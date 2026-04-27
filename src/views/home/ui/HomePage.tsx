"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useExtractChord, UrlInputForm, LoadingState } from "@/features/extract-chord";
import { PopularList, ResultList } from "@/features/list-results";

export function HomePage() {
  const t = useTranslations();
  const mutation = useExtractChord();

  const handleSubmit = useCallback(
    (url: string) => {
      mutation.mutate(url);
    },
    [mutation],
  );

  return (
    <main className="min-h-screen">
      {/* ─── Hero & Input Section ─── */}
      <section className="mx-auto max-w-7xl px-8 pt-12 pb-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="flex-1 max-w-2xl">
            <h1 className="font-heading text-5xl lg:text-[60px] font-bold leading-[1.2] tracking-[-0.025em] text-text-primary mb-6">
              {t("YouTube 동영상에서")}{" "}
              <span className="bg-linear-to-r from-accent-light to-accent bg-clip-text text-transparent">
                {t("기타 코드를 배우세요")}
              </span>
            </h1>
            <p className="font-sans text-lg text-text-secondary leading-relaxed mb-8 max-w-xl">
              {t("좋아하는 곡의 링크를 붙여보세요")}
            </p>

            <UrlInputForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
          </div>

          <div className=""></div>
        </div>
      </section>

      {/* ─── Loading State ─── */}
      {mutation.isPending && mutation.pipelineStatus !== "idle" && (
        <section className="mx-auto max-w-7xl px-8 pb-8">
          <LoadingState status={mutation.pipelineStatus} progress={mutation.progress} />
        </section>
      )}

      {/* ─── Error State ─── */}
      {mutation.isError && (
        <section className="mx-auto max-w-7xl px-8 pb-8">
          <div className="rounded-2xl bg-red-900/20 border border-red-500/20 px-8 py-6 flex items-center justify-between">
            <div>
              <p className="font-heading font-bold text-red-300">{t("분석 실패")}</p>
              <p className="font-sans text-sm text-red-400 mt-1">
                {mutation.error?.message ?? t("알 수 없는 오류가 발생했습니다")}
              </p>
            </div>
            <button
              onClick={() => mutation.reset()}
              className="font-sans text-sm font-semibold text-red-300 hover:text-red-200 underline"
            >
              {t("다시 시도")}
            </button>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-8 pb-8">
        <p className="font-mono text-xs tracking-widest text-text-secondary uppercase mb-4">
          {t("인기")}
        </p>
        <PopularList />
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-16">
        <p className="font-mono text-xs tracking-widest text-text-secondary uppercase mb-4">
          {t("최근")}
        </p>
        <ResultList />
      </section>
    </main>
  );
}
