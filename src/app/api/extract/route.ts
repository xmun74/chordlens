import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json().catch(() => ({ url: "" }));

  const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;
  if (!apiUrl?.startsWith("http")) {
    return NextResponse.json(
      { detail: "API URL이 설정되지 않았습니다. .env의 NEXT_PUBLIC_RAILWAY_URL을 확인하세요." },
      { status: 503 },
    );
  }

  const upstream = await fetch(`${apiUrl}/extract`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ youtube_url: url }),
  });

  if (!upstream.ok) {
    const error = await upstream.json().catch(() => ({ detail: upstream.statusText }));
    return NextResponse.json(error, { status: upstream.status });
  }

  const data = await upstream.json();

  // 백엔드 snake_case → 프론트 camelCase 변환
  return NextResponse.json({
    id: data.id,
    videoId: data.video_id,
    title: data.title,
    channelName: data.channel_name,
    thumbnailUrl: data.thumbnail_url,
    chords: data.chords,
    lyrics: data.lyrics ?? null,
    cached: data.cached,
  });
}
