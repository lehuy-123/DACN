import VehicleLocation from "../models/VehicleLocation.js";

// 🟢 1. Cập nhật vị trí hiện tại của xe
export const updateVehicleLocation = async (req, res) => {
  try {
    const { plateNumber, currentLat, currentLng } = req.body;

    const vehicle = await VehicleLocation.findOneAndUpdate(
      { plateNumber },
      { currentLat, currentLng, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔵 2. Lấy vị trí hiện tại của 1 xe
export const getVehicleLocation = async (req, res) => {
  try {
    const { plateNumber } = req.params;
    const vehicle = await VehicleLocation.findOne({ plateNumber });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🟣 3. Lấy danh sách tất cả xe đang hoạt động
export const getAllVehicleLocations = async (_, res) => {
  const vehicles = await VehicleLocation.find();
  res.json(vehicles);
};
