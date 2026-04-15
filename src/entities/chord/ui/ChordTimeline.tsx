"use client";

import { useRef } from "react";
import type { ChordEntry } from "@/shared/model";

interface Props {
  chords: ChordEntry[];
  activeChord?: string | null;
  onSelect?: (chord: string) => void;
}

export function ChordTimeline({ chords, activeChord, onSelect }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-bold text-text-primary">Timeline</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-11 w-11 items-center justify-center rounded text-text-secondary hover:text-text-primary transition-colors"
            aria-label="이전으로 스크롤"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M8 2L4 6l4 4" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-11 w-11 items-center justify-center rounded text-text-secondary hover:text-text-primary transition-colors"
            aria-label="다음으로 스크롤"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M4 2l4 4-4 4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Timeline scroll container */}
      <div className="relative rounded-2xl bg-bg-dark overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-bg-dark to-transparent z-10" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg-dark to-transparent z-10" />

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-6 py-6 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {chords.map((entry, idx) => {
            const isActive = entry.chord === activeChord;
            return (
              <button
                key={`${entry.time}-${idx}`}
                onClick={() => onSelect?.(entry.chord)}
                className="flex flex-col items-center gap-1 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light rounded-xl"
                aria-pressed={isActive}
                aria-label={`${entry.time} ${entry.chord}`}
              >
                {/* Time label */}
                <span className="font-mono text-xs text-text-secondary">{entry.time}</span>

                {/* Chord chip */}
                {isActive ? (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-accent-light to-accent shadow-[0_0_16px_rgba(97,139,255,0.4)]">
                    <span className="font-mono text-2xl font-bold text-accent-deep">
                      {entry.chord}
                    </span>
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-accent-light/20 border border-accent-light/50 hover:bg-accent-light/30 transition-colors">
                    <span className="font-mono text-xl font-bold text-accent-light">
                      {entry.chord}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
