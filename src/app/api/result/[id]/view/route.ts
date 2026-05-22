import { NextRequest, NextResponse } from "next/server";
import { buildUpstreamUrl, getApiBaseUrl } from "@/shared/api/upstream";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    return new NextResponse(null, { status: 503 });
  }
  const encodedId = encodeURIComponent(id);

  try {
    await fetch(buildUpstreamUrl(apiBaseUrl, `/results/${encodedId}/view`), { method: "POST" });
  } catch {
    // fire-and-forget
  }

  return new NextResponse(null, { status: 204 });
}
