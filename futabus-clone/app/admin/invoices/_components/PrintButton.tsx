// app/admin/invoices/_components/PrintButton.tsx
"use client"; // Bắt buộc
import React from 'react';
import { FaPrint } from 'react-icons/fa';
import styles from '../detail.module.css'; // Dùng CSS của trang chi tiết

export default function PrintButton() {
  const handlePrint = () => {
    window.print(); // Hàm in của trình duyệt
  };

  return (
    <button className={styles.printButton} onClick={handlePrint}>
      <FaPrint />
      In Hóa đơn
    </button>
  );
}