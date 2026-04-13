import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { Session } from "@/types";

export async function GET() {
  try {
    const db = await getDb();
    const sessions = await db
      .collection<Session>("sessions")
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ sessions });
  } catch (err) {
    console.error("GET /api/sessions error:", err);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Omit<Session, "id" | "createdAt">;
    const db = await getDb();
    const newSession: Session = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.collection("sessions").insertOne(newSession as any);
    return NextResponse.json({ id: newSession.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/sessions error:", err);
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
  }
}
