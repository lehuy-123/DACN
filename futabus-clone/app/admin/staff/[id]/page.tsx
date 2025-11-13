// app/admin/staff/[id]/page.tsx
import React from "react";
import Link from "next/link";
import styles from "../detail.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { getData } from "@/lib/api";

interface DetailPageProps {
  params: { id: string };
}

export default async function StaffDetailPage({ params }: DetailPageProps) {
  const { id } = params;

  // 🟢 GỌI API THẬT
  const staffList = await getData<any[]>("driver");
  const staff = staffList.find((s) => s._id === id || s.id === id);

  if (!staff) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Lỗi: Không tìm thấy nhân viên</h1>
        <Link
          href="/admin/staff"
          className={styles.backIconLink}
          title="Quay lại danh sách"
        >
          <FaArrowLeft />
        </Link>
      </div>
    );
  }

  const statusClass =
    staff.status?.toLowerCase() === "active" ||
    staff.status === "Đang làm việc"
      ? styles.active
      : styles.leave;

  return (
    <div className={styles.container}>
      <Link
        href="/admin/staff"
        className={styles.backIconLink}
        title="Quay lại danh sách"
      >
        <FaArrowLeft />
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Chi tiết Nhân viên: {staff.name}</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.grid}>
            <div>
              <label className={styles.label}>Mã NV</label>
              <p className={styles.value}>{staff._id || staff.id}</p>
            </div>
            <div>
              <label className={styles.label}>Họ và Tên</label>
              <p className={styles.value}>{staff.name}</p>
            </div>
            <div>
              <label className={styles.label}>Số điện thoại</label>
              <p className={styles.value}>{staff.phone || "Không có"}</p>
            </div>
            <div>
              <label className={styles.label}>Chức vụ</label>
              <p className={styles.value}>{staff.role || "Tài xế"}</p>
            </div>
            <div>
              <label className={styles.label}>Số GPLX</label>
              <p className={styles.value}>{staff.license || "N/A"}</p>
            </div>
            <div>
              <label className={styles.label}>Trạng thái</label>
              <span className={`${styles.status} ${statusClass}`}>
                {staff.status === "active"
                  ? "Đang làm việc"
                  : staff.status === "inactive"
                  ? "Tạm nghỉ"
                  : staff.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
