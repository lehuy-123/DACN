// app/admin/routes/[id]/page.tsx
import React from "react";
import Link from "next/link";
import styles from "../detail.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { getData } from "@/lib/api";

interface DetailPageProps {
  params: { id: string };
}

export default async function RouteDetailPage({ params }: DetailPageProps) {
  const { id } = params;

  // 🟢 GỌI API THẬT
  const routes = await getData<any[]>("trip");
  const route = routes.find((r) => r._id === id || r.id === id);

  if (!route) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Không tìm thấy tuyến xe: {id}</h1>
        <Link href="/admin/routes" className={styles.backIconLink}>
          <FaArrowLeft />
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link
        href="/admin/routes"
        className={styles.backIconLink}
        title="Quay lại danh sách"
      >
        <FaArrowLeft />
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Chi tiết Tuyến xe</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.grid}>
            <div>
              <label className={styles.label}>Mã tuyến</label>
              <p className={styles.valueCode}>{route._id || route.id}</p>
            </div>
            <div>
              <label className={styles.label}>Tên tuyến</label>
              <p className={styles.value}>
                {route.routeName || route.name || "Chưa có tên"}
              </p>
            </div>
            <div>
              <label className={styles.label}>Điểm đi</label>
              <p className={styles.value}>
                {route.from || route.start || "Không rõ"}
              </p>
            </div>
            <div>
              <label className={styles.label}>Điểm đến</label>
              <p className={styles.value}>
                {route.to || route.end || "Không rõ"}
              </p>
            </div>
            <div>
              <label className={styles.label}>Khoảng cách</label>
              <p className={styles.value}>
                {route.distance
                  ? `${route.distance} km`
                  : "Chưa cập nhật"}
              </p>
            </div>
            <div>
              <label className={styles.label}>Thời gian ước tính</label>
              <p className={styles.value}>
                {route.duration || route.time || "Chưa cập nhật"}
              </p>
            </div>
            <div>
              <label className={styles.label}>Giá vé</label>
              <p className={styles.value}>
                {route.price
                  ? route.price.toLocaleString("vi-VN") + "đ"
                  : "Chưa có"}
              </p>
            </div>
            <div>
              <label className={styles.label}>Ghi chú</label>
              <p className={styles.value}>
                {route.note || "Không có ghi chú"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
