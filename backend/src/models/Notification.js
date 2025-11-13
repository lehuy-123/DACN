import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["booking", "promotion", "update"], default: "update" },
  sentAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", notificationSchema);
