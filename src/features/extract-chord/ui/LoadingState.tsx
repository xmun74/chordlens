"use client";

import type { ExtractStatus } from "../model/types";

const STEPS = [
  {
    id: "extracting" as ExtractStatus,
    num: "01",
    label: "Audio Extract",
    activeDetail: "Decoding stream",
    doneDetail: "Stream isolated",
  },
  {
    id: "recognizing" as ExtractStatus,
    num: "02",
    label: "Chord Analysis",
    activeDetail: "Mapping peaks",
    doneDetail: "Frequencies mapped",
  },
  {
    id: "done" as ExtractStatus,
    num: "03",
    label: "Tab Render",
    activeDetail: "Writing tablature",
    doneDetail: "Charts generated",
  },
] as const;

const BAR_HEIGHTS = [4, 8, 13, 6, 11, 7, 5, 10, 6, 12];

function stepIndex(status: ExtractStatus): number {
  if (status === "extracting") return 0;
  if (status === "recognizing") return 1;
  if (status === "done") return 2;
  return -1;
}

function FreqBars() {
  return (
    <div className="flex items-end gap-[2px]" style={{ height: 12 }}>
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="w-[2px] rounded-sm"
          style={{
            height: Math.round(h * 0.85),
            transformOrigin: "bottom",
            background: "linear-gradient(to top, #618bff, #b4c5ff)",
            animation: `ls-freq ${0.38 + i * 0.055}s cubic-bezier(0.32,0.72,0,1) infinite alternate`,
            animationDelay: `${i * 32}ms`,
          }}
        />
      ))}
    </div>
  );
}

interface Props {
  status: ExtractStatus;
  progress?: number;
}

