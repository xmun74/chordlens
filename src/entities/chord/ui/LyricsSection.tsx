"use client";

import type { LyricLine, ChordEntry } from "@/shared/model";

interface Props {
  lyrics: LyricLine[];
  chords: ChordEntry[];
  activeChord?: string | null;
  onSelect?: (chord: string) => void;
}

function timeToSeconds(time: string): number {
  const [m, s] = time.split(":").map(Number);
  return m * 60 + s;
}

function getChordsForLine(line: LyricLine, lines: LyricLine[], chords: ChordEntry[]): ChordEntry[] {
  const start = timeToSeconds(line.time);
  const nextLine = lines[lines.indexOf(line) + 1];
  const end = nextLine ? timeToSeconds(nextLine.time) : Infinity;

  return chords.filter((c) => {
    const t = timeToSeconds(c.time);
    return t >= start && t < end;
  });
}

export function LyricsSection({ lyrics, chords, activeChord, onSelect }: Props) {
  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-text-primary mb-4">Lyrics & Chords</h2>

      <div className="rounded-2xl bg-bg-dark px-6 py-6 flex flex-col gap-6">
        {lyrics.map((line, idx) => {
          const lineChords = getChordsForLine(line, lyrics, chords);

          return (
            <div key={`${line.time}-${idx}`} className="flex flex-col gap-2">
              {/* 가사 */}
              <p className="font-heading text-base text-text-primary leading-relaxed">
                {line.text}
              </p>

              {/* 코드 */}
              {lineChords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {lineChords.map((entry, cIdx) => {
                    const isActive = entry.chord === activeChord;
                    return (
                      <button
                        key={`${entry.time}-${cIdx}`}
                        onClick={() => onSelect?.(entry.chord)}
                        className="flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light rounded-lg"
                        aria-pressed={isActive}
                        aria-label={`${entry.time} ${entry.chord}`}
                      >
                        <span className="font-mono text-xs text-text-secondary">{entry.time}</span>
                        {isActive ? (
                          <span className="font-mono text-sm font-bold text-accent-deep bg-gradient-to-br from-accent-light to-accent px-2.5 py-1 rounded-lg shadow-[0_0_10px_rgba(97,139,255,0.4)]">
                            {entry.chord}
                          </span>
                        ) : (
                          <span className="font-mono text-sm font-bold text-accent-light bg-accent-light/20 border border-accent-light/50 hover:bg-accent-light/30 transition-colors px-2.5 py-1 rounded-lg">
                            {entry.chord}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
