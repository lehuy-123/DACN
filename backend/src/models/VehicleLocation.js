import mongoose from "mongoose";

const vehicleLocationSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true, unique: true },
  currentLat: { type: Number, required: true },
  currentLng: { type: Number, required: true },
  destinationLat: { type: Number, required: true },
  destinationLng: { type: Number, required: true },
  from: { type: String }, // Tên điểm đi
  to: { type: String },   // Tên điểm đến
  speed: { type: Number, default: 0 },
  status: { type: String, enum: ["running", "arrived"], default: "running" },
  updatedAt: { type: Date, default: Date.now }
});

vehicleLocationSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("VehicleLocation", vehicleLocationSchema);
