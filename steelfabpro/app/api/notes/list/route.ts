import { connectDB } from "@/lib/db";
import { Note } from "@/models/Note";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (
    !user ||
    typeof user !== "object" ||
    !("role" in user) ||
    (user as { role?: string }).role !== "manufacturer"
  ) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await req.json();
  const notes = await Note.find({ projectId }).sort({ createdAt: -1 });

  return NextResponse.json({ notes });
}
