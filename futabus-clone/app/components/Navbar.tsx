"use client";

import Link from "next/link";
import styles from "@/styles/Navbar.module.css";
import { useAuth } from "@/app/auth/AuthProvider";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/">
            <img src="/logo.svg" alt="FUTA Bus Lines" />
          </Link>
        </div>

        {/* Menu */}
        <nav className={styles.menu}>
          <Link href="/">Trang chủ</Link>
          <Link href="/schedule">Lịch trình</Link>
          <Link href="/ticket-lookup">Tra cứu vé</Link>
          <Link href="/news">Tin tức</Link>
          <Link href="/invoice">Hóa đơn</Link>
          <Link href="/contact">Liên hệ</Link>
          <Link href="/about-us">Về chúng tôi</Link>
        </nav>

        {/* Auth / User */}
        <div className={styles.auth}>
          {user ? (
            /* Đã đăng nhập: hiện avatar + tên + dropdown */
            <UserMenu />
          ) : (
            <Link href="/auth/login" prefetch={false} className={styles.loginBtn}>
              Đăng nhập / Đăng ký
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
