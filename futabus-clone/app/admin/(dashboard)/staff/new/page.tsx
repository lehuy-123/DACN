"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "../../../staff/form.module.css";
import { postData } from "@/lib/api";
import { Driver } from "@/types";

export default function CreateStaffPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    await postData<Driver>("driver", data);
    alert("✅ Đã thêm nhân viên mới!");
    setLoading(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Thêm nhân viên mới</h1>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Họ và Tên</label>
            <input name="name" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Số điện thoại</label>
            <input type="tel" name="phone" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Chức vụ</label>
            <select name="role" className={styles.select}>
              <option value="Tài xế">Tài xế</option>
              <option value="Phụ xe">Phụ xe</option>
              <option value="Nhân viên VP">Nhân viên VP</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>GPLX (Nếu có)</label>
            <input name="license" className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Trạng thái</label>
            <select name="status" className={styles.select}>
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
              {loading ? "Đang lưu..." : "Lưu nhân viên"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
