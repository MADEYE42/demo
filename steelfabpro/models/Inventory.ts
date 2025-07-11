import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    material: String,
    quantity: Number,
    type: { type: String, enum: ["in", "out"] },
  },
  { timestamps: true }
);

export const Inventory =
  mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);
