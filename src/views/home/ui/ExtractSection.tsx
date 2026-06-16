"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useExtractChord, UrlInputForm, LoadingState } from "@/features/extract-chord";

interface ExtractSectionProps {
  /** 서버에서 렌더되는 배경(client child)·정적 히어로 카피(h1/p). RSC children으로 전달. */
  background: React.ReactNode;
  heroCopy: React.ReactNode;
}

export function ExtractSection({ background, heroCopy }: ExtractSectionProps): React.JSX.Element {
  const t = useTranslations();
  const mutation = useExtractChord();

  const handleSubmit = useCallback(
    (url: string) => {
      mutation.mutate(url);
    },
    [mutation],
  );

  return (
    <>
      {/* ─── Hero & Input Section ─── */}
      <section className="relative isolate w-full flex justify-center items-center overflow-hidden px-4 pt-8 pb-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12 lg:pb-10">
        {background}
        <div className="flex min-w-0 flex-col items-start gap-8">
          <div className="w-full min-w-0 max-w-2xl">
            {heroCopy}
            <UrlInputForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
          </div>
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
    </>
  );
}
