import { NextRequest, NextResponse } from "next/server";
import { buildUpstreamUrl, getApiBaseUrl } from "@/shared/api/upstream";
import { isValidYouTubeUrl } from "@/shared/lib/youtube";

export async function POST(req: NextRequest) {
  const { url } = await req.json().catch(() => ({ url: "" }));
  const youtubeUrl = typeof url === "string" ? url.trim() : "";

  if (!isValidYouTubeUrl(youtubeUrl)) {
    return NextResponse.json({ detail: "유효하지 않은 YouTube URL입니다." }, { status: 400 });
  }

  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    return NextResponse.json(
      { detail: "API URL이 설정되지 않았습니다. .env의 NEXT_PUBLIC_API_URL을 확인하세요." },
      { status: 503 },
    );
  }

  const upstream = await fetch(buildUpstreamUrl(apiBaseUrl, "/extract"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ youtube_url: youtubeUrl }),
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
