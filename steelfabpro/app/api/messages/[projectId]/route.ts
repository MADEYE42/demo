import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { Message } from "@/models/Message";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await connectDB();

    const { projectId } = params;

    const messages = await Message.find({ projectId }).sort({ createdAt: 1 });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/messages error:", error.message);
    return NextResponse.json(
      { msg: "Failed to fetch messages." },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token || "");

    if (!user || typeof user !== "object" || Array.isArray(user)) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const { text } = await req.json();
    if (!text || text.trim() === "") {
      return NextResponse.json({ msg: "Message text is required." }, { status: 400 });
    }

    const message = await Message.create({
      projectId: params.projectId,
      senderId: user.id,
      senderRole: user.role,
      text,
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/messages error:", error.message);
    return NextResponse.json(
      { msg: "Failed to send message." },
      { status: 500 }
    );
  }
}
