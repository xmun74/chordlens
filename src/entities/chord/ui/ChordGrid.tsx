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
    <section>
      <h2 className="font-(family-name:--font-space-grotesk) text-xl font-bold text-text-primary mb-6">
        Vocabulary
      </h2>

      <div className="flex items-center justify-center gap-6">
        {/* 이전 코드 */}
        <div className="flex flex-col items-center gap-2 opacity-80 transition-opacity duration-300">
          {prev ? (
            <>
              <span className="font-(family-name:--font-space-mono) text-xs text-text-secondary/60 tabular-nums">
                {prev.time}
              </span>
              <ChordDiagram chordName={prev.chord} size="sm" />
            </>
          ) : (
            <div className="w-[202px] h-[160px]" />
          )}
        </div>

        {/* 현재 코드 (크게, 강조) */}
        <div className="flex flex-col items-center gap-2 transition-all duration-300 scale-110">
          {current ? (
            <>
              <span className="font-[(--font-space-mono)] text-xs text-accent-light/70 tabular-nums">
                {current.time}
              </span>
              <ChordDiagram chordName={current.chord} isActive size="lg" />
            </>
          ) : (
            <div className="w-[190px] h-[240px]" />
          )}
        </div>

        {/* 다음 코드 */}
        <div className="flex flex-col items-center gap-2 opacity-80 transition-opacity duration-300">
          {next ? (
            <>
              <span className="font-(family-name:--font-space-mono) text-xs text-text-secondary/60 tabular-nums">
                {next.time}
              </span>
              <ChordDiagram chordName={next.chord} size="sm" />
            </>
          ) : (
            <div className="w-[202px] h-[160px]" />
          )}
        </div>
      </div>
    </section>
  );
}
