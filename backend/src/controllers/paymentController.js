import Payment from "../models/Payment.js";
export const createPayment = async (req, res) => res.json(await Payment.create(req.body));
export const getPayments = async (_, res) => res.json(await Payment.find().populate("booking"));
export const getPayment = async (req, res) =>
  res.json(await Payment.findById(req.params.id).populate("booking"));
export const updatePayment = async (req, res) =>
  res.json(await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true }));
export const deletePayment = async (req, res) => {
  await Payment.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
export const searchPayment = async (req, res) => {
  const q = req.query.q;
  res.json(await Payment.find({ method: new RegExp(q, "i") }).populate("booking"));
};
