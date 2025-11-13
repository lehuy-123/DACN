import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  plateNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  capacity: { type: Number, default: 4 },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

export default mongoose.model("Vehicle", vehicleSchema);
