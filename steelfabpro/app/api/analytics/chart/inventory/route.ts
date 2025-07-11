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
    typeof user === "string" ||
    (typeof user === "object" && "role" in user && (user as { role?: string }).role !== "admin")
  ) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const result = await Inventory.aggregate([
    {
      $group: {
        _id: "$type",
        total: { $sum: "$quantity" },
      },
    },
  ]);

  return NextResponse.json({ data: result });
}
