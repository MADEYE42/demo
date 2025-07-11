import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Project" },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderRole: { type: String, enum: ["client", "manufacturer", "admin"], required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
