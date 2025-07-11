import { connectDB } from "@/lib/db";
import { Inventory } from "@/models/Inventory";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (
    !user ||
    typeof user !== "object" ||
    !("role" in user) ||
    (user as any).role !== "manufacturer"
  ) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const { material, quantity, type } = await req.json();

  const entry = await Inventory.create({
    manufacturerId: user.id,
    material,
    quantity,
    type,
  });

  return NextResponse.json({ entry }, { status: 201 });
}
