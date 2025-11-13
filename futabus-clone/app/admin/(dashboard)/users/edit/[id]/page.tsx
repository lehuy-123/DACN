"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../../../../users/form.module.css";
import { getData, putData } from "@/lib/api";
import { User } from "@/types";

interface EditPageProps {
  params: { id: string };
}

export default function EditUserPage({ params }: EditPageProps) {
  const { id } = params;
  const [formData, setFormData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData<User[]>("user").then((data) => {
      const user = data.find((u) => u._id === id);
      if (user) setFormData(user);
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);
    await putData<User>(`user/${id}`, formData);
    alert("✅ Đã cập nhật vai trò!");
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
            <label className={styles.label}>Email</label>
            <input className={styles.input} value={formData.email} disabled />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Vai trò</label>
            <select
              name="role"
              className={styles.select}
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className={styles.actions}>
            <Link href="/admin/users" className={`${styles.button} ${styles.cancelButton}`}>
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
