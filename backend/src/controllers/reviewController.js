import Review from "../models/Review.js";
export const createReview = async (req, res) => res.json(await Review.create(req.body));
export const getReviews = async (_, res) => res.json(await Review.find().populate("trip"));
export const getReview = async (req, res) => res.json(await Review.findById(req.params.id));
export const updateReview = async (req, res) =>
  res.json(await Review.findByIdAndUpdate(req.params.id, req.body, { new: true }));
export const deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
export const searchReview = async (req, res) => {
  const q = req.query.q;
  res.json(await Review.find({ userName: new RegExp(q, "i") }).populate("trip"));
};
