import type { ChordEntry } from "@/shared/model";
import { ChordDiagram } from "./ChordDiagram";

interface Props {
  allChords: ChordEntry[];
  activeChordIdx: number;
}

export function ChordGrid({ allChords, activeChordIdx }: Props) {
  const prev = activeChordIdx > 0 ? allChords[activeChordIdx - 1] : null;
  const current = allChords[activeChordIdx] ?? null;
  const next = activeChordIdx < allChords.length - 1 ? allChords[activeChordIdx + 1] : null;

  return (
    <section className="min-w-0">
      <h2 className="mb-6 font-heading text-xl font-bold text-text-primary">Vocabulary</h2>

      <div className="overflow-x-auto pb-3 [scrollbar-width:thin]">
        <div className="flex min-w-max items-center justify-start gap-4 px-2 sm:gap-6 md:min-w-0 md:justify-center">
        {/* 이전 코드 */}
        <div className="flex flex-col items-center gap-2 opacity-80 transition-opacity duration-300">
          {prev ? (
            <>
              <span className="font-mono text-sm text-text-secondary/60 tabular-nums">
                {prev.time}
              </span>
              <ChordDiagram
                chordName={prev.chord}
                size="sm"
                fret={prev.fret}
                voicing={prev.voicing}
              />
            </>
          ) : (
            <div className="w-[202px] h-[160px]" />
          )}
        </div>

        {/* 현재 코드 (크게, 강조) */}
        <div className="flex flex-col items-center gap-2 transition-all duration-300 scale-110">
          {current ? (
            <>
              <span className="font-mono text-sm font-bold text-accent-light/70 tabular-nums">
                {current.time}
              </span>
              <ChordDiagram
                chordName={current.chord}
                isActive
                size="lg"
                fret={current.fret}
                voicing={current.voicing}
              />
            </>
          ) : (
            <div className="w-[190px] h-[240px]" />
          )}
        </div>

        {/* 다음 코드 */}
        <div className="flex flex-col items-center gap-2 opacity-80 transition-opacity duration-300">
          {next ? (
            <>
              <span className="font-mono text-sm text-text-secondary/60 tabular-nums">
                {next.time}
              </span>
              <ChordDiagram
                chordName={next.chord}
                size="sm"
                fret={next.fret}
                voicing={next.voicing}
              />
            </>
          ) : (
            <div className="w-[202px] h-[160px]" />
          )}
        </div>
        </div>
      </div>
    </section>
  );
}
