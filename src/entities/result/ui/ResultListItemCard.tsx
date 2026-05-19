import Link from "next/link";
import Image from "next/image";
import type { ResultListItem } from "../model/types";

interface ResultListItemCardProps {
  item: ResultListItem;
}

export function ResultListItemCard({ item }: ResultListItemCardProps) {
  return (
    <Link
      href={`/result/${item.id}`}
      className="flex min-w-0 items-center justify-between gap-4 rounded-xl border border-border/10 bg-bg-card/40 px-4 py-3 transition-colors hover:bg-bg-card/70"
    >
      {item.thumbnailUrl ? (
        <div className="relative aspect-video basis-1/3 shrink-0 overflow-hidden rounded-xs">
          <Image
            src={item.thumbnailUrl}
            alt={item.title ? item.title : "thumbnail"}
            fill
            className="object-cover"
            sizes="33vw"
          />
        </div>
      ) : (
        <div className="aspect-video basis-1/3 shrink-0 rounded-xs bg-bg-base/60" />
      )}

      <div className="h-full min-w-0 flex-1 flex flex-col justify-around">
        <div className="flex flex-col min-w-0 flex-1">
          <p className="line-clamp-3 font-sans text-sm font-semibold text-text-primary">
            {item.title ? item.title : "제목 없음"}
          </p>
        </div>

        <span className="flex justify-end truncate font-mono text-xs text-text-secondary">
          {item.channelName ? item.channelName : "-"}
        </span>
      </div>
    </Link>
  );
}
