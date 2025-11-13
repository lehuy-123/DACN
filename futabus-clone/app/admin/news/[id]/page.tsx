// app/admin/news/[id]/page.tsx
import React from "react";
import Link from "next/link";
import styles from "../detail.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { getData } from "@/lib/api";

interface DetailPageProps {
  params: { id: string };
}

export default async function NewsDetailPage({ params }: DetailPageProps) {
  const { id } = params;

  // 🟢 Lấy dữ liệu thật từ backend
  const allNews = await getData<any[]>("news");
  const news = allNews.find((item) => item._id === id);

  if (!news) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Không tìm thấy tin tức: {id}</h1>
        <Link
          href="/admin/news"
          className={styles.backIconLink}
          title="Quay lại danh sách"
        >
          <FaArrowLeft />
        </Link>
      </div>
    );
  }

  // Map trạng thái backend → class hiển thị
  const statusText =
    news.status === "published"
      ? "Đã xuất bản"
      : news.status === "draft"
      ? "Bản nháp"
      : "Không xác định";
  const statusClass =
    news.status === "published" ? styles.published : styles.draft;

  return (
    <div className={styles.container}>
      <Link
        href="/admin/news"
        className={styles.backIconLink}
        title="Quay lại danh sách"
      >
        <FaArrowLeft />
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{news.title}</h1>
          <p className={styles.meta}>
            Đăng bởi {news.author || "Admin"} vào ngày{" "}
            {new Date(news.createdAt).toLocaleDateString("vi-VN")}
          </p>

          {/* Trạng thái */}
          <span className={`${styles.status} ${statusClass}`}>
            {statusText}
          </span>
        </div>

        {/* Nội dung HTML */}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: news.content || "" }}
        />
      </div>
    </div>
  );
}
