"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition, useRef, useState, useEffect } from "react";

const LOCALES = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
] as const;

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSelect = (next: string) => {
    if (next === locale) {
      setOpen(false);
      return;
    }
    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  const current = LOCALES.find((l) => l.code === locale);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className="flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase text-text-secondary hover:text-text-primary transition-colors disabled:opacity-40"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current?.label ?? locale}
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-2 w-32 rounded-xl bg-bg-card border border-border/40 py-1 shadow-lg z-50"
        >
          {LOCALES.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === locale}>
              <button
                onClick={() => handleSelect(l.code)}
                className={[
                  "w-full px-4 py-2 text-left font-sans text-sm transition-colors",
                  l.code === locale
                    ? "text-accent font-medium"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-input/60",
                ].join(" ")}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
