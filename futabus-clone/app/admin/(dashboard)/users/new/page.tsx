"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "../../../users/form.module.css";
import { postData } from "@/lib/api";
import { User } from "@/types";

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    await postData<User>("user", data);
    alert("✅ Đã thêm người dùng mới!");
    setLoading(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Thêm Người dùng</h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Họ và Tên</label>
            <input name="name" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input type="email" name="email" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Mật khẩu</label>
            <input type="password" name="password" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Vai trò</label>
            <select name="role" className={styles.select}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className={styles.actions}>
            <Link href="/admin/users" className={`${styles.button} ${styles.cancelButton}`}>
              Hủy
            </Link>
            <button type="submit" className={`${styles.button} ${styles.saveButton}`} disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
