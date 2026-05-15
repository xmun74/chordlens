import Link from "next/link";
import Image from "next/image";
import type { ResultListItem } from "@/entities/result";

interface PopularAlbumCardProps {
  item: ResultListItem;
}

export function PopularAlbumCard({ item }: PopularAlbumCardProps) {
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
