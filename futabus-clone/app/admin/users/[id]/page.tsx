// app/admin/users/[id]/page.tsx
import React from "react";
import Link from "next/link";
import styles from "../detail.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { getData } from "@/lib/api";

interface DetailPageProps {
  params: { id: string };
}

export default async function UserDetailPage({ params }: DetailPageProps)
 {
  const { id } = params;

  // 🟢 GỌI API THẬT
  const users = await getData<any[]>("user");
  const user = users.find((u) => u._id === id || u.id === id);

  if (!user) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Lỗi: Không tìm thấy người dùng</h1>
        <Link
          href="/admin/users"
          className={styles.backIconLink}
          title="Quay lại danh sách"
        >
          <FaArrowLeft />
        </Link>
      </div>
    );
  }


  const roleClass =
    user.role === "admin"
      ? styles.admin
      : user.role === "editor"
      ? styles.editor
      : styles.user;

  return (
    <div className={styles.container}>
      <Link
        href="/admin/users"
        className={styles.backIconLink}
        title="Quay lại danh sách"
      >
        <FaArrowLeft />
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Chi tiết Người dùng</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.grid}>
            <div>
              <label className={styles.label}>ID Người dùng</label>
              <p className={styles.value}>{user._id || user.id}</p>
            </div>
            <div>
              <label className={styles.label}>Họ và Tên</label>
              <p className={styles.value}>{user.name || "Chưa có"}</p>
            </div>
            <div>
              <label className={styles.label}>Email</label>
              <p className={styles.value}>{user.email}</p>
            </div>
            <div>
              <label className={styles.label}>Ngày tham gia</label>
              <p className={styles.value}>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                  : "Không rõ"}
              </p>
            </div>
            <div>
              <label className={styles.label}>Vai trò</label>
              <span className={`${styles.role} ${roleClass}`}>
                {user.role || "User"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