export function LoadingState({ status, progress }: Props) {
  const currentIdx = stepIndex(status);
  const pct = progress ?? (currentIdx >= 0 ? Math.min(100, (currentIdx + 0.5) * 40) : 0);
  const pctStr = Math.round(pct).toString().padStart(3, "0");

  return (
    <>
      {/* Double-Bezel outer shell */}
      <div
        className="relative p-[3px] rounded-[1.75rem]"
        style={{
          background:
            "linear-gradient(135deg, rgba(97,139,255,0.28) 0%, rgba(97,139,255,0.05) 50%, rgba(180,197,255,0.12) 100%)",
        }}
      >
        {/* Ambient radial glow */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-[1.75rem] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(97,139,255,0.14) 0%, transparent 70%)",
            animation: "ls-breathe 3.2s ease-in-out infinite",
          }}
        />

        {/* Inner core */}
        <div
          className="relative rounded-[calc(1.75rem-3px)] overflow-hidden"
          style={{
            background: "#0c0e14",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.055)",
          }}
        >
          <div className="px-7 pt-6 pb-7">
            {/* Eyebrow row */}
            <div className="flex items-center justify-between mb-8">
              <div
                className="inline-flex items-center gap-[7px] px-3 py-1 rounded-full"
                style={{
                  background: "rgba(97,139,255,0.07)",
                  border: "1px solid rgba(97,139,255,0.18)",
                }}
              >
                <span
                  className="block w-[5px] h-[5px] rounded-full bg-accent shrink-0"
                  style={{ animation: "ls-orb-glow 1.8s ease-in-out infinite" }}
                />
                <span className="font-mono text-[9px] tracking-[0.22em] text-accent-light/55 uppercase select-none">
                  Analysis Pipeline
                </span>
              </div>
              <span className="font-mono text-[11px] tabular-nums text-accent-light/50">
                {pctStr}
                <span className="text-text-secondary/20">%</span>
              </span>
            </div>

            {/* Horizontal stepper */}
            <div>
              {/* Row 1: nodes + connector lines in a single flex row — no overlap */}
              <div className="flex items-center">
                {STEPS.map((step, idx) => {
                  const isDone = idx < currentIdx;
                  const isCurrent = idx === currentIdx;
                  const connectorFilled = idx < currentIdx;

                  return (
                    <div key={step.id} className="contents">
                      {/* Node circle */}
                      <div
                        className="shrink-0 flex items-center justify-center rounded-full"
                        style={{
                          width: 32,
                          height: 32,
                          background: isDone
                            ? "rgba(97,139,255,0.18)"
                            : isCurrent
                              ? "rgba(97,139,255,0.15)"
                              : "rgba(255,255,255,0.04)",
                          border: isCurrent
                            ? "1.5px solid rgba(97,139,255,0.7)"
                            : isDone
                              ? "1.5px solid rgba(97,139,255,0.3)"
                              : "1.5px solid rgba(255,255,255,0.08)",
                          boxShadow: isCurrent ? "0 0 12px 3px rgba(97,139,255,0.35)" : "none",
                          transition:
                            "background 600ms cubic-bezier(0.32,0.72,0,1), border-color 600ms cubic-bezier(0.32,0.72,0,1), box-shadow 600ms cubic-bezier(0.32,0.72,0,1)",
                        }}
                      >
                        {isDone ? (
                          <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden>
                            <path
                              d="M1 4.5L4 8L10 1"
                              stroke="#b4c5ff"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <span
                            className="font-mono text-[10px] font-bold tabular-nums leading-none select-none"
                            style={{
                              color: isCurrent ? "#b4c5ff" : "rgba(226,226,235,0.18)",
                              transition: "color 600ms cubic-bezier(0.32,0.72,0,1)",
                            }}
                          >
                            {step.num}
                          </span>
                        )}
                      </div>

                      {/* Connector line between nodes (skip after last) */}
                      {idx < STEPS.length - 1 && (
                        <div className="relative flex-1 mx-2" style={{ height: 2 }}>
                          <div
                            className="absolute inset-0"
                            style={{ background: "rgba(255,255,255,0.06)" }}
                          />
                          <div
                            className="absolute left-0 top-0 h-full"
                            style={{
                              width: connectorFilled ? "100%" : "0%",
                              background: "linear-gradient(to right, #618bff, #b4c5ff)",
                              boxShadow: connectorFilled
                                ? "0 0 5px 1px rgba(97,139,255,0.45)"
                                : "none",
                              transition: "width 700ms cubic-bezier(0.32,0.72,0,1)",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Row 2: labels under each node */}
              <div className="flex items-start justify-between mt-4">
                {STEPS.map((step, idx) => {
                  const isDone = idx < currentIdx;
                  const isCurrent = idx === currentIdx;
                  const isFirst = idx === 0;
                  const isLast = idx === STEPS.length - 1;

                  return (
                    <div
                      key={step.id}
                      className={[
                        "flex flex-col gap-1",
                        isFirst ? "items-start" : isLast ? "items-end" : "items-center",
                      ].join(" ")}
                      style={{ flex: 1, minWidth: 0 }}
                    >
                      <span
                        className="font-heading text-[13px] font-semibold"
                        style={{
                          color: isDone
                            ? "rgba(195,198,215,0.28)"
                            : isCurrent
                              ? "#e2e2eb"
                              : "rgba(226,226,235,0.15)",
                          textDecorationLine: isDone ? "line-through" : "none",
                          textDecorationColor: "rgba(180,197,255,0.22)",
                          transition: "color 600ms cubic-bezier(0.32,0.72,0,1)",
                        }}
                      >
                        {step.label}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <p
                          className="font-mono text-[9px] tracking-[0.08em]"
                          style={{
                            color: isDone
                              ? "rgba(195,198,215,0.16)"
                              : isCurrent
                                ? "rgba(195,198,215,0.5)"
                                : "rgba(195,198,215,0.1)",
                            transition: "color 600ms cubic-bezier(0.32,0.72,0,1)",
                          }}
                        >
                          {isDone ? step.doneDetail : step.activeDetail}
                        </p>
                        {isCurrent && <FreqBars />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
