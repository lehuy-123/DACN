import Vehicle from "../models/Vehicle.js";

// ✅ 1. Thêm mới
export const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ 2. Hiển thị danh sách tất cả xe
export const getVehicles = async (_, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 3. Lấy thông tin chi tiết 1 xe theo ID
export const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch {
    res.status(400).json({ message: "Invalid vehicle ID" });
  }
};

// ✅ 4. Cập nhật thông tin xe
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ 5. Xóa xe
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ 6. Tìm kiếm xe theo tên hoặc biển số
export const searchVehicles = async (req, res) => {
  try {
    const q = req.query.q || "";
    const vehicles = await Vehicle.find({
      $or: [
        { name: new RegExp(q, "i") },
        { plateNumber: new RegExp(q, "i") },
      ],
    });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
