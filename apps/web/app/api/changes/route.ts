import { NextResponse } from "next/server";
import { changeDemo } from "@/lib/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(changeDemo());
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json(changeDemo(body.csv_text || undefined));
}
