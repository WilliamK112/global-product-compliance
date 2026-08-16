import { NextResponse } from "next/server";
import { DEMO_CATALOG_CSV } from "@/lib/demo-catalog";
import { parseCatalog } from "@/lib/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return new NextResponse(DEMO_CATALOG_CSV, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=cansell-catalog.csv",
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    return NextResponse.json(parseCatalog(body.csv_text || ""));
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
