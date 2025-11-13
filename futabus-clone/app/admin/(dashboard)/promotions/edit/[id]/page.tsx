"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../../../../promotions/form.module.css";
import { getData, putData } from "@/lib/api";

interface EditPageProps {
  params: { id: string };
}

export default function EditPromotionPage({ params }: EditPageProps) {
  const { id } = params;
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData("promotion").then((data) => {
      const item = data.find((p: any) => p._id === id);
      if (item) setFormData(item);
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await putData(`promotion/${id}`, formData);
    alert("✅ Đã cập nhật khuyến mãi!");
    setLoading(false);
  };

  if (!formData)
    return (
      <div className={styles.card}>
        <h1 className={styles.title}>Đang tải dữ liệu...</h1>
      </div>
    );

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Chỉnh sửa Khuyến mãi: {formData.code}</h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Mã Code</label>
            <input type="text" name="code" className={styles.input} value={formData.code} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Loại giảm giá</label>
            <select name="discountType" className={styles.select} value={formData.discountType} onChange={handleChange}>
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Số tiền cố định</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Giá trị</label>
            <input type="number" name="value" className={styles.input} value={formData.value} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ngày bắt đầu</label>
            <input type="date" name="startDate" className={styles.input} value={formData.startDate?.slice(0, 10)} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ngày kết thúc</label>
            <input type="date" name="endDate" className={styles.input} value={formData.endDate?.slice(0, 10)} onChange={handleChange} />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.label}>Mô tả</label>
            <textarea name="description" className={styles.textarea} value={formData.description} onChange={handleChange} />
          </div>

          <div className={styles.actions}>
            <Link href="/admin/promotions" className={`${styles.button} ${styles.cancelButton}`}>
              Hủy
            </Link>
            <button type="submit" className={`${styles.button} ${styles.saveButton}`} disabled={loading}>
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
