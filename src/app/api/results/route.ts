import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl?.startsWith("http")) {
    return NextResponse.json({ detail: "API URL이 설정되지 않았습니다." }, { status: 503 });
  }

  const { searchParams } = req.nextUrl;
  const params = searchParams.toString();
  const url = `${apiUrl}/results${params ? `?${params}` : ""}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  try {
    const upstream = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!upstream.ok) {
      const error = await upstream.json().catch(() => ({ detail: upstream.statusText }));
      return NextResponse.json(error, { status: upstream.status });
    }

    const data = await upstream.json();

    const transformed = {
      items: (data.items ?? []).map((item: Record<string, unknown>) => ({
        id: item.id,
        videoUrl: item.video_url,
        title: item.title ?? null,
        channelName: item.channel_name ?? null,
        thumbnailUrl: item.thumbnail_url ?? null,
        createdAt: item.created_at,
      })),
      total: data.total ?? 0,
    };

    return NextResponse.json(transformed);
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json({ detail: "request timeout" }, { status: 504 });
    }
    return NextResponse.json({ detail: "failed to fetch results" }, { status: 500 });
  }
}
