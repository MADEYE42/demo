import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token || "");

    if (!user || typeof user !== "object" || Array.isArray(user)) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    let query = {};

    if (user.role === "client") {
      query = { clientId: user.id };
    } else if (user.role === "manufacturer") {
      query = { manufacturerId: user.id };
    } else {
      return NextResponse.json({ msg: "Invalid role" }, { status: 403 });
    }

    const projects = await Project.find(query)
      .populate("manufacturerId", "name") // ✅ Populating name only
      .sort({ createdAt: -1 });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Project List Error:", error);
    return NextResponse.json({ msg: "Server error", error: error.message }, { status: 500 });
  }
}
