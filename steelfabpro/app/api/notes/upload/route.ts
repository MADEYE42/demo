import { connectDB } from "@/lib/db";
import { Note } from "@/models/Note";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import Tesseract from "tesseract.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dmjtkwal5",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token || "");

    if (!user || typeof user !== "object" || user.role !== "manufacturer") {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const projectId = formData.get("projectId") as string;

    if (!file || !projectId) {
      return NextResponse.json({ msg: "Missing file or projectId" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload image to Cloudinary
    const uploaded = await new Promise<unknown>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        })
        .end(buffer);
    });

    const fileUrl = (uploaded as { secure_url: string }).secure_url;

    // OCR using tesseract.js
    const ocrResult = await Tesseract.recognize(buffer, "eng");
    const extractedText = ocrResult.data.text;

    // Save the note to DB
    const note = await Note.create({
      projectId,
      uploaderId: user.id,
      fileUrl,
      extractedText,
    });

    return NextResponse.json({ msg: "Note created successfully", note }, { status: 200 });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("❌ OCR Upload Error:", errorMessage);
    return NextResponse.json({ msg: "OCR Upload Failed", error: errorMessage }, { status: 500 });
  }
}
