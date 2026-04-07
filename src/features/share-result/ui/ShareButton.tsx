"use client";

import { useState } from "react";

interface Props {
  url?: string;
  className?: string;
}

export function ShareButton({ url, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url ?? window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={[
        "inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all",
        copied
          ? "bg-accent-light/20 text-accent-light border border-accent-light/40"
          : "bg-bg-input text-text-secondary border border-border hover:bg-[#33343b] hover:text-text-primary",
        className,
      ].join(" ")}
      aria-label="결과 공유하기"
    >
      {copied ? (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 8l4 4 8-8" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM11 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
            <path d="M5.7 8.5l4.6-2.5M5.7 7.5l4.6 2.5" />
          </svg>
          Share Result
        </>
      )}
    </button>
  );
}
