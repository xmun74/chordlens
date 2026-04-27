import { cache } from "react";
import { headers } from "next/headers";
import { ResultPage } from "@/views/result";
import { getResultById } from "@/entities/result";
import { ViewTracker } from "@/features/track-view";
import type { ChordResult } from "@/shared/model";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

async function getBaseUrl(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

const getResult = cache(async (id: string): Promise<ChordResult | null> => {
  const baseUrl = await getBaseUrl();
  return getResultById(id, baseUrl);
});

export default async function ResultRoute({ params }: Props) {
  const { id } = await params;
  const result = await getResult(id);

  if (!result) notFound();

  return (
    <>
      <ViewTracker id={id} title={result.title} />
      <ResultPage result={result} />
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const result = await getResult(id);

  if (!result) return {};

  return {
    title: `${result.title} — ChordLens`,
    description: `Key: ${result.key ?? "?"} · Tempo: ${result.tempo ?? "?"} BPM`,
  };
}
