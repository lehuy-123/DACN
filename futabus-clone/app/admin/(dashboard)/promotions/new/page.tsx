"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "../../../promotions/form.module.css";
import { postData } from "@/lib/api";

export default function CreatePromotionPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    await postData("promotion", data); // 🟢 Gửi dữ liệu thật đến backend

    alert("✅ Đã tạo khuyến mãi mới!");
    setLoading(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tạo Khuyến mãi mới</h1>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Mã Code</label>
            <input type="text" name="code" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Loại giảm giá</label>
            <select name="discountType" className={styles.select}>
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Số tiền cố định</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Giá trị</label>
            <input type="number" name="value" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Số lượng tối đa</label>
            <input type="number" name="maxUsage" className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ngày bắt đầu</label>
            <input type="date" name="startDate" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ngày kết thúc</label>
            <input type="date" name="endDate" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Nhóm khách hàng</label>
            <input
              type="text"
              name="customerGroup"
              className={styles.input}
              placeholder="VD: Tất cả, Khách hàng mới..."
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.label}>Mô tả</label>
            <textarea name="description" className={styles.textarea} required />
          </div>

          <div className={styles.actions}>
            <Link href="/admin/promotions" className={`${styles.button} ${styles.cancelButton}`}>
              Hủy
            </Link>
            <button type="submit" className={`${styles.button} ${styles.saveButton}`} disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu Khuyến mãi"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
