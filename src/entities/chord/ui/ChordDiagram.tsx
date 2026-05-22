"use client";

import { useEffect, useRef } from "react";

interface Props {
  chordName: string;
  isActive?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  fret?: number;
  voicing?: "open" | "barre";
}

const SIZES = {
  xs: { w: 64, h: 76 },
  sm: { w: 120, h: 136 },
  md: { w: 160, h: 180 },
  lg: { w: 190, h: 214 },
};

type ChordShape = {
  // [string, fret, finger?]  string 1=high e, 6=low E  /  finger 1=index … 4=pinky
  fingers: [number, number, number?][];
  barres?: { fret: number; fromString: number; toString: number }[];
  position?: number;
};

// Finger positions for common chords
const CHORD_DATA: Record<string, ChordShape> = {
  // ── Open chords ──
  Am: {
    fingers: [
      [2, 1, 1],
      [3, 2, 3],
      [4, 2, 2],
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
  Am7: {
    fingers: [
      [2, 1, 1],
      [4, 2, 2],
    ],
    position: 1,
  },
  A7: {
    fingers: [
      [2, 2, 2],
      [4, 2, 3],
    ],
    position: 1,
  },
  Amaj7: {
    fingers: [
      [2, 2, 1],
      [3, 2, 2],
      [4, 2, 3],
    ],
    position: 1,
  },
  C: {
    fingers: [
      [2, 1, 1],
      [4, 2, 2],
      [5, 3, 3],
    ],
    position: 1,
  },
  Cm: {
    fingers: [
      [2, 1, 2],
      [3, 2, 3],
      [4, 3, 4],
    ],
    barres: [{ fret: 1, fromString: 1, toString: 5 }],
    position: 3,
  },
  Cmaj7: {
    fingers: [
      [4, 2, 2],
      [5, 3, 3],
    ],
    position: 1,
  },
  C7: {
    fingers: [
      [2, 1, 1],
      [3, 3, 3],
      [4, 2, 2],
    ],
    position: 1,
  },
  D: {
    fingers: [
      [1, 2, 2],
      [2, 3, 3],
      [3, 2, 1],
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
  Dm7: {
    fingers: [
      [1, 1, 1],
      [2, 1, 2],
      [3, 2, 3],
    ],
    position: 1,
  },
  D7: {
    fingers: [
      [1, 2, 2],
      [2, 1, 1],
      [3, 2, 3],
    ],
    position: 1,
  },
  E: {
    fingers: [
      [3, 1, 1],
      [4, 2, 3],
      [5, 2, 2],
    ],
    position: 1,
  },
  Em: {
    fingers: [
      [4, 2, 2],
      [5, 2, 3],
    ],
    position: 1,
  },
  Em7: {
    fingers: [
      [4, 2, 2],
      [5, 2, 3],
    ],
    position: 1,
  },
  E7: {
    fingers: [
      [2, 1, 1],
      [3, 1, 2],
      [5, 2, 3],
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
  Fm: {
    fingers: [
      [3, 1, 2],
      [4, 3, 3],
      [5, 3, 4],
    ],
    barres: [{ fret: 1, fromString: 1, toString: 6 }],
    position: 1,
  },
  Fmaj7: {
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
      [1, 3, 4],
      [5, 2, 1],
      [6, 3, 2],
    ],
    position: 1,
  },
  Gm: {
    fingers: [
      [2, 1, 2],
      [3, 3, 3],
      [4, 3, 4],
    ],
    barres: [{ fret: 3, fromString: 1, toString: 6 }],
    position: 3,
  },
  G7: {
    fingers: [
      [1, 1, 1],
      [5, 2, 2],
      [6, 3, 3],
    ],
    position: 1,
  },
  Gmaj7: {
    fingers: [
      [1, 2, 2],
      [5, 2, 3],
      [6, 3, 4],
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
  Bm7: {
    fingers: [
      [2, 2, 2],
      [3, 2, 3],
      [4, 2, 4],
    ],
    barres: [{ fret: 2, fromString: 1, toString: 5 }],
    position: 2,
  },
  B7: {
    fingers: [
      [2, 2, 2],
      [3, 1, 1],
      [4, 2, 3],
      [6, 2, 4],
    ],
    position: 1,
  },
  // ── Barre chords ──
  "A#": {
    fingers: [
      [2, 1, 2],
      [3, 1, 3],
      [4, 1, 4],
    ],
    barres: [{ fret: 1, fromString: 1, toString: 5 }],
    position: 1,
  },
  "A#m": {
    fingers: [
      [3, 1, 2],
      [4, 3, 3],
      [5, 3, 4],
    ],
    barres: [{ fret: 1, fromString: 1, toString: 6 }],
    position: 1,
  },
  Bb: {
    fingers: [
      [2, 1, 2],
      [3, 1, 3],
      [4, 1, 4],
    ],
    barres: [{ fret: 1, fromString: 1, toString: 5 }],
    position: 1,
  },
  Bbm: {
    fingers: [
      [3, 1, 2],
      [4, 3, 3],
      [5, 3, 4],
    ],
    barres: [{ fret: 1, fromString: 1, toString: 6 }],
    position: 1,
  },
  B: {
    fingers: [
      [2, 1, 2],
      [3, 1, 3],
      [4, 1, 4],
    ],
    barres: [{ fret: 2, fromString: 1, toString: 5 }],
    position: 2,
  },
  "C#": {
    fingers: [
      [2, 1, 2],
      [3, 1, 3],
      [4, 1, 4],
    ],
    barres: [{ fret: 4, fromString: 1, toString: 5 }],
    position: 4,
  },
  "C#m": {
    fingers: [
      [2, 2, 2],
      [3, 4, 4],
      [4, 4, 3],
    ],
    barres: [{ fret: 4, fromString: 1, toString: 5 }],
    position: 4,
  },
  Db: {
    fingers: [
      [2, 1, 2],
      [3, 1, 3],
      [4, 1, 4],
    ],
    barres: [{ fret: 4, fromString: 1, toString: 5 }],
    position: 4,
  },
  "D#": {
    fingers: [
      [2, 1, 2],
      [3, 1, 3],
      [4, 1, 4],
    ],
    barres: [{ fret: 1, fromString: 1, toString: 5 }],
    position: 3,
  },
  "D#m": {
    fingers: [
      [3, 1, 2],
      [4, 3, 3],
      [5, 3, 4],
    ],
    barres: [{ fret: 3, fromString: 1, toString: 6 }],
    position: 3,
  },
  Eb: {
    fingers: [
      [2, 1, 2],
      [3, 1, 3],
      [4, 1, 4],
    ],
    barres: [{ fret: 1, fromString: 1, toString: 5 }],
    position: 3,
  },
  "F#": {
    fingers: [
      [2, 2, 2],
      [3, 2, 3],
      [4, 2, 4],
    ],
    barres: [{ fret: 2, fromString: 1, toString: 5 }],
    position: 2,
  },
  "F#m": {
    fingers: [
      [2, 2, 2],
      [3, 4, 4],
      [4, 4, 3],
    ],
    barres: [{ fret: 2, fromString: 1, toString: 5 }],
    position: 2,
  },
  "G#": {
    fingers: [
      [2, 1, 2],
      [3, 1, 3],
      [4, 1, 4],
    ],
    barres: [{ fret: 1, fromString: 1, toString: 5 }],
    position: 4,
  },
  "G#m": {
    fingers: [
      [3, 1, 2],
      [4, 3, 3],
      [5, 3, 4],
    ],
    barres: [{ fret: 4, fromString: 1, toString: 6 }],
    position: 4,
  },
  Ab: {
    fingers: [
      [2, 1, 2],
      [3, 1, 3],
      [4, 1, 4],
    ],
    barres: [{ fret: 1, fromString: 1, toString: 5 }],
    position: 4,
  },
  Abm: {
    fingers: [
      [3, 1, 2],
      [4, 3, 3],
      [5, 3, 4],
    ],
    barres: [{ fret: 4, fromString: 1, toString: 6 }],
    position: 4,
  },
};

/**
 * 코드명에서 가장 가까운 CHORD_DATA 항목을 찾는다.
 * 1. 정확히 일치
 * 2. 슬래시 코드 → 루트만 사용 (F/G → F)
 * 3. 확장 코드 → 루트+장단조만 사용 (Cm7b5 → Cm, Cmaj7 → C)
 */
function resolveChordData(name: string): ChordShape | null {
  if (CHORD_DATA[name]) return CHORD_DATA[name];

  // 슬래시 코드 처리
  const slashIdx = name.indexOf("/");
  const base = slashIdx !== -1 ? name.slice(0, slashIdx) : name;
  if (CHORD_DATA[base]) return CHORD_DATA[base];

  // 루트 + 장단조만 추출 (예: Cm7b5 → Cm, Amaj7 → A, B7 → B)
  const m = base.match(/^([A-G][#b]?)(m(?!aj))?/);
  if (m) {
    const simplified = m[1] + (m[2] ?? "");
    if (CHORD_DATA[simplified]) return CHORD_DATA[simplified];
  }

  return null;
}

function buildBarreFallback(fret: number): ChordShape {
  return {
    fingers: [],
    barres: [{ fret: 1, fromString: 1, toString: 6 }],
    position: fret,
  };
}

export function ChordDiagram({ chordName, isActive = false, size = "md", fret, voicing }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { w, h } = SIZES[size];
  const isCompact = size === "xs";

  useEffect(() => {
    if (!ref.current) return;

    const drawChord = async () => {
      try {
        const { ChordBox } = await import("vexchords");
        if (!ref.current) return;
        ref.current.innerHTML = "";

        const staticData = resolveChordData(chordName);
        const data =
          staticData ??
          (voicing === "barre" && fret != null && fret >= 1 ? buildBarreFallback(fret) : null);
        const fingers = data?.fingers ?? [];
        const barres = data?.barres ?? [];
        const position = data?.position ?? 1;

        const box = new ChordBox(ref.current, {
          width: w,
          height: h,
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

        // Re-color finger dots + manually add finger labels (vexchords only renders labels when chord.length > 2)
        const circles = ref.current.querySelectorAll("circle");
        const filledCircles: Element[] = [];
        circles.forEach((c) => {
          const fill = c.getAttribute("fill");
          if (fill && fill !== "none" && fill !== "transparent") {
            c.setAttribute("fill", isActive ? "#b4c5ff" : "#618bff");
            filledCircles.push(c);
          }
        });

        if (fingers.length <= 2) {
          const svg = ref.current.querySelector("svg");
          filledCircles.forEach((circle, i) => {
            const fingerNum = fingers[i]?.[2];
            if (fingerNum === undefined || !svg) return;
            const cx = parseFloat(circle.getAttribute("cx") ?? "0");
            const cy = parseFloat(circle.getAttribute("cy") ?? "0");
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", String(cx));
            text.setAttribute("y", String(cy + 4));
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("fill", isActive ? "#002a78" : "#e2e2eb");
            text.setAttribute("font-size", "11");
            text.setAttribute("font-family", "Space Mono");
            text.textContent = String(fingerNum);
            circle.parentNode?.insertBefore(text, circle.nextSibling);
          });
        }

        // Re-color barre
        const rects = ref.current.querySelectorAll("rect");
        rects.forEach((r) => {
          const fill = r.getAttribute("fill");
          if (fill && fill !== "none") {
            r.setAttribute("fill", isActive ? "#b4c5ff" : "#618bff");
          }
        });

        // Update position text: "N" → "Nfr"
        if (position > 1) {
          const svgTexts = ref.current.querySelectorAll("text");
          if (svgTexts.length > 0) {
            const posEl = svgTexts[0];
            const tspan = posEl.querySelector("tspan");
            const target = tspan ?? posEl;
            if (target.textContent?.trim() === String(position)) {
              target.textContent = `${position}fr`;
            }
          }
        }
      } catch {
        // vexchords unavailable, render placeholder
        if (ref.current) {
          ref.current.innerHTML = `<div style="width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:center;color:#434654;font-size:12px;">${chordName}</div>`;
        }
      }
    };

    drawChord();
  }, [chordName, isActive, w, h, fret, voicing]);

  return (
    <article
      className={[
        "flex min-w-0 flex-col border transition-all duration-200",
        isCompact ? "rounded-xl" : "rounded-2xl",
        isActive
          ? "bg-bg-card border-accent-light/60 shadow-[0_0_24px_rgba(180,197,255,0.15)]"
          : "bg-bg-card border-border/10 hover:border-border/40",
      ].join(" ")}
      aria-label={`${chordName} 코드 다이어그램`}
    >
      {/* Header */}
      <div
        className={[
          "flex min-w-0 items-center justify-between",
          isCompact ? "px-2 pt-2 pb-1" : "px-6 pt-5 pb-2",
        ].join(" ")}
      >
        <span
          className={[
            "min-w-0 truncate font-mono font-bold",
            isCompact ? "text-sm" : "text-2xl",
            isActive ? "text-accent-light" : "text-accent-light",
          ].join(" ")}
        >
          {chordName}
        </span>
        {isActive && (
          <span
            className={[
              "shrink-0 rounded-full bg-accent-light animate-pulse",
              isCompact ? "h-1.5 w-1.5" : "h-2 w-2",
            ].join(" ")}
          />
        )}
      </div>

      {/* Diagram */}
      <div
        className={[
          "bg-bg-dark",
          isCompact ? "mx-2 mb-2 rounded-md px-1 py-1" : "mx-6 mb-4 rounded-lg px-4 py-3",
        ].join(" ")}
      >
        <div ref={ref} />
      </div>
    </article>
  );
}
