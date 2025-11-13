import Vehicle from "../models/Vehicle.js";

// ➕ Thêm xe
export const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📋 Lấy danh sách xe
export const getVehicles = async (_, res) => {
  const vehicles = await Vehicle.find();
  res.json(vehicles);
};

// 🔍 Lấy chi tiết 1 xe
export const getVehicle = async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
  res.json(vehicle);
};

// ✏️ Cập nhật xe
export const updateVehicle = async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(vehicle);
};

// ❌ Xóa xe
export const deleteVehicle = async (req, res) => {
  await Vehicle.findByIdAndDelete(req.params.id);
  res.json({ message: "Vehicle deleted" });
};

// 🔎 Tìm kiếm xe theo tên hoặc biển số
export const searchVehicle = async (req, res) => {
  const q = req.query.q;
  const vehicles = await Vehicle.find({ name: new RegExp(q, "i") });
  res.json(vehicles);
};


