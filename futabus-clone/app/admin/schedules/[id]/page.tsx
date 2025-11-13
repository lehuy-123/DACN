// app/admin/schedules/[id]/page.tsx
import React from "react";
import Link from "next/link";
import styles from "../detail.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { getData } from "@/lib/api";

interface DetailPageProps {
  params: { id: string };
}

export default async function ScheduleDetailPage({ params }: DetailPageProps) {
  const { id } = params;

  // 🟢 GỌI API THẬT (Trip hoặc Schedule)
  const schedules = await getData<any[]>("trip"); // hoặc "schedule" nếu backend bạn có model riêng
  const schedule = schedules.find((s) => s._id === id || s.id === id);

  if (!schedule) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Không tìm thấy lịch trình: {id}</h1>
        <Link
          href="/admin/schedules"
          className={styles.backIconLink}
          title="Quay lại danh sách"
        >
          <FaArrowLeft />
        </Link>
      </div>
    );
  }

  // Map trạng thái backend sang class CSS
  let statusClass = styles.pending;
  let statusText = "Đang xử lý";
  if (schedule.status === "upcoming") {
    statusClass = styles.upcoming;
    statusText = "Sắp khởi hành";
  } else if (schedule.status === "running") {
    statusClass = styles.running;
    statusText = "Đang chạy";
  } else if (schedule.status === "completed") {
    statusClass = styles.completed;
    statusText = "Hoàn thành";
  } else if (schedule.status === "cancelled") {
    statusClass = styles.cancelled;
    statusText = "Đã hủy";
  }

  return (
    <div className={styles.container}>
      <Link
        href="/admin/schedules"
        className={styles.backIconLink}
        title="Quay lại danh sách"
      >
        <FaArrowLeft />
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Chi tiết Lịch trình</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.grid}>
            <div>
              <label className={styles.label}>Mã chuyến</label>
              <p className={styles.valueCode}>{schedule._id || schedule.id}</p>
            </div>
            <div>
              <label className={styles.label}>Tuyến xe</label>
              <p className={styles.value}>
                {schedule.routeName ||
                  `${schedule.from || ""} - ${schedule.to || ""}`}
              </p>
            </div>
            <div>
              <label className={styles.label}>Xe</label>
              <p className={styles.value}>{schedule.vehiclePlate || "N/A"}</p>
            </div>
            <div>
              <label className={styles.label}>Giờ khởi hành</label>
              <p className={styles.value}>
                {new Date(schedule.departureTime).toLocaleString("vi-VN")}
              </p>
            </div>
            <div>
              <label className={styles.label}>Dự kiến đến</label>
              <p className={styles.value}>
                {schedule.arrivalTime
                  ? new Date(schedule.arrivalTime).toLocaleString("vi-VN")
                  : "Chưa có"}
              </p>
            </div>
            <div>
              <label className={styles.label}>Ghế (Đã đặt / Tổng)</label>
              <p className={styles.value}>
                {`${schedule.bookedSeats || 0}/${schedule.totalSeats || 40}`}
              </p>
            </div>
            <div>
              <label className={styles.label}>Trạng thái</label>
              <span className={`${styles.status} ${statusClass}`}>
                {statusText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
