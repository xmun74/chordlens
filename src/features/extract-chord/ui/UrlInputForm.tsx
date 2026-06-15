"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { isValidYouTubeUrl } from "@/shared/lib/youtube";
import { Button } from "@/shared/ui/Button";

interface Props {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export function UrlInputForm({ onSubmit, isLoading = false }: Props) {
  const t = useTranslations();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid = isValidYouTubeUrl(url);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    if (val && !isValidYouTubeUrl(val)) {
      setError(t("유효한 YouTube URL을 입력해주세요"));
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
  };

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {/* URL input */}
      <div
        className={[
          "flex h-[58px] min-w-0 items-center rounded-xl bg-bg-input px-4 transition-all sm:h-[63px] sm:px-5",
          error ? "ring-1 ring-red-500/50" : "focus-within:ring-1 focus-within:ring-accent/60",
        ].join(" ")}
      >
        <svg className="mr-3 shrink-0" width="20" height="10" viewBox="0 0 20 10" fill="none">
          <path
            d="M9 10H5C3.61667 10 2.4375 9.5125 1.4625 8.5375C0.4875 7.5625 0 6.38333 0 5C0 3.61667 0.4875 2.4375 1.4625 1.4625C2.4375 0.4875 3.61667 0 5 0H9V2H5C4.16667 2 3.45833 2.29167 2.875 2.875C2.29167 3.45833 2 4.16667 2 5C2 5.83333 2.29167 6.54167 2.875 7.125C3.45833 7.70833 4.16667 8 5 8H9V10ZM6 6V4H14V6H6ZM11 10V8H15C15.8333 8 16.5417 7.70833 17.125 7.125C17.7083 6.54167 18 5.83333 18 5C18 4.16667 17.7083 3.45833 17.125 2.875C16.5417 2.29167 15.8333 2 15 2H11V0H15C16.3833 0 17.5625 0.4875 18.5375 1.4625C19.5125 2.4375 20 3.61667 20 5C20 6.38333 19.5125 7.5625 18.5375 8.5375C17.5625 9.5125 16.3833 10 15 10H11Z"
            fill="#B4C5FF"
          />
        </svg>

        <input
          type="text"
          value={url}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={t("YouTube 링크를 붙여넣으세요")}
          className="min-w-0 flex-1 bg-transparent text-base text-text-primary placeholder-text-secondary/40 outline-none"
          aria-label={t("YouTube URL 입력")}
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
            aria-label={t("입력 초기화")}
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

      {error && (
        <p id="url-error" className="text-sm text-red-400 -mt-2">
          {error}
        </p>
      )}

      {/* Drag & Drop area */}
      <div
        role="region"
        aria-label={t("MP3 또는 WAV 파일을 여기에 드래그 앤 드롭하세요")}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={[
          "flex h-[120px] min-w-0 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border px-4 text-center transition-all sm:h-[130px]",
          isDragging
            ? "border-accent bg-accent/10"
            : "border-border bg-bg-card hover:border-border/70",
        ].join(" ")}
      >
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
        <span className="font-heading text-sm text-text-secondary sm:text-base">
          {t("MP3 또는 WAV 파일을 여기에 드래그 앤 드롭하세요")}
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,.wav,audio/*"
        className="hidden"
        onChange={() => {}}
      />

      <Button
        type="button"
        variant="gradient"
        className="h-14 w-full gap-3 text-base sm:h-[68px] sm:text-lg"
        onClick={handleSubmit}
        disabled={!isValid}
        loading={isLoading}
        aria-label={t("코드 분석하기")}
      >
        {!isLoading && (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M18 8L16.75 5.25L14 4L16.75 2.75L18 0L19.25 2.75L22 4L19.25 5.25L18 8ZM18 22L16.75 19.25L14 18L16.75 16.75L18 14L19.25 16.75L22 18L19.25 19.25L18 22ZM8 19L5.5 13.5L0 11L5.5 8.5L8 3L10.5 8.5L16 11L10.5 13.5L8 19ZM8 14.15L9 12L11.15 11L9 10L8 7.85L7 10L4.85 11L7 12L8 14.15Z"
              fill="#002A78"
            />
          </svg>
        )}
        {t("코드 분석하기")}
      </Button>
    </div>
  );
}
