import Driver from "../models/Driver.js";
import Trip from "../models/Trip.js";

// ➕ Thêm tài xế
export const createDriver = async (req, res) => {
  const driver = await Driver.create(req.body);
  res.status(201).json({ message: "Thêm tài xế thành công!", driver });
};

// 📋 Danh sách tài xế
export const getDrivers = async (_, res) => res.json(await Driver.find());

// 🔗 Gán tài xế cho chuyến xe
export const assignDriver = async (req, res) => {
  const trip = await Trip.findByIdAndUpdate(
    req.params.tripId,
    { "busInfo.driverName": req.body.name, "busInfo.phone": req.body.phone },
    { new: true }
  );
  res.json({ message: "Gán tài xế thành công!", trip });
};
