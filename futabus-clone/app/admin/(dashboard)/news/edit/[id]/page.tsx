// app/admin/(dashboard)/news/edit/[id]/page.tsx
"use client"; 
// SỬA: Thêm 'use' vào import
import React, { useState, useEffect, use } from 'react'; 
import Link from 'next/link';
import styles from '../../../../news/form.module.css';

// --- Dữ liệu giả lập để fetch ---
const mockNews = [
    { id: 'NEWS001', title: 'FUTA Bus Lines mở tuyến mới TPHCM - Cà Mau', author: 'Admin', date: '2025-10-15', status: 'Đã xuất bản', content: '<p>Chi tiết...</p>' },
    { id: 'NEWS002', title: 'Chương trình khuyến mãi đặc biệt dịp lễ 30/4', author: 'Marketing Team', date: '2025-04-20', status: 'Đã xuất bản', content: '<p>Nội dung khuyến mãi 30/4...</p>' },
    { id: 'NEWS003', title: 'Hướng dẫn đặt vé trực tuyến an toàn', author: 'Admin', date: '2025-03-10', status: 'Đã xuất bản', content: '<p>Nội dung...</p>' },
    { id: 'NEWS004', title: 'Nâng cấp đội xe Limousine cho tuyến Sài Gòn - Vũng Tàu', author: 'Admin', date: '2025-02-28', status: 'Bản nháp', content: '<p>Nội dung...</p>' },
];
// ----------------------------------

interface EditPageProps { 
  // Sửa: params giờ là một Promise
  params: Promise<{ id: string }>; 
}

export default function EditNewsPage({ params }: EditPageProps) {
  // SỬA: Dùng React.use() để đọc params
  const { id } = use(params); 
  
  // State để lưu dữ liệu form
  const [formData, setFormData] = useState<any>(null);

  // Giả lập fetch dữ liệu khi component mount
  useEffect(() => {
    // (Ngoài đời thực, bạn sẽ fetch từ API)
    const data = mockNews.find(p => p.id === id);
    if (data) {
      setFormData(data);
    }
  }, [id]); // Chạy lại khi id thay đổi

  // Xử lý khi input thay đổi
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // TODO: Xử lý submit form (gọi API, Server Action)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã cập nhật!');
    // console.log(formData);
  };

  // Hiển thị loading trong khi chờ "fetch"
  if (!formData) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Đang tải dữ liệu...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Chỉnh sửa Khuyến mãi: {formData.code}</h1>
      </div>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          
          <div className={styles.formGroup}>
            <label htmlFor="code" className={styles.label}>Tiêu đề bài viết</label>
            <input type="text" id="title" name="title" className={styles.input} required 
              value={formData.title} onChange={handleChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="discountType" className={styles.label}>Tác giả</label>
            <input type="text" id="author" name="author" className={styles.input} required 
              value={formData.author} onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="value" className={styles.label}>Trạng thái</label>
             <select id="status" name="status" className={styles.select} 
              value={formData.status} onChange={handleChange}
            >
              <option value="Đã xuất bản">Đã xuất bản</option>
              <option value="Bản nháp">Bản nháp</option>
            </select>
          </div>

          <div className={styles.formGroupFull}>
            <label htmlFor="description" className={styles.label}>Nội dung</label>
            <textarea id="content" name="content" className={styles.textarea} required 
              value={formData.content} onChange={handleChange}
            />
          </div>
          
          {/* Nút Hành động */}
          <div className={styles.actions}>
            <Link href="/admin/news" className={`${styles.button} ${styles.cancelButton}`}>
              Hủy
            </Link>
            <button type="submit" className={`${styles.button} ${styles.saveButton}`}>
              Cập nhật
            </button>
          </div>
          
        </div>
      </form>
    </div>
  );
}