import { connectDB } from "@/lib/db";
import { Inventory } from "@/models/Inventory";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    // Extract and validate token
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ msg: "Missing token" }, { status: 401 });
    }

    const user = verifyToken(token);

    if (
      !user ||
      typeof user !== "object" ||
      !("role" in user) ||
      (user as any).role !== "manufacturer"
    ) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { material, quantity, type } = body;

    if (!material || !quantity || !type) {
      return NextResponse.json(
        { msg: "All fields (material, quantity, type) are required." },
        { status: 400 }
      );
    }

    // Create new inventory entry
    const entry = await Inventory.create({
      manufacturerId: (user as any).id,
      material,
      quantity,
      type,
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error: any) {
    console.error("Inventory Add Error:", error.message);
    return NextResponse.json(
      { msg: "Server error. Could not add inventory." },
      { status: 500 }
    );
  }
}
