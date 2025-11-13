import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  method: String,
  amount: Number,
  status: { type: String, default: "paid" },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model("Payment", paymentSchema);
