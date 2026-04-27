import Link from "next/link";
import Image from "next/image";
import type { ResultListItem } from "../model/types";

interface ResultListItemCardProps {
  item: ResultListItem;
}

export function ResultListItemCard({ item }: ResultListItemCardProps) {
  const date = new Date(item.createdAt).toISOString().split("T")[0].replaceAll("-", ".");

  return (
    <Link
      href={`/result/${item.id}`}
      className="flex fe items-center gap-4 rounded-xl border border-border/10 bg-bg-card/40 px-4 py-3 transition-colors hover:bg-bg-card/70"
    >
      {item.thumbnailUrl ? (
        <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-sm">
          <Image
            src={item.thumbnailUrl}
            alt={item.title ?? "thumbnail"}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      ) : (
        <div className="h-14 w-24 shrink-0 rounded-lg bg-bg-base/60" />
      )}

      <div className="flex flex-col">
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-wraptruncate font-sans text-sm font-semibold text-text-primary">
            {item.title ?? "제목 없음"}
          </p>
          <p className="truncate font-sans text-xs text-text-secondary">
            {item.channelName ?? "-"}
          </p>
        </div>

        <span className="flex justify-end font-mono text-xs text-text-secondary">{date}</span>
      </div>
    </Link>
  );
}
