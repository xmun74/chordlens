import { NextRequest, NextResponse } from "next/server";
import { MOCK_RESULT } from "@/shared/lib/mockData";

// 실제 백엔드가 없을 때 Mock 데이터를 반환하는 로컬 API Route
export async function POST(req: NextRequest) {
  const { url } = await req.json().catch(() => ({ url: "" }));

  // 실제 Railway URL이 설정된 경우 프록시 (선택적)
  const railwayUrl = process.env.RAILWAY_URL; // 서버 전용 변수 (public 아님)
  if (railwayUrl?.startsWith("http")) {
    const upstream = await fetch(`${railwayUrl}/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  }

  // Mock: 1초 딜레이 후 응답 (실제 처리 시간은 프론트에서 시뮬레이션)
  await new Promise((r) => setTimeout(r, 1000));

  return NextResponse.json(MOCK_RESULT);
}
