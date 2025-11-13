import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  content: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["delay", "extra_fee", "lost_item", "other"], 
    default: "other" 
  },
  status: { 
    type: String, 
    enum: ["pending", "resolved"], 
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Complaint", complaintSchema);
