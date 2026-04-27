import type { ChordResult } from "@/shared/model";

export async function getResultById(id: string, baseUrl: string): Promise<ChordResult | null> {
  try {
    const res = await fetch(`${baseUrl}/api/result/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json() as Promise<ChordResult>;
  } catch {
    return null;
  }
}
