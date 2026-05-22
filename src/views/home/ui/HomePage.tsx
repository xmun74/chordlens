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
    <main className="min-h-screen overflow-x-clip">
      {/* ─── Hero & Input Section ─── */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 pb-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12 lg:pb-10">
        <div className="flex min-w-0 flex-col items-start gap-8 lg:flex-row lg:gap-12">
          <div className="w-full min-w-0 max-w-2xl flex-1">
            <h1 className="mb-5 font-heading text-4xl leading-[1.15] font-bold tracking-[-0.025em] text-text-primary sm:text-5xl sm:leading-[1.2] lg:mb-6 lg:text-[60px]">
              {t("YouTube 동영상에서")}{" "}
              <span className="bg-linear-to-r from-accent-light to-accent bg-clip-text text-transparent">
                {t("기타 코드를 배우세요")}
              </span>
            </h1>
            <p className="mb-6 max-w-xl font-sans text-base leading-relaxed text-text-secondary sm:mb-8 sm:text-lg">
              {t("좋아하는 곡의 링크를 붙여보세요")}
            </p>

            <UrlInputForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
          </div>

          <div className="hidden lg:block"></div>
        </div>
      </section>

      {/* ─── Loading State ─── */}
      {mutation.isPending && mutation.pipelineStatus !== "idle" && (
        <section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <LoadingState status={mutation.pipelineStatus} progress={mutation.progress} />
        </section>
      )}

      {/* ─── Error State ─── */}
      {mutation.isError && (
        <section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-900/20 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
            <div className="min-w-0">
              <p className="font-heading font-bold text-red-300">{t("분석 실패")}</p>
              <p className="font-sans text-sm text-red-400 mt-1">
                {mutation.error?.message ?? t("알 수 없는 오류가 발생했습니다")}
              </p>
            </div>
            <button
              onClick={() => mutation.reset()}
              className="self-start font-sans text-sm font-semibold text-red-300 underline hover:text-red-200 sm:self-auto"
            >
              {t("다시 시도")}
            </button>
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <p className="font-mono text-xs tracking-widest text-text-secondary uppercase mb-4">
          {t("인기")}
        </p>
        <PopularList />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-16">
        <p className="font-mono text-xs tracking-widest text-text-secondary uppercase mb-4">
          {t("최근")}
        </p>
        <ResultList />
      </section>
    </main>
  );
}
