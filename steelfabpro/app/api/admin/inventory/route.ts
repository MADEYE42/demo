import { connectDB } from "@/lib/db";
import { Inventory } from "@/models/Inventory";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();

  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (
    !user ||
    (typeof user !== "object" || user === null || (user as { role?: string }).role !== "admin")
  ) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }
  
  const entries = await Inventory.find({})
    .populate("manufacturerId", "name email")
    .sort({ createdAt: -1 });

  return NextResponse.json({ entries });
}
