"use client";

import type { ExtractStatus } from "@/shared/model";

interface Step {
  id: ExtractStatus;
  label: string;
  subLabel: string;
}

const STEPS: Step[] = [
  { id: "extracting", label: "Extracting Audio", subLabel: "Isolation complete" },
  { id: "recognizing", label: "Analyzing Chords", subLabel: "Identifying frequency peaks..." },
  { id: "done", label: "Finalizing Tab", subLabel: "Generating charts" },
];

interface Props {
  status: ExtractStatus;
  progress?: number; // 0-100
}

function stepIndex(status: ExtractStatus): number {
  if (status === "extracting") return 0;
  if (status === "recognizing") return 1;
  if (status === "done") return 2;
  return -1;
}

export function LoadingState({ status, progress }: Props) {
  const currentIdx = stepIndex(status);
  const pct = progress ?? (currentIdx >= 0 ? Math.min(100, (currentIdx + 0.5) * 40) : 0);
  const pctLabel = `${Math.round(pct)}% COMPLETE`;

  return (
    <div className="rounded-2xl bg-bg-dark border border-border/5 px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-text-primary">
          Analysis Pipeline
        </h3>
        <span className="font-[family-name:var(--font-space-mono)] text-sm tracking-widest text-accent-light">
          {pctLabel}
        </span>
      </div>

      {/* Steps */}
      <div className="flex items-start gap-0 mb-8">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isPending = idx > currentIdx;

          return (
            <div key={step.id} className="flex items-center flex-1 min-w-0">
              {/* Step item */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Circle */}
                <div className="shrink-0">
                  {isDone ? (
                    <div className="h-10 w-10 rounded-full bg-accent-light flex items-center justify-center">
                      <svg
                        width="12"
                        height="10"
                        viewBox="0 0 12 10"
                        fill="none"
                        stroke="#002a78"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 5l3.5 3.5L11 1" />
                      </svg>
                    </div>
                  ) : isCurrent ? (
                    <div className="h-10 w-10 rounded-full border-2 border-accent flex items-center justify-center relative">
                      <div className="h-[10px] w-[10px] rounded-full bg-accent" />
                      {/* Spinning ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-accent-light border-t-transparent animate-spin" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full border-2 border-border flex items-center justify-center">
                      <svg
                        width="14"
                        height="8"
                        viewBox="0 0 14 8"
                        fill="none"
                        stroke="#434654"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      >
                        <path d="M1 1h12M1 7h12" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Labels */}
                <div className="min-w-0">
                  <p
                    className={[
                      "font-[family-name:var(--font-inter)] text-sm font-semibold truncate",
                      isPending ? "text-text-primary/40" : "text-text-primary",
                    ].join(" ")}
                  >
                    {step.label}
                  </p>
                  <p
                    className={[
                      "font-[family-name:var(--font-inter)] text-xs truncate",
                      isPending ? "text-text-secondary/40" : "text-text-secondary",
                    ].join(" ")}
                  >
                    {isCurrent ? step.subLabel : isDone ? "Complete" : step.subLabel}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {idx < STEPS.length - 1 && <div className="flex-1 h-px mx-4 bg-border/30 min-w-4" />}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-bg-input overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-light to-accent transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
