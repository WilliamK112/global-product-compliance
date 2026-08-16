import { NextResponse } from "next/server";
import { recheck } from "@/lib/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    return NextResponse.json(recheck(body.sku, body.extra_certifications || []));
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 404 });
  }
}
