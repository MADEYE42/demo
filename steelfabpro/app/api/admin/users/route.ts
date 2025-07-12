import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();

  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (
    !user ||
    typeof user === "string" ||
    typeof user !== "object" ||
    user === null ||
    !("role" in user) ||
    (user as { role?: string }).role !== "admin"
  ) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const users = await User.find({}, "-password").sort({ createdAt: -1 });
  return NextResponse.json({ users });
}
