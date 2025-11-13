import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  userName: String,
  rating: Number,
  comment: String,
});
export default mongoose.model("Review", reviewSchema);
