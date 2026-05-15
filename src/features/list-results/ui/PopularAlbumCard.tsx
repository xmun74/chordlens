import Link from "next/link";
import Image from "next/image";
import type { ResultListItem } from "@/entities/result";
import { formatDuration } from "@/shared/lib/formatDuration";

interface PopularAlbumCardProps {
  item: ResultListItem;
}

export function PopularAlbumCard({ item }: PopularAlbumCardProps) {
  const formattedDuration = formatDuration(item.duration);

  return (
    <Link href={`/result/${item.id}`} className="group flex flex-col gap-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-bg-card/60">
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.title ?? "thumbnail"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="h-full w-full bg-bg-base/60" />
        )}
        {formattedDuration ? (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 font-mono text-xs text-white">
            {formattedDuration}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-0.5 px-1">
        <p className="line-clamp-2 font-sans text-sm font-semibold text-text-primary">
          {item.title ?? "제목 없음"}
        </p>
        <span className="font-sans text-xs text-text-secondary">{item.channelName ?? "-"}</span>
      </div>
    </Link>
  );
}
