import { NextRequest, NextResponse } from "next/server";
import { extractVideoId } from "@/shared/lib/youtube";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url 파라미터가 필요합니다." }, { status: 400 });
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    return NextResponse.json({ error: "유효하지 않은 YouTube URL입니다." }, { status: 400 });
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return NextResponse.json({ videoId, thumbnailUrl });
}
