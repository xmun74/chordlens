"use client";

import { useState } from "react";
import { ChordTimeline } from "@/entities/chord/ui/ChordTimeline";
import { ChordGrid } from "@/entities/chord/ui/ChordGrid";
import { VideoCard } from "@/entities/video/ui/VideoCard";
import { ShareButton } from "@/features/share-result/ui/ShareButton";
import type { ChordResult } from "@/shared/model";

interface Props {
  result: ChordResult;
}

export function ResultPage({ result }: Props) {
  const [activeChord, setActiveChord] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-7xl px-8 py-10 flex flex-col gap-8">
      <VideoCard
        meta={{
          title: result.title,
          thumbnailUrl: result.thumbnailUrl,
          channelName: result.channelName,
          tempo: result.tempo,
          key: result.key,
        }}
      />

      <ChordTimeline chords={result.chords} activeChord={activeChord} onSelect={setActiveChord} />

      <ChordGrid chords={result.chords.map((c) => c.chord)} activeChord={activeChord} />

      <div className="flex justify-center pt-4">
        <ShareButton />
      </div>
    </main>
  );
}
