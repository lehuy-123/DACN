// app/admin/(dashboard)/vehicles/new/page.tsx
"use client"; 
import React from 'react';
import Link from 'next/link';
import styles from '../../../vehicles/form.module.css';

export default function CreateVehiclePage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã thêm xe mới!');
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}><h1 className={styles.title}>Thêm xe mới</h1></div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="id" className={styles.label}>Mã xe</label>
            <input type="text" id="id" name="id" className={styles.input} placeholder="Ví dụ: XE005" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="licensePlate" className={styles.label}>Biển số xe</label>
            <input type="text" id="licensePlate" name="licensePlate" className={styles.input} placeholder="Ví dụ: 51F-999.99" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="type" className={styles.label}>Loại xe</label>
            <input type="text" id="type" name="type" className={styles.input} placeholder="Ví dụ: Giường nằm 40 chỗ" required />
          </div>
          <div className={styles.formGroup}>
            {/* SỬA LỖI Ở ĐÂY: </Labe_label> -> </label> */}
            <label htmlFor="status" className={styles.label}>Trạng thái</label>
            <select id="status" name="status" className={styles.select}>
              <option value="Đang hoạt động">Đang hoạt động</option>
              <option value="Đang bảo trì">Đang bảo trì</option>
              <option value="Ngưng hoạt động">Ngưng hoạt động</option>
            </select>
          </div>
          <div className={styles.actions}>
            <Link href="/admin/vehicles" className={`${styles.button} ${styles.cancelButton}`}>Hủy</Link>
            <button type="submit" className={`${styles.button} ${styles.saveButton}`}>Lưu xe</button>
          </div>
        </div>
      </form>
    </div>
  );
}