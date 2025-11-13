"use client";
import { useState } from "react";
import styles from "./Contact.module.css";

export default function ContactPage() {
  const [form, setForm] = useState({
    brand: "FUTA BUS LINES",
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Cảm ơn ${form.name}, chúng tôi sẽ liên hệ lại sớm nhất!`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Cột trái */}
        <div className={styles.left}>
          <h3>LIÊN HỆ VỚI CHÚNG TÔI</h3>
          <p className={styles.breadcrumb}>FUTA BUS LINES</p>
          <h2 className={styles.company}>
            CÔNG TY CỔ PHẦN XE KHÁCH PHƯƠNG TRANG - FUTA BUS LINES
          </h2>
          <p><strong>Địa chỉ:</strong> 486-486A Lê Văn Lương, Phường Tân Hưng, TP.HCM, Việt Nam.</p>
          <p><strong>Website:</strong> https://futabus.vn/</p>
          <p><strong>Điện thoại:</strong> 02838386852</p>
          <p><strong>Fax:</strong> 02838386853</p>
          <p><strong>Email:</strong> hotro@futa.vn</p>
          <p><strong>Hotline:</strong> 19006067</p>
        </div>

        {/* Cột phải */}
        <div className={styles.right}>
          <h3 className={styles.formTitle}>📩 Gửi thông tin liên hệ đến chúng tôi</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <select
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              >
                <option>FUTA BUS LINES</option>
                <option>FUTA City Bus</option>
                <option>FUTA Express</option>
              </select>
              <input
                type="text"
                placeholder="Họ và tên"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className={styles.row}>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Điện thoại"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <input
              type="text"
              placeholder="Nhập tiêu đề"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <textarea
              placeholder="Nhập ghi chú"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            <button type="submit" className={styles.button}>Gửi</button>
          </form>
        </div>
      </div>
    </div>
  );
}
