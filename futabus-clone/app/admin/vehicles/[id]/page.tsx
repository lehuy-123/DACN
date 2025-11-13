// app/admin/vehicles/[id]/page.tsx
import React from "react";
import Link from "next/link";
import styles from "../detail.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { getData } from "@/lib/api";

interface DetailPageProps {
  params: { id: string };
}

export default async function VehicleDetailPage({ params }: DetailPageProps) {
  const { id } = params;

  // 🟢 GỌI API THẬT
  const vehicles = await getData<any[]>("vehicle");
  const vehicle = vehicles.find((v) => v._id === id || v.id === id);

  if (!vehicle) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Lỗi: Không tìm thấy xe</h1>
        <Link
          href="/admin/vehicles"
          className={styles.backIconLink}
          title="Quay lại danh sách"
        >
          <FaArrowLeft />
        </Link>
      </div>
    );
  }

  // Map trạng thái sang class CSS
  let statusClass;
  if (
    vehicle.status?.toLowerCase() === "active" ||
    vehicle.status === "Đang hoạt động"
  )
    statusClass = styles.active;
  else if (
    vehicle.status?.toLowerCase() === "maintenance" ||
    vehicle.status === "Đang bảo trì"
  )
    statusClass = styles.maintenance;
  else statusClass = styles.inactive;

  return (
    <div className={styles.container}>
      <Link
        href="/admin/vehicles"
        className={styles.backIconLink}
        title="Quay lại danh sách"
      >
        <FaArrowLeft />
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Chi tiết Xe: {vehicle.licensePlate}</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.grid}>
            <div>
              <label className={styles.label}>Mã xe</label>
              <p className={styles.value}>{vehicle._id || vehicle.id}</p>
            </div>
            <div>
              <label className={styles.label}>Biển số</label>
              <p className={styles.valueCode}>{vehicle.licensePlate}</p>
            </div>
            <div>
              <label className={styles.label}>Loại xe</label>
              <p className={styles.value}>{vehicle.type || "Chưa cập nhật"}</p>
            </div>
            <div>
              <label className={styles.label}>Số ghế</label>
              <p className={styles.value}>
                {vehicle.seats ? `${vehicle.seats} chỗ` : "Không rõ"}
              </p>
            </div>
            <div>
              <label className={styles.label}>Tài xế hiện tại</label>
              <p className={styles.value}>
                {vehicle.driverName || vehicle.driver || "Chưa có"}
              </p>
            </div>
            <div>
              <label className={styles.label}>Trạng thái</label>
              <span className={`${styles.status} ${statusClass}`}>
                {vehicle.status === "active"
                  ? "Đang hoạt động"
                  : vehicle.status === "maintenance"
                  ? "Đang bảo trì"
                  : "Ngưng hoạt động"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
