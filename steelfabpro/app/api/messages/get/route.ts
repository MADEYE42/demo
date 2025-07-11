import { connectDB } from "@/lib/db";
import { Message } from "@/models/Message";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (!user) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

  const { projectId } = await req.json();

  const messages = await Message.find({ projectId })
    .populate("senderId", "name role")
    .sort({ createdAt: 1 });

  return NextResponse.json({ messages });
}
