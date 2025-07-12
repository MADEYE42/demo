import { connectDB } from "@/lib/db";
import { Inventory } from "@/models/Inventory";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  // Type guard for user object
  function isManufacturerUser(obj: unknown): obj is { id: string; role: string } {
    return (
      obj !== null &&
      typeof obj === "object" &&
      "id" in obj &&
      "role" in obj &&
      typeof (obj as Record<string, unknown>).id === "string" &&
      (obj as Record<string, unknown>).role === "manufacturer"
    );
  }

  if (!isManufacturerUser(user)) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const entries = await Inventory.find({ manufacturerId: user.id }).sort({ createdAt: -1 });
  return NextResponse.json({ entries });
}
