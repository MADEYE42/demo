import { connectDB } from "@/lib/db";
import { Message } from "@/models/Message";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (!user || typeof user === "string" || !("id" in user)) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const { content, projectId } = await req.json();
  if (!content || !projectId) return NextResponse.json({ msg: "Missing fields" }, { status: 400 });

  const message = await Message.create({
    content,
    projectId,
    senderId: (user as any).id,
  });

  return NextResponse.json({ message }, { status: 201 });
}
