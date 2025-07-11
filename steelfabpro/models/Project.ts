import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ Optional Manufacturer
    title: { type: String },
    description: { type: String },
    fileUrl: { type: String },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
