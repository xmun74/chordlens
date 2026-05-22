import { NextResponse } from "next/server";
import { buildUpstreamUrl, getApiBaseUrl } from "@/shared/api/upstream";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    return NextResponse.json({ detail: "API URL이 설정되지 않았습니다." }, { status: 503 });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  try {
    const upstream = await fetch(buildUpstreamUrl(apiBaseUrl, "/results/popular"), {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!upstream.ok) {
      const error = await upstream.json().catch(() => ({ detail: upstream.statusText }));
      return NextResponse.json(error, { status: upstream.status });
    }

    const data = await upstream.json();

    return NextResponse.json({
      items: (data.items ?? []).map((item: Record<string, unknown>) => ({
        id: item.id,
        videoUrl: item.video_url,
        title: item.title ?? null,
        channelName: item.channel_name ?? null,
        thumbnailUrl: item.thumbnail_url ?? null,
        duration: (item.duration as number | null) ?? null,
        createdAt: item.created_at,
      })),
      total: data.total ?? 0,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json({ detail: "request timeout" }, { status: 504 });
    }
    return NextResponse.json({ detail: "failed to fetch popular results" }, { status: 500 });
  }
}
