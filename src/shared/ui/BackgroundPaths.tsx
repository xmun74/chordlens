"use client";

import { motion, useReducedMotion } from "motion/react";

interface BackgroundPathsProps {
  /** 생성할 곡선 path 개수. 기본 24. 성능 고려해 상한 36으로 클램프된다. */
  count?: number;
  /** 추가 클래스(컨테이너). 위치/크기 조정용. 기본 "". */
  className?: string;
}

/** 인덱스 기반 결정론적 곡선 d 문자열 생성 (Math.random 사용 금지 — SSR hydration mismatch 방지). */
function buildPath(index: number): string {
  // 인덱스에 따라 곡선을 평행 이동시킨다.
  // 모든 path의 시작점(좌측 끝)을 viewBox 바깥(음수 x)에 두어 시작점이 화면에 노출되지 않게 한다.
  // x 분산을 작게(8) 유지해 최대 인덱스(35)에서도 startX가 음수로 남고, 곡선 길이(+1240)로 우측 끝까지 커버한다.
  const startX = -360 + index * 8;
  const startY = 60 + index * 9;
  return `M${startX} ${startY}C${startX + 210} ${startY - 120} ${startX + 425} ${
    startY + 160
  } ${startX + 660} ${startY + 40}C${startX + 850} ${startY - 60} ${startX + 1040} ${
    startY + 120
  } ${startX + 1240} ${startY + 20}`;
}

export function BackgroundPaths({ count = 24, className = "" }: BackgroundPathsProps) {
  const prefersReducedMotion = useReducedMotion();
  const pathCount = Math.min(count, 36);

  return (
    <div aria-hidden="true" className={`pointer-events-none text-accent ${className}`}>
      <svg
        className="h-full w-full"
        viewBox="0 0 800 480"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {Array.from({ length: pathCount }, (_, index) => {
          // light bg(#f5f7fb)에서도 보이도록 opacity 하한을 0.18로 유지, 상한 0.5.
          const opacity = 0.18 + (index / pathCount) * 0.32;
          const strokeWidth = 0.6 + (index / pathCount) * 0.9;

          return (
            <motion.path
              key={index}
              d={buildPath(index)}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeOpacity={opacity}
              strokeLinecap="round"
              initial={{ pathLength: prefersReducedMotion ? 1 : 0.3 }}
              animate={prefersReducedMotion ? undefined : { pathLength: [0.3, 1, 0.3] }}
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      duration: 22 + (index % 9),
                      repeat: Infinity,
                      ease: "linear",
                    }
              }
            />
          );
        })}
      </svg>
    </div>
  );
}
