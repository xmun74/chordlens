"use client";

import { useState } from "react";
import { useExtractChord } from "@/features/extract-chord/model/useExtractChord";
import { UrlInputForm } from "@/features/extract-chord/ui/UrlInputForm";
import { LoadingState } from "@/features/extract-chord/ui/LoadingState";
import { ShareButton } from "@/features/share-result/ui/ShareButton";
import { ChordTimeline } from "@/entities/chord/ui/ChordTimeline";
import { ChordGrid } from "@/entities/chord/ui/ChordGrid";
import { VideoCard } from "@/entities/video/ui/VideoCard";

export function HomePage() {
  const [activeChord, setActiveChord] = useState<string | null>(null);
  const mutation = useExtractChord();

  const handleSubmit = (url: string) => {
    setActiveChord(null);
    mutation.mutate(url);
  };

  return (
    <main className="min-h-screen">
      {/* ─── Hero & Input Section ─── */}
      <section className="mx-auto max-w-7xl px-8 pt-12 pb-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left: Heading + Input */}
          <div className="flex-1 max-w-2xl">
            <h1 className="font-(family-name:--font-space-grotesk) text-5xl lg:text-[60px] font-bold leading-[1.2] tracking-[-0.025em] text-text-primary mb-6">
              Learn guitar chords from{" "}
              <span className="bg-linear-to-r from-accent-light to-accent bg-clip-text text-transparent">
                any YouTube video.
              </span>
            </h1>
            <p className="font-(family-name:--font-inter) text-lg text-text-secondary leading-relaxed mb-8 max-w-xl">
              Unlock the secrets of your favorite tracks. Just paste a link or drop a file to get
              high-fidelity chord analysis in seconds.
            </p>

            <UrlInputForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
          </div>

          {/* Right: Hero image card */}
          <div className="hidden lg:block relative w-[480px] shrink-0">
            <div className="relative rounded-2xl border border-border/10 bg-bg-card/40 overflow-hidden aspect-square backdrop-blur-sm">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-transparent to-bg-base/80 z-10" />

              {/* Status badge */}
              <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-accent-light to-accent">
                  <svg width="20" height="22" viewBox="0 0 20 22" fill="#002a78">
                    <path d="M10 2a6 6 0 0 0-6 6v3l-2 3h16l-2-3V8a6 6 0 0 0-6-6zm0 18a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-(family-name:--font-space-mono) text-sm text-accent-light">
                    STATUS: READY
                  </p>
                  <p className="font-(family-name:--font-space-mono) text-lg font-bold text-text-primary">
                    Obsidian Engine v2.4
                  </p>
                </div>
              </div>

              {/* Background pattern */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" viewBox="0 0 480 480" fill="none">
                  {Array.from({ length: 8 }).map((_, i) =>
                    Array.from({ length: 8 }).map((_, j) => (
                      <rect
                        key={`${i}-${j}`}
                        x={i * 60 + 10}
                        y={j * 60 + 10}
                        width="40"
                        height="40"
                        rx="4"
                        fill="#434654"
                        opacity={0.3}
                      />
                    )),
                  )}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Loading State ─── */}
      {mutation.isPending && (
        <section className="mx-auto max-w-7xl px-8 pb-8">
          <LoadingState status={mutation.pipelineStatus} progress={mutation.progress} />
        </section>
      )}

      {/* ─── Error State ─── */}
      {mutation.isError && (
        <section className="mx-auto max-w-7xl px-8 pb-8">
          <div className="rounded-2xl bg-red-900/20 border border-red-500/20 px-8 py-6 flex items-center justify-between">
            <div>
              <p className="font-(family-name:--font-space-grotesk) font-bold text-red-300">
                분석 실패
              </p>
              <p className="font-(family-name:--font-inter) text-sm text-red-400 mt-1">
                {mutation.error?.message ?? "알 수 없는 오류가 발생했습니다."}
              </p>
            </div>
            <button
              onClick={() => mutation.reset()}
              className="font-(family-name:--font-inter) text-sm font-semibold text-red-300 hover:text-red-200 underline"
            >
              다시 시도
            </button>
          </div>
        </section>
      )}

      {/* ─── Result Section ─── */}
      {mutation.isSuccess && mutation.data && (
        <section className="mx-auto max-w-7xl px-8 pb-16 flex flex-col gap-8">
          {/* Video metadata */}
          <VideoCard
            meta={{
              title: mutation.data.title,
              thumbnailUrl: mutation.data.thumbnailUrl,
              channelName: mutation.data.channelName,
              tempo: mutation.data.tempo,
              key: mutation.data.key,
            }}
            onShare={() => {
              const id = mutation.data!.id;
              if (id) navigator.clipboard?.writeText(`${window.location.origin}/result/${id}`);
            }}
          />

          {/* Timeline */}
          <ChordTimeline
            chords={mutation.data.chords}
            activeChord={activeChord}
            onSelect={setActiveChord}
          />

          {/* Chord grid */}
          <ChordGrid chords={mutation.data.chords.map((c) => c.chord)} activeChord={activeChord} />

          {/* Share CTA */}
          <div className="flex justify-center pt-4">
            <ShareButton
              url={
                mutation.data.id
                  ? `${window.location.origin}/result/${mutation.data.id}`
                  : undefined
              }
            />
          </div>
        </section>
      )}
    </main>
  );
}
