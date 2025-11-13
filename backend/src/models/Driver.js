import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true },
});

// ⚡ Fix lỗi OverwriteModelError
export default mongoose.models.Driver || mongoose.model("Driver", driverSchema);
