"use client";

import styles from "./AboutUs.module.css";

export default function AboutUsPage() {
  return (
    <div className={styles.page}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1>Về Chúng Tôi</h1>
        <p>FUTA Bus Lines – Chất lượng là danh dự</p>
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        <h2>Tập đoàn Phương Trang</h2>
        <p>
          Được thành lập từ năm 2001, FUTA Group hoạt động trong lĩnh vực vận tải hành khách,
          xe hợp đồng, bất động sản và nhiều dịch vụ khác...
        </p>

        <h2>Tầm Nhìn & Sứ Mệnh</h2>
        <ul>
          <li>Tạo môi trường làm việc năng động, thân thiện.</li>
          <li>Phát triển vì lợi ích chung của khách hàng.</li>
          <li>Luôn đặt chất lượng dịch vụ lên hàng đầu.</li>
        </ul>
      </div>
    </div>
  );
}
