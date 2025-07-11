import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (
    !user ||
    typeof user === "string" ||
    (typeof user === "object" && "role" in user === false) ||
    (typeof user === "object" && user.role !== "admin")
  ) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const result = await Project.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return NextResponse.json({ data: result });
}
