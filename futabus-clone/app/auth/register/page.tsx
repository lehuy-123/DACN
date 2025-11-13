"use client";

import styles from "../Auth.module.css";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* LEFT SIDE */}
        <div className={styles.left}>
          <h2>PHƯƠNG TRANG</h2>
          <p>Cùng bạn trên mọi nẻo đường</p>
          <div className={styles.bannerBox}>
            <Image src="/login.svg" alt="Bus" width={260} height={200} />
            <h3>Đăng ký tài khoản<br />Nhanh chóng & dễ dàng</h3>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.right}>
          <h3 className={styles.title}>Tạo tài khoản</h3>

          <div className={styles.tabs}>
            <Link href="/auth/login">Đăng nhập</Link>
            <span className={styles.active}>Đăng ký</span>
          </div>

          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <span className={styles.icon}>📞</span>
              <input type="text" placeholder="Nhập số điện thoại" required />
            </div>
            <button type="submit" className={styles.button}>
              Tiếp tục
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
