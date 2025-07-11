// models/Note.ts
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileUrl: String,
    extractedText: String,
  },
  { timestamps: true }
);

export const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);
