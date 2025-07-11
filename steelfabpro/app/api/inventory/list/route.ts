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
    typeof user !== "object" ||
    user === null ||
    (user as any).role !== "manufacturer"
  ) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const entries = await Inventory.find({ manufacturerId: user.id }).sort({ createdAt: -1 });
  return NextResponse.json({ entries });
}
