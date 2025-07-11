import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (
    !user ||
    typeof user === "string" ||
    (user as any).role !== "client"
  ) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const projects = await Project.find({ clientId: user.id }).sort({ createdAt: -1 });
  return NextResponse.json({ projects });
}
