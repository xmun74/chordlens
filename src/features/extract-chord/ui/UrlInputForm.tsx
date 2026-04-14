"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { isValidYouTubeUrl } from "@/shared/lib/youtube";
import { Button } from "@/shared/ui/Button";

interface Props {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export function UrlInputForm({ onSubmit, isLoading = false }: Props) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid = isValidYouTubeUrl(url);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    if (val && !isValidYouTubeUrl(val)) {
      setError("유효한 YouTube URL을 입력해주세요.");
    } else {
      setError("");
    }
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(url.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid && !isLoading) handleSubmit();
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    // File drop — future: handle MP3/WAV
    const file = e.dataTransfer.files[0];
    if (file) {
      // Placeholder for file handling
      console.log("File dropped:", file.name);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* URL input */}
      <div
        className={[
          "flex items-center rounded-xl bg-bg-input px-5 h-[63px] transition-all",
          error ? "ring-1 ring-red-500/50" : "focus-within:ring-1 focus-within:ring-accent/60",
        ].join(" ")}
      >
        {/* Link icon */}
        <svg
          className="mr-3 shrink-0 text-text-secondary/40"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M7.5 10.5a4.5 4.5 0 0 0 6.364 0l2.122-2.121a4.5 4.5 0 0 0-6.364-6.364L8.136 3.5" />
          <path d="M10.5 7.5a4.5 4.5 0 0 0-6.364 0L2.014 9.621a4.5 4.5 0 0 0 6.364 6.364l1.477-1.477" />
        </svg>

        <input
          type="text"
          value={url}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Paste YouTube link here..."
          className="flex-1 bg-transparent text-base text-text-primary placeholder-text-secondary/40 outline-none"
          aria-label="YouTube URL 입력"
          aria-invalid={!!error}
          aria-describedby={error ? "url-error" : undefined}
          disabled={isLoading}
        />

        {url && (
          <button
            type="button"
            onClick={() => {
              setUrl("");
              setError("");
            }}
            className="ml-2 text-text-secondary/40 hover:text-text-secondary transition-colors"
            aria-label="입력 초기화"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <p id="url-error" className="text-sm text-red-400 -mt-2">
          {error}
        </p>
      )}

      {/* Drag & Drop area */}
      <div
        role="region"
        aria-label="오디오 파일 드래그 앤 드롭 영역"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={[
          "flex flex-col items-center justify-center gap-3 rounded-xl border cursor-pointer transition-all h-[130px]",
          isDragging
            ? "border-accent bg-accent/10"
            : "border-border bg-bg-card/30 hover:border-border/70",
        ].join(" ")}
      >
        {/* Music note icon */}
        <svg
          className="text-text-secondary/60"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 27V9l14-3v18" />
          <circle cx="9" cy="27" r="3" />
          <circle cx="23" cy="24" r="3" />
        </svg>
        <span className="font-[family-name:var(--font-space-grotesk)] text-base text-text-secondary">
          Drag and drop MP3 or WAV files here
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,.wav,audio/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) console.log("File selected:", file.name);
        }}
      />

      {/* Submit button */}
      <Button
        variant="gradient"
        className="h-[68px] w-full text-lg gap-3"
        onClick={handleSubmit}
        disabled={!isValid}
        loading={isLoading}
        aria-label="코드 분석하기"
      >
        {!isLoading && (
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 8L16.75 5.25L14 4L16.75 2.75L18 0L19.25 2.75L22 4L19.25 5.25L18 8ZM18 22L16.75 19.25L14 18L16.75 16.75L18 14L19.25 16.75L22 18L19.25 19.25L18 22ZM8 19L5.5 13.5L0 11L5.5 8.5L8 3L10.5 8.5L16 11L10.5 13.5L8 19ZM8 14.15L9 12L11.15 11L9 10L8 7.85L7 10L4.85 11L7 12L8 14.15Z"
              fill="#002A78"
            />
          </svg>
        )}
        Analyze Chords
      </Button>
    </div>
  );
}
