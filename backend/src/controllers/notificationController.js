import Notification from "../models/Notification.js";

export const sendNotification = async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;

    const newNotification = await Notification.create({ userId, title, message, type });

    // Gửi realtime qua socket (nếu có)
    if (req.io) req.io.emit("notification", newNotification);

    res.status(201).json({ success: true, notification: newNotification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
