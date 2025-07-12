import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token || "");

    if (
      !user ||
      typeof user !== "object" ||
      Array.isArray(user) ||
      !user.id ||
      user.role !== "manufacturer"
    ) {
      return NextResponse.json(
        { msg: `Access denied. User role is not 'manufacturer'.`, user },
        { status: 403 }
      );
    }

    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ msg: "Missing projectId in request body" }, { status: 400 });
    }

    const existing = await Project.findById(projectId);
    if (!existing) {
      return NextResponse.json({ msg: "Project not found" }, { status: 404 });
    }

    if (existing.manufacturerId) {
      return NextResponse.json({ msg: "Project already assigned" }, { status: 409 });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { manufacturerId: user.id, status: "Accepted" }, // ✅ Add status update
      { new: true }
    );

    return NextResponse.json(
      { msg: "Project successfully assigned", project: updatedProject },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMsg = (error && typeof error === "object" && "message" in error)
      ? (error as { message: string }).message
      : String(error);
    console.error("❌ Error in /api/projects/assign:", errorMsg);
    return NextResponse.json(
      { msg: "Internal server error", error: errorMsg },
      { status: 500 }
    );
  }
}
