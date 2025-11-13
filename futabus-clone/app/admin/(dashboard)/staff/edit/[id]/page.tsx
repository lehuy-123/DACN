"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../../../staff/form.module.css";
import { getData, putData } from "@/lib/api";
import { Driver } from "@/types";

interface EditPageProps {
  params: { id: string };
}

export default function EditStaffPage({ params }: EditPageProps) {
  const { id } = params;
  const [formData, setFormData] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData<Driver[]>("driver").then((data) => {
      const item = data.find((d) => d._id === id);
      if (item) setFormData(item);
    });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);
    await putData<Driver>(`driver/${id}`, formData);
    alert("✅ Đã cập nhật nhân viên!");
    setLoading(false);
  };

  if (!formData)
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Đang tải...</h1>
        </div>
      </div>
    );

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Chỉnh sửa: {formData.name}</h1>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Họ và Tên</label>
            <input
              name="name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Số điện thoại</label>
            <input
              name="phone"
              className={styles.input}
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Chức vụ</label>
            <select
              name="role"
              className={styles.select}
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Tài xế">Tài xế</option>
              <option value="Phụ xe">Phụ xe</option>
              <option value="Nhân viên VP">Nhân viên VP</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>GPLX</label>
            <input
              name="license"
              className={styles.input}
              value={formData.license}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Trạng thái</label>
            <select
              name="status"
              className={styles.select}
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Đang làm việc</option>
              <option value="inactive">Tạm nghỉ</option>
            </select>
          </div>

          <div className={styles.actions}>
            <Link
              href="/admin/staff"
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
