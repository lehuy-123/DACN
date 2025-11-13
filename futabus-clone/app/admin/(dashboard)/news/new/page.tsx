"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "../../../news/form.module.css";
import { postData } from "@/lib/api";

export default function CreateNewsPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    await postData("news", data);
    alert("✅ Đã thêm bài viết mới!");
    setLoading(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Thêm bài viết mới</h1>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.formGroupFull}>
            <label className={styles.label}>Tiêu đề bài viết</label>
            <input name="title" className={styles.input} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tác giả</label>
            <input name="author" className={styles.input} defaultValue="Admin" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Trạng thái</label>
            <select name="status" className={styles.select}>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>
          <div className={styles.formGroupFull}>
            <label className={styles.label}>Nội dung</label>
            <textarea name="content" className={styles.textarea} />
          </div>
          <div className={styles.actions}>
            <Link href="/admin/news" className={`${styles.button} ${styles.cancelButton}`}>Hủy</Link>
            <button type="submit" className={`${styles.button} ${styles.saveButton}`} disabled={loading}>
              {loading ? "Đang đăng..." : "Đăng bài"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
