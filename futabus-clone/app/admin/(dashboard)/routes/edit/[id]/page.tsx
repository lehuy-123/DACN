"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../../../../routes/form.module.css";
import { getData, putData } from "@/lib/api";

interface EditPageProps {
  params: { id: string };
}

export default function EditRoutePage({ params }: EditPageProps) {
  const { id } = params;
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData("trip").then((data) => {
      const item = data.find((r: any) => r._id === id);
      if (item) setFormData(item);
    });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await putData(`trip/${id}`, formData); // 🟢 cập nhật dữ liệu thật
    alert("✅ Cập nhật thành công!");
    setLoading(false);
  };

  if (!formData)
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Đang tải dữ liệu...</h1>
        </div>
      </div>
    );

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Chỉnh sửa tuyến: {formData.routeName}</h1>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tên tuyến</label>
            <input
              type="text"
              name="routeName"
              value={formData.routeName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Điểm đi</label>
            <input
              type="text"
              name="from"
              value={formData.from}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Điểm đến</label>
            <input
              type="text"
              name="to"
              value={formData.to}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Khoảng cách</label>
            <input
              type="number"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Thời gian</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.actions}>
            <Link
              href="/admin/routes"
              className={`${styles.button} ${styles.cancelButton}`}
            >
              Hủy
            </Link>
            <button
              type="submit"
              className={`${styles.button} ${styles.saveButton}`}
              disabled={loading}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
