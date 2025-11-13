import Promotion from "../models/Promotion.js";

// ➕ CREATE
export const createPromotion = async (req, res) => {
  try {
    const promo = await Promotion.create(req.body);
    res.status(201).json({ message: "Tạo mã khuyến mãi thành công!", promo });
  } catch (err) {
    res.status(400).json({ message: "Lỗi khi tạo mã khuyến mãi!", error: err.message });
  }
};

// 📋 READ ALL + Pagination + Filter
export const getPromotions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Promotion.countDocuments();
    const promotions = await Promotion.find().skip(skip).limit(limit).sort({ createdAt: -1 });

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      promotions,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách mã khuyến mãi!", error: err.message });
  }
};

// 🔍 SEARCH theo code
export const searchPromotion = async (req, res) => {
  try {
    const q = req.query.q || "";
    const promos = await Promotion.find({ code: new RegExp(q, "i") });
    res.json(promos);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔎 READ ONE
export const getPromotion = async (req, res) => {
  try {
    const promo = await Promotion.findById(req.params.id);
    if (!promo) return res.status(404).json({ message: "Không tìm thấy mã khuyến mãi!" });
    res.json(promo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✏️ UPDATE
export const updatePromotion = async (req, res) => {
  try {
    const promo = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promo) return res.status(404).json({ message: "Không tìm thấy mã khuyến mãi!" });
    res.json({ message: "Cập nhật thành công!", promo });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ❌ DELETE
export const deletePromotion = async (req, res) => {
  try {
    const deleted = await Promotion.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy mã khuyến mãi!" });
    res.json({ message: "Đã xoá mã khuyến mãi thành công!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
