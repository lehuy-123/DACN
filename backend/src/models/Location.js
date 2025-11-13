import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["airport", "station", "city"], required: true },
    description: String,
  },
  { timestamps: true }
);




export default mongoose.models.Location || mongoose.model("Location", locationSchema);
