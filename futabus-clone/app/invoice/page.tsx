"use client";

import styles from "./Invoice.module.css";

export default function InvoicePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hóa Đơn</h1>
      <p className={styles.text}>
        Bạn có thể tra cứu hóa đơn điện tử tại đây.
      </p>
    </div>
  );
}
