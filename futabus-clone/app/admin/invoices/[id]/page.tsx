// app/admin/invoices/[id]/page.tsx
import React from "react";
import Link from "next/link";
import styles from "../detail.module.css";
import { FaArrowLeft } from "react-icons/fa";
import PrintButton from "../_components/PrintButton";
import { getData } from "@/lib/api";

interface DetailPageProps {
  params: { id: string };
}

export default async function InvoiceDetailPage({ params }: DetailPageProps) {
  const { id } = params;
  // GỌI API THẬT
  const invoices = await getData<any[]>("payment"); // hoặc "booking" nếu dữ liệu nằm ở đó
  const invoice = invoices.find((inv) => inv._id === id);

  if (!invoice) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Không tìm thấy hóa đơn: {id}</h1>
        <Link
          href="/admin/invoices"
          className={styles.backIconLink}
          title="Quay lại danh sách"
        >
          <FaArrowLeft />
        </Link>
      </div>
    );
  }

  // Map trạng thái
  let statusClass = styles.pending;
  let statusText = "Chưa thanh toán";
  if (invoice.status === "paid") {
    statusClass = styles.paid;
    statusText = "Đã thanh toán";
  } else if (invoice.status === "cancelled") {
    statusClass = styles.cancelled;
    statusText = "Đã hủy";
  }

  return (
    <div className={styles.container}>
      <Link
        href="/admin/invoices"
        className={styles.backIconLink}
        title="Quay lại danh sách"
      >
        <FaArrowLeft />
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Hóa đơn: {invoice._id}</h1>
          <PrintButton />
        </div>

        <div className={styles.content}>
          <div className={styles.grid}>
            <div className={styles.valueFull}>
              <label className={styles.label}>Trạng thái</label>
              <span className={`${styles.status} ${statusClass}`}>
                {statusText}
              </span>
            </div>

            <div>
              <label className={styles.label}>Khách hàng</label>
              <p className={styles.value}>{invoice.userName || "Ẩn danh"}</p>
            </div>
            <div>
              <label className={styles.label}>Ngày đặt</label>
              <p className={styles.value}>
                {new Date(invoice.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>

            <div className={styles.valueFull}>
              <label className={styles.label}>Tuyến xe</label>
              <p className={styles.value}>
                {invoice.tripName || invoice.tripId?.name || "Chưa xác định"}
              </p>
            </div>

            <div className={styles.valueFull}>
              <label className={styles.label}>Tổng tiền</label>
              <p className={`${styles.value} ${styles.total}`}>
                {invoice.totalPrice?.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
