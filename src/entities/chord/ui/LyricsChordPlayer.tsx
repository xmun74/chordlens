"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import type { LyricLine, ChordEntry } from "@/shared/model";

interface Props {
  videoId: string;
  lyrics?: LyricLine[];
  chords: ChordEntry[];
  activeChord?: string | null;
  onSelect?: (chord: string, idx: number) => void;
}

// ── 상수 ──────────────────────────────────────────────
const PX_PER_SEC = 50;
const PLAYHEAD_LEFT = 100;
const ACTIVATION_BUFFER_SEC = 28 / PX_PER_SEC;

// ── 유틸 ──────────────────────────────────────────────
function timeToSeconds(time: string): number {
  const [m, s] = time.split(":").map(Number);
  return m * 60 + (s || 0);
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getCurrentLyric(t: number, lyrics: LyricLine[]): LyricLine | null {
  let result: LyricLine | null = null;
  for (const line of lyrics) {
    if (timeToSeconds(line.time) <= t) result = line;
    else break;
  }
  return result;
}

function getCurrentChordIdx(t: number, chords: ChordEntry[]): number {
  let idx = 0;
  for (let i = 0; i < chords.length; i++) {
    if (timeToSeconds(chords[i].time) <= t) idx = i;
    else break;
  }
  return idx;
}

// ── YouTube IFrame API 타입 ───────────────────────────
interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  getCurrentTime(): number;
  getDuration(): number;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  destroy(): void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: {
          videoId: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number }) => void;
          };
        },
      ) => void;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// ── 컴포넌트 ──────────────────────────────────────────
