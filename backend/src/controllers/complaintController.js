import Complaint from "../models/Complaint.js";

export const createComplaint = async (req, res) => {
  try {
    const { userId, tripId, content, category } = req.body;

    const complaint = await Complaint.create({
      userId,
      tripId,
      content,
      category,
    });

    res.status(201).json({ success: true, complaint });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
