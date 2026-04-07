/** Normalize chord name: "Am" -> "Am", "a minor" -> "Am" */
export function normalizeChordName(raw: string): string {
  return raw.trim();
}

/** Format seconds to MM:SS string */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Vexchords finger positions for common chords.
 * Format: [string(1=low E, 6=high e), fret, finger]
 */
export const CHORD_SHAPES: Record<
  string,
  {
    fingers: [number, number, number][];
    barres?: { fret: number; fromString: number; toString: number }[];
    position?: number;
  }
> = {
  Am: {
    fingers: [
      [2, 1, 1],
      [3, 2, 2],
      [4, 2, 3],
    ],
    position: 1,
  },
  A: {
    fingers: [
      [2, 2, 1],
      [3, 2, 2],
      [4, 2, 3],
    ],
    position: 1,
  },
  Am7: { fingers: [[2, 1, 1]], position: 1 },
  C: {
    fingers: [
      [2, 1, 1],
      [4, 2, 2],
      [5, 3, 3],
    ],
    position: 1,
  },
  D: {
    fingers: [
      [1, 2, 1],
      [2, 3, 2],
      [3, 2, 3],
    ],
    position: 1,
  },
  Dm: {
    fingers: [
      [1, 1, 1],
      [2, 3, 3],
      [3, 2, 2],
    ],
    position: 1,
  },
  E: {
    fingers: [
      [3, 1, 1],
      [4, 2, 2],
      [5, 2, 3],
    ],
    position: 1,
  },
  Em: {
    fingers: [
      [4, 2, 1],
      [5, 2, 2],
    ],
    position: 1,
  },
  F: {
    fingers: [
      [2, 1, 2],
      [3, 2, 3],
      [4, 3, 4],
    ],
    barres: [{ fret: 1, fromString: 1, toString: 6 }],
    position: 1,
  },
  G: {
    fingers: [
      [1, 3, 2],
      [5, 2, 1],
      [6, 3, 3],
    ],
    position: 1,
  },
  Bm: {
    fingers: [
      [2, 2, 2],
      [3, 4, 4],
      [4, 4, 3],
    ],
    barres: [{ fret: 2, fromString: 1, toString: 5 }],
    position: 2,
  },
  B7: {
    fingers: [
      [2, 2, 3],
      [3, 1, 1],
      [4, 2, 2],
      [6, 2, 4],
    ],
    position: 1,
  },
};

export function getChordShape(chordName: string) {
  const normalized = chordName.trim();
  return CHORD_SHAPES[normalized] ?? null;
}
