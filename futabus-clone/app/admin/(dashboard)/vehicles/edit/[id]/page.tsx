// app/admin/(dashboard)/vehicles/edit/[id]/page.tsx
"use client"; 
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import styles from '../../../../vehicles/form.module.css';

const mockVehicles = [
    { id: 'XE001', licensePlate: '51F-123.45', type: 'Giường nằm 40 chỗ', driver: 'Nguyễn Văn A', status: 'Đang hoạt động' },
];

interface EditPageProps { params: Promise<{ id: string }>; }

export default function EditVehiclePage({ params }: EditPageProps) {
  const { id } = use(params); // Sửa lỗi 'await params'
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    // TODO: Fetch dữ liệu thật
    if (id === 'XE001') setFormData(mockVehicles[0]);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã cập nhật!');
  };

  if (!formData) {
    return <div className={styles.card}><div className={styles.header}><h1 className={styles.title}>Đang tải...</h1></div></div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}><h1 className={styles.title}>Chỉnh sửa: {formData.licensePlate}</h1></div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.formGroup}><label htmlFor="id" className={styles.label}>Mã xe</label><input type="text" id="id" name="id" className={styles.input} required value={formData.id} onChange={handleChange} /></div>
          <div className={styles.formGroup}><label htmlFor="licensePlate" className={styles.label}>Biển số xe</label><input type="text" id="licensePlate" name="licensePlate" className={styles.input} required value={formData.licensePlate} onChange={handleChange} /></div>
          <div className={styles.formGroup}><label htmlFor="type" className={styles.label}>Loại xe</label><input type="text" id="type" name="type" className={styles.input} required value={formData.type} onChange={handleChange} /></div>
          <div className={styles.formGroup}><label htmlFor="status" className={styles.label}>Trạng thái</label><select id="status" name="status" className={styles.select} value={formData.status} onChange={handleChange}><option value="Đang hoạt động">Đang hoạt động</option><option value="Đang bảo trì">Đang bảo trì</option><option value="Ngưng hoạt động">Ngưng hoạt động</option></select></div>
          <div className={styles.actions}>
            <Link href="/admin/vehicles" className={`${styles.button} ${styles.cancelButton}`}>Hủy</Link>
            <button type="submit" className={`${styles.button} ${styles.saveButton}`}>Cập nhật</button>
          </div>
        </div>
      </form>
    </div>
  );
}