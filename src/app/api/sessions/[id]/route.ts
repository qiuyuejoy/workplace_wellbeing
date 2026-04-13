import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { Session, SessionRating } from "@/types";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { rating } = (await req.json()) as { rating: SessionRating };
    const db = await getDb();
    const result = await db
      .collection<Session>("sessions")
      .updateOne({ id }, { $set: { rating } });
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/sessions/[id] error:", err);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    await db.collection<Session>("sessions").deleteOne({ id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/sessions/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
  }
}
