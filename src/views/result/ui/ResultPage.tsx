"use client";

import { useState, useCallback } from "react";
import { ChordGrid, LyricsChordPlayer } from "@/entities/chord";
import { VideoCard } from "@/entities/video";
import { ShareButton } from "@/features/share-result";
import type { ChordResult } from "@/shared/model";

interface Props {
  result: ChordResult;
}

export function ResultPage({ result }: Props) {
  const [activeChord, setActiveChord] = useState<string | null>(null);
  const [activeChordIdx, setActiveChordIdx] = useState(0);

  const handleSelect = useCallback((chord: string, idx: number) => {
    setActiveChord(chord);
    setActiveChordIdx(idx);
  }, []);

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

      <LyricsChordPlayer
        videoId={result.videoId}
        lyrics={result.lyrics ?? undefined}
        chords={result.chords}
        activeChord={activeChord}
        onSelect={handleSelect}
      />

      <ChordGrid allChords={result.chords} activeChordIdx={activeChordIdx} />

      <div className="flex justify-center pt-4">
        <ShareButton />
      </div>
    </main>
  );
}
