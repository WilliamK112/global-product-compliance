import { NextResponse } from "next/server";
import { parseCatalog } from "@/lib/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    return NextResponse.json(parseCatalog(body.csv_text || ""));
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
