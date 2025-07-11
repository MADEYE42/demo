import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (
    !user ||
    typeof user !== "object" ||
    Array.isArray(user) ||
    (user as any).role !== "client"
  ) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.json();
  const { title, description, fileUrl } = formData;

  const project = await Project.create({
    clientId: user.id,
    title,
    description,
    fileUrl,
    manufacturerId: null,     // ✅ explicitly unassigned
    status: "PENDING",        // ✅ default status
  });

  return NextResponse.json({ project }, { status: 201 });
}
