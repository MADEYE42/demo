import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ msg: "Missing token" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || typeof user !== "object" || Array.isArray(user)) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "manufacturer") {
      return NextResponse.json({ msg: "Forbidden: Not a manufacturer" }, { status: 403 });
    }

    // ✅ Only fetch truly unassigned projects
    const projects = await Project.find({
      $or: [
        { manufacturerId: { $exists: false } },
        { manufacturerId: null }
      ]
    }).sort({ createdAt: -1 });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error: any) {
    console.error("🔥 Error in /api/projects/unassigned:", error.message);
    return NextResponse.json(
      { msg: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
