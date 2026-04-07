"use client";

import { useEffect, useRef } from "react";

interface Props {
  chordName: string;
  isActive?: boolean;
}

// Finger positions for common chords: [string (1=high e, 6=low E), fret]
const CHORD_DATA: Record<
  string,
  {
    fingers: [number, number][];
    barres?: { fret: number; fromString: number; toString: number }[];
    position?: number;
    tuning?: string[];
  }
> = {
  Am: {
    fingers: [
      [2, 1],
      [3, 2],
      [4, 2],
    ],
    position: 1,
  },
  A: {
    fingers: [
      [2, 2],
      [3, 2],
      [4, 2],
    ],
    position: 1,
  },
  Am7: { fingers: [[2, 1]], position: 1 },
  C: {
    fingers: [
      [2, 1],
      [4, 2],
      [5, 3],
    ],
    position: 1,
  },
  D: {
    fingers: [
      [1, 2],
      [2, 3],
      [3, 2],
    ],
    position: 1,
  },
  Dm: {
    fingers: [
      [1, 1],
      [2, 3],
      [3, 2],
    ],
    position: 1,
  },
  E: {
    fingers: [
      [3, 1],
      [4, 2],
      [5, 2],
    ],
    position: 1,
  },
  Em: {
    fingers: [
      [4, 2],
      [5, 2],
    ],
    position: 1,
  },
  Em7: {
    fingers: [
      [4, 2],
      [5, 2],
    ],
    position: 1,
  },
  F: {
    fingers: [
      [2, 1],
      [3, 2],
      [4, 3],
    ],
    barres: [{ fret: 1, fromString: 1, toString: 6 }],
    position: 1,
  },
  G: {
    fingers: [
      [1, 3],
      [5, 2],
      [6, 3],
    ],
    position: 1,
  },
  Bm: {
    fingers: [
      [2, 2],
      [3, 4],
      [4, 4],
    ],
    barres: [{ fret: 2, fromString: 1, toString: 5 }],
    position: 2,
  },
  B7: {
    fingers: [
      [2, 2],
      [3, 1],
      [4, 2],
      [6, 2],
    ],
    position: 1,
  },
};

export function ChordDiagram({ chordName, isActive = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const drawChord = async () => {
      try {
        const { ChordBox } = await import("vexchords");
        if (!ref.current) return;
        ref.current.innerHTML = "";

        const data = CHORD_DATA[chordName];
        const fingers = data?.fingers ?? [];
        const barres = data?.barres ?? [];
        const position = data?.position ?? 1;

        const box = new ChordBox(ref.current, {
          width: 160,
          height: 180,
          strokeColor: "#434654",
          textColor: "#c3c6d7",
          stringColor: "#434654",
          fretColor: "#434654",
          labelColor: isActive ? "#002a78" : "#e2e2eb",
          bgColor: "transparent",
          fontFamily: "Space Mono",
          fontSize: 11,
          numFrets: 5,
          numStrings: 6,
          showTuning: false,
          bridgeColor: isActive ? "#b4c5ff" : "#434654",
        });

        box.draw({
          chord: fingers,
          position,
          barres,
          tuning: [],
        });

        // Re-color finger dots
        const circles = ref.current.querySelectorAll("circle");
        circles.forEach((c) => {
          const fill = c.getAttribute("fill");
          if (fill && fill !== "none" && fill !== "transparent") {
            c.setAttribute("fill", isActive ? "#b4c5ff" : "#618bff");
          }
        });

        // Re-color barre
        const rects = ref.current.querySelectorAll("rect");
        rects.forEach((r) => {
          const fill = r.getAttribute("fill");
          if (fill && fill !== "none") {
            r.setAttribute("fill", isActive ? "#b4c5ff" : "#618bff");
          }
        });
      } catch {
        // vexchords unavailable, render placeholder
        if (ref.current) {
          ref.current.innerHTML = `<div style="width:160px;height:180px;display:flex;align-items:center;justify-content:center;color:#434654;font-size:12px;">${chordName}</div>`;
        }
      }
    };

    drawChord();
  }, [chordName, isActive]);

  return (
    <article
      className={[
        "flex flex-col rounded-2xl border transition-all duration-200",
        isActive
          ? "bg-bg-card border-accent-light/60 shadow-[0_0_24px_rgba(180,197,255,0.15)]"
          : "bg-bg-card border-border/10 hover:border-border/40",
      ].join(" ")}
      aria-label={`${chordName} 코드 다이어그램`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-2">
        <span
          className={[
            "font-[family-name:var(--font-space-mono)] text-2xl font-bold",
            isActive ? "text-accent-light" : "text-accent-light",
          ].join(" ")}
        >
          {chordName}
        </span>
        {isActive && <span className="h-2 w-2 rounded-full bg-accent-light animate-pulse" />}
      </div>

      {/* Diagram */}
      <div className="mx-auto rounded-lg bg-bg-dark px-4 py-3 mb-4 mx-6">
        <div ref={ref} />
      </div>
    </article>
  );
}
