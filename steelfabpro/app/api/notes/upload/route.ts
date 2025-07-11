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
    user.role !== "manufacturer"
  ) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const { fileUrl, projectId } = await req.json();
  if (!fileUrl || !projectId)
    return NextResponse.json({ msg: "Missing fields" }, { status: 400 });

  // Simulate OCR: Just generate dummy content
  const simulatedText = `Simulated OCR text from file: ${fileUrl.slice(0, 20)}...`;

  const note = await Note.create({
    projectId,
    uploaderId: user.id,
    fileUrl,
    extractedText: simulatedText,
  });

  return NextResponse.json({ note }, { status: 201 });
}
