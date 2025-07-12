import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Project } from "@/models/Project";
import { Inventory } from "@/models/Inventory";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (
    !user ||
    typeof user !== "object" ||
    user === null ||
    !("role" in user) ||
    (user as { role?: string }).role !== "admin"
  ) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const userCount = await User.countDocuments();
  const projectCount = await Project.countDocuments();
  const inventoryCount = await Inventory.countDocuments();

  return NextResponse.json({ userCount, projectCount, inventoryCount });
}
