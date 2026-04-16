import Image from "next/image";
import type { VideoMeta } from "../model/types";

interface Props {
  meta: VideoMeta;
  onShare?: () => void;
}

export function VideoCard({ meta, onShare }: Props) {
  return (
    <div className="flex overflow-hidden">
      {/* Info */}
      <div className="flex flex-col justify-between flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            {/* Badge */}
            <div className="mb-2 inline-flex items-center rounded-full bg-accent-light/10 px-3 py-1">
              <span className="font-heading text-xs font-bold tracking-wide text-accent-light">
                YOUTUBE SOURCE
              </span>
            </div>
            {/* Title */}
            <h1 className="font-heading text-2xl font-bold leading-tight tracking-tight text-text-primary max-w-lg">
              {meta.title}
            </h1>
            {/* Channel */}
            <div className="mt-2 flex items-center gap-2 text-text-secondary">
              <span className="text-sm">{meta.channelName}</span>
            </div>
          </div>

          {/* Share button */}
          {onShare && (
            <button
              onClick={onShare}
              className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-bg-input text-text-secondary hover:text-text-primary hover:bg-[#33343b] transition-colors"
              aria-label="결과 공유하기"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                <path d="M5 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                <path d="M13 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                <path d="M7 9.5l4-2M7 8.5l4 2" />
              </svg>
            </button>
          )}
        </div>

        {/* Stats: Tempo + Key */}
        {(meta.tempo || meta.key) && (
          <div className="mt-4 flex items-center gap-3">
            {meta.tempo && (
              <div className="flex flex-col rounded-lg bg-bg-input px-4 py-2">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                  Tempo
                </span>
                <span className="font-mono text-lg text-orange">{meta.tempo} BPM</span>
              </div>
            )}
            {meta.key && (
              <div className="flex flex-col rounded-lg bg-bg-input px-4 py-2">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                  Key
                </span>
                <span className="font-mono text-lg text-accent-light">{meta.key}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
