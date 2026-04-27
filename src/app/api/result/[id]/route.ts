import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl?.startsWith("http")) {
    return NextResponse.json({ detail: "API URL이 설정되지 않았습니다." }, { status: 503 });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  try {
    const upstream = await fetch(`${apiUrl}/results/${id}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!upstream.ok) {
      const error = await upstream.json().catch(() => ({ detail: upstream.statusText }));
      return NextResponse.json(error, { status: upstream.status });
    }

    const data = await upstream.json();

    return NextResponse.json({
      id: data.id,
      videoId: data.video_id,
      title: data.title,
      channelName: data.channel_name,
      thumbnailUrl: data.thumbnail_url,
      chords: data.chords,
      lyrics: data.lyrics ?? null,
      cached: data.cached,
      tempo: data.tempo ?? undefined,
      key: data.key ?? undefined,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json({ detail: "request timeout" }, { status: 504 });
    }
    return NextResponse.json({ detail: "failed to fetch result" }, { status: 500 });
  }
}