export function LyricsChordPlayer({ videoId, lyrics, chords, activeChord, onSelect }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const playerDivRef = useRef<HTMLDivElement>(null);
  const isUserScrolling = useRef(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);

  const hasLyrics = !!lyrics && lyrics.length > 0;

  const totalDuration =
    chords.length > 0 ? timeToSeconds(chords[chords.length - 1].time) + 20 : 120;
  const totalWidth = PLAYHEAD_LEFT + totalDuration * PX_PER_SEC + 160;

  const currentChordIdx = getCurrentChordIdx(currentTime + ACTIVATION_BUFFER_SEC, chords);
  const currentLyric = hasLyrics ? getCurrentLyric(currentTime, lyrics!) : null;

  // ── YouTube IFrame 로드 & 플레이어 생성 ──────────────
  useEffect(() => {
    const initPlayer = () => {
      if (!window.YT?.Player || !playerDivRef.current) return;
      new window.YT.Player(playerDivRef.current, {
        videoId,
        playerVars: { autoplay: 0, controls: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: (e) => {
            playerRef.current = e.target;
            setDuration(e.target.getDuration());
            setPlayerReady(true);
          },
          onStateChange: (e) => {
            setIsPlaying(e.data === 1);
          },
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        initPlayer();
      };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }

    return () => {
      try {
        playerRef.current?.destroy();
      } catch {
        /* noop */
      }
      playerRef.current = null;
    };
  }, [videoId]);

  // ── RAF: isPlaying일 때만 실행 ───────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    let id: number;
    const tick = () => {
      const t = playerRef.current?.getCurrentTime() ?? 0;
      setCurrentTime(t);
      if (!isUserScrolling.current && scrollRef.current) {
        scrollRef.current.scrollLeft = t * PX_PER_SEC;
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [isPlaying]);

  // ── currentTime 변경 → 코드 하이라이트 ──────────────
  useEffect(() => {
    const idx = getCurrentChordIdx(currentTime + ACTIVATION_BUFFER_SEC, chords);
    if (chords[idx]) onSelect?.(chords[idx].chord, idx);
  }, [currentTime, chords, onSelect]);

  // ── 커스텀 재생/일시정지 ─────────────────────────────
  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  }, [isPlaying]);

  // ── 수동 스크롤 → seek ──────────────────────────────
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const t = scrollRef.current.scrollLeft / PX_PER_SEC;
    setCurrentTime(t);
    if (isUserScrolling.current) playerRef.current?.seekTo(t, true);
  }, []);

  const handlePointerDown = useCallback(() => {
    isUserScrolling.current = true;
  }, []);
  const handlePointerUp = useCallback(() => {
    isUserScrolling.current = false;
  }, []);

  // ── 프로그레스바 클릭 → seek ─────────────────────────
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || !duration) return;
      const { left, width } = progressRef.current.getBoundingClientRect();
      const t = ((e.clientX - left) / width) * duration;
      playerRef.current?.seekTo(t, true);
      setCurrentTime(t);
      if (scrollRef.current) scrollRef.current.scrollLeft = t * PX_PER_SEC;
    },
    [duration],
  );

  // ── 타임 틱 ─────────────────────────────────────────
  const ticks: number[] = [];
  for (let t = 0; t <= totalDuration; t += 10) ticks.push(t);

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-heading text-xl font-bold text-text-primary">
        {hasLyrics ? "Lyrics & Chords" : "Chords"}
      </h2>

      <div className="rounded-2xl bg-bg-dark overflow-hidden">
        {/* ── 가사 표시 ── */}
        {hasLyrics && (
          <>
            <div className="px-6 pt-5 pb-4 min-h-[68px] flex items-center gap-3">
              <span className="text-accent-light/50 text-lg select-none">♪</span>
              <p className="font-heading text-base text-text-primary leading-relaxed flex-1">
                {currentLyric?.text ?? <span className="text-text-secondary/40">—</span>}
              </p>
              {currentLyric && (
                <span className="font-mono text-xs text-text-secondary/50 shrink-0 tabular-nums">
                  {currentLyric.time}
                </span>
              )}
            </div>
            <div className="border-t border-white/5" />
          </>
        )}

        {/* ── 재생 컨트롤 + 코드 타임라인 ── */}
        <div className="flex">
          {/* 왼쪽: YouTube 플레이어 + 컨트롤 */}
          <div className="w-[200px] h-[180px] shrink-0 flex flex-col border-r border-white/5">
            {/* YouTube iframe */}
            <div ref={playerDivRef} className="w-full aspect-video bg-black" />

            {/* 커스텀 컨트롤 */}
            <div className="flex items-center gap-2 px-3 py-2 border-t border-white/5">
              <button
                onClick={togglePlay}
                disabled={!playerReady}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-accent-light/15 border border-accent-light/40 hover:bg-accent-light/25 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                aria-label={isPlaying ? "일시정지" : "재생"}
              >
                {isPlaying ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                    className="text-accent-light"
                  >
                    <rect x="1" y="1" width="3.5" height="10" rx="1" />
                    <rect x="7.5" y="1" width="3.5" height="10" rx="1" />
                  </svg>
                ) : (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                    className="text-accent-light ml-0.5"
                  >
                    <path d="M2 1l9 5-9 5V1z" />
                  </svg>
                )}
              </button>

              <div className="flex flex-col flex-1 gap-1 min-w-0">
                {/* 프로그레스바 */}
                <div
                  ref={progressRef}
                  onClick={handleProgressClick}
                  className="w-full h-1 rounded-full bg-white/10 cursor-pointer overflow-hidden"
                >
                  <div
                    className="h-full rounded-full bg-accent-light/70"
                    style={{ width: `${progressPct}%`, transition: "none" }}
                  />
                </div>
                {/* 시간 */}
                <span className="font-mono text-[10px] text-text-secondary/50 tabular-nums">
                  {formatTime(currentTime)}
                  {duration > 0 ? ` / ${formatTime(duration)}` : ""}
                </span>
              </div>
            </div>
          </div>

          {/* 오른쪽: 코드 스크롤 타임라인 */}
          <div className="flex-1 relative overflow-hidden">
            {/* Playhead */}
            <div
              className="absolute inset-y-0 z-10 pointer-events-none"
              style={{ left: `${PLAYHEAD_LEFT}px` }}
            >
              <div className="w-px h-full bg-linear-to-b from-accent-light/80 to-accent-light/20" />
            </div>

            {/* 페이드 */}
            <div className="absolute inset-y-0 left-0 w-10 bg-linear-to-r from-bg-dark to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-10 bg-linear-to-l from-bg-dark to-transparent z-20 pointer-events-none" />

            {/* 스크롤 컨테이너 */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              className="overflow-x-auto h-full"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#b4c5ff transparent",
              }}
            >
              <div className="relative h-full" style={{ width: `${totalWidth}px` }}>
                {/* 타임 틱 */}
                {ticks.map((t) => (
                  <div
                    key={t}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${PLAYHEAD_LEFT + t * PX_PER_SEC}px`, bottom: "6px" }}
                  >
                    <div className="w-px h-2 bg-white/10" />
                    <span className="font-mono text-[9px] text-text-secondary/30 mt-0.5 tabular-nums">
                      {`${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`}
                    </span>
                  </div>
                ))}

                {/* 코드 버튼 */}
                {chords.map((entry, i) => {
                  const x = PLAYHEAD_LEFT + timeToSeconds(entry.time) * PX_PER_SEC;
                  const isActive = entry.chord === activeChord;
                  const isCurrent = i === currentChordIdx;
                  return (
                    <div
                      key={i}
                      className="absolute flex flex-col items-center"
                      style={{ left: `${x}px`, top: "50%", transform: "translate(-50%, -54%)" }}
                    >
                      <button
                        onClick={() => onSelect?.(entry.chord, i)}
                        className={[
                          "font-mono text-sm font-bold px-2.5 py-1 rounded-lg transition-all whitespace-nowrap focus:outline-none",
                          isActive
                            ? "text-accent-deep bg-linear-to-br from-accent-light to-accent shadow-[0_0_12px_rgba(97,139,255,0.5)]"
                            : isCurrent
                              ? "text-white bg-accent/50 border border-accent-light/80 scale-110"
                              : "text-accent-light bg-accent-light/15 border border-accent-light/40 hover:bg-accent-light/25 hover:scale-105",
                        ].join(" ")}
                      >
                        {entry.chord}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
