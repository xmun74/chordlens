import { ResultPage } from "@/views/result/ui/ResultPage";
import { railwayFetch } from "@/shared/api/railwayClient";
import type { ChordResult } from "@/shared/model";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

async function getResult(id: string): Promise<ChordResult | null> {
  try {
    return await railwayFetch<ChordResult>(`/result/${id}`);
  } catch {
    return null;
  }
}

export default async function ResultRoute({ params }: Props) {
  const { id } = await params;
  const result = await getResult(id);

  if (!result) notFound();

  return <ResultPage result={result} />;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const result = await getResult(id);

  if (!result) return {};

  return {
    title: `${result.title} — CodeLens`,
    description: `Key: ${result.key ?? "?"} · Tempo: ${result.tempo ?? "?"} BPM`,
  };
}
