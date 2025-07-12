import { connectDB } from "@/lib/db";
import { Note } from "@/models/Note";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    await connectDB();

    const { projectId } = await params;
    const notes = await Note.find({ projectId }).sort({ createdAt: -1 });

    return NextResponse.json({ notes }, { status: 200 });
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "An unknown error occurred";
    console.error("Error fetching notes:", errorMsg);

    return NextResponse.json(
      { msg: "Failed to fetch notes", error: errorMsg },
      { status: 500 }
    );
  }
}