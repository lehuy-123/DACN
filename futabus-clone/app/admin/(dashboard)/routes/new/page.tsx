"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "../../../routes/form.module.css";
import { postData } from "@/lib/api";

export default function CreateRoutePage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    await postData("trip", data); // 🟢 gửi dữ liệu thật
    alert("✅ Đã thêm tuyến xe mới!");
    setLoading(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Thêm tuyến xe mới</h1>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tên tuyến</label>
            <input
              type="text"
              name="routeName"
              className={styles.input}
              placeholder="VD: TP.HCM - Đà Lạt"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Điểm đi</label>
            <input
              type="text"
              name="from"
              className={styles.input}
              placeholder="VD: Bến xe Miền Đông"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Điểm đến</label>
            <input
              type="text"
              name="to"
              className={styles.input}
              placeholder="VD: Bến xe Liên tỉnh Đà Lạt"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Khoảng cách (km)</label>
            <input type="number" name="distance" className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Thời gian ước tính</label>
            <input type="text" name="duration" className={styles.input} />
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
              {loading ? "Đang lưu..." : "Lưu tuyến xe"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
