// app/admin/promotions/[id]/page.tsx
import React from "react";
import Link from "next/link";
import styles from "../detail.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { getData } from "@/lib/api";

interface DetailPageProps {
  params: { id: string };
}

export default async function PromotionDetailPage({ params }: DetailPageProps) {
  const { id } = params;

  // 🟢 GỌI API THẬT
  const promotions = await getData<any[]>("promotion");
  const promo = promotions.find((p) => p._id === id);

  if (!promo) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Không tìm thấy khuyến mãi: {id}</h1>
        <Link
          href="/admin/promotions"
          className={styles.backIconLink}
          title="Quay lại danh sách"
        >
          <FaArrowLeft />
        </Link>
      </div>
    );
  }

  const status =
    promo.status === "active"
      ? { text: "Đang hoạt động", class: styles.active }
      : { text: "Hết hạn", class: styles.expired };

  return (
    <div className={styles.container}>
      <Link
        href="/admin/promotions"
        className={styles.backIconLink}
        title="Quay lại danh sách"
      >
        <FaArrowLeft />
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Chi tiết Khuyến mãi</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.grid}>
            <div className={styles.infoItem}>
              <label className={styles.label}>Mã KM</label>
              <p className={styles.value}>{promo._id}</p>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.label}>Mã Code</label>
              <p className={styles.valueCode}>{promo.code}</p>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.label}>Loại giảm giá</label>
              <p className={styles.value}>
                {promo.discountType === "percent"
                  ? "Phần trăm"
                  : "Số tiền cố định"}
              </p>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.label}>Giá trị</label>
              <p className={styles.value}>
                {promo.discountType === "percent"
                  ? `${promo.value}%`
                  : `${promo.value.toLocaleString("vi-VN")}đ`}
              </p>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.label}>Ngày bắt đầu</label>
              <p className={styles.value}>
                {new Date(promo.startDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.label}>Ngày kết thúc</label>
              <p className={styles.value}>
                {new Date(promo.endDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.label}>Số lượng tối đa</label>
              <p className={styles.value}>{promo.maxUsage}</p>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.label}>Nhóm khách hàng</label>
              <p className={styles.value}>
                {promo.customerGroup || "Tất cả"}
              </p>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.label}>Trạng thái</label>
              <span className={`${styles.status} ${status.class}`}>
                {status.text}
              </span>
            </div>
            <div className={styles.description}>
              <label className={styles.label}>Mô tả</label>
              <p className={styles.value}>{promo.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
