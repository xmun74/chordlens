import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl?.startsWith("http")) {
    return new NextResponse(null, { status: 503 });
  }

  try {
    await fetch(`${apiUrl}/results/${id}/view`, { method: "POST" });
  } catch {
    // fire-and-forget
  }

  return new NextResponse(null, { status: 204 });
}
