import Location from "../models/Location.js";

// ➕ Thêm địa điểm mới
export const createLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (err) {
    console.error("❌ Lỗi createLocation:", err.message);
    res.status(500).json({ message: "Lỗi khi tạo địa điểm!", error: err.message });
  }
};

// 📋 Lấy danh sách tất cả địa điểm
export const getLocations = async (_, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách địa điểm!" });
  }
};

// 🔍 Lấy chi tiết địa điểm theo ID
export const getLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: "Không tìm thấy địa điểm!" });
    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết địa điểm!" });
  }
};

// ✏️ Cập nhật địa điểm
export const updateLocation = async (req, res) => {
  try {
    const updated = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy địa điểm để cập nhật!" });
    res.status(200).json({ message: "Cập nhật thành công!", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật địa điểm!" });
  }
};

// ❌ Xoá địa điểm
export const deleteLocation = async (req, res) => {
  try {
    const deleted = await Location.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy địa điểm để xoá!" });
    res.status(200).json({ message: "Đã xoá địa điểm thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xoá địa điểm!" });
  }
};

// 🔎 Tìm kiếm địa điểm theo tên
export const searchLocation = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.status(400).json({ message: "Thiếu từ khoá tìm kiếm (q)!" });

    const results = await Location.find({ name: new RegExp(q, "i") });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tìm kiếm địa điểm!" });
  }
};
