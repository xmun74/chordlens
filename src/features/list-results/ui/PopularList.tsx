"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePopularResults } from "@/features/list-results/api/usePopularResults";
import { PopularAlbumCard } from "@/features/list-results/ui/PopularAlbumCard";

export function PopularList() {
  const { data, isPending, isError } = usePopularResults();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const syncScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    syncScrollState();
    window.addEventListener("resize", syncScrollState);
    return () => window.removeEventListener("resize", syncScrollState);
  }, [data, syncScrollState]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "right" ? el.clientWidth * 0.8 : -el.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  if (isPending) {
    return (
      <div className="grid grid-flow-col grid-rows-[repeat(2,auto)] auto-cols-[11rem] gap-4 overflow-hidden sm:auto-cols-[14rem]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-square w-full animate-pulse rounded-lg bg-bg-card/40" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-bg-card/40" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-bg-card/40" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data || data.items.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && canScrollLeft && (
        <div className="absolute inset-y-0 left-0 z-10 flex items-center">
          <button
            onClick={() => scroll("left")}
            aria-label="이전"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-card/80 text-text-primary backdrop-blur-sm transition-colors hover:bg-bg-card"
          >
            <ChevronLeft size={24} strokeWidth={1.8} />
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={syncScrollState}
        className="grid grid-flow-col grid-rows-[repeat(2,auto)] auto-cols-[11rem] gap-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] sm:auto-cols-[14rem] [&::-webkit-scrollbar]:hidden"
      >
        {data.items.map((item) => (
          <PopularAlbumCard key={item.id} item={item} />
        ))}
      </div>

      {isHovered && canScrollRight && (
        <div className="absolute inset-y-0 right-0 z-10 flex items-center">
          <button
            onClick={() => scroll("right")}
            aria-label="다음"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-card/80 text-text-primary backdrop-blur-sm transition-colors hover:bg-bg-card"
          >
            <ChevronRight size={24} strokeWidth={1.8} />
          </button>
        </div>
      )}
    </div>
  );
}
