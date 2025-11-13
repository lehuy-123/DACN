"use client";

import styles from "../Auth.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider"; // cùng thư mục "app/auth"

import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const phone = String(form.get("phone") || "").trim();
    const password = String(form.get("password") || "");

    if (!phone || !password) return;

    setLoading(true);
    // Chuyển số điện thoại thành “email” giả để reuse mock login
    const pseudoEmail = `${phone}@mock.local`;
    const ok = await login(pseudoEmail, password);
    setLoading(false);

    if (ok) {
      router.push("/profile"); // sang trang hồ sơ để test ngay
    } else {
      alert("Đăng nhập thất bại (demo chấp nhận mọi tài khoản trong FE).");
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* LEFT SIDE */}
        <div className={styles.left}>
          <h2>PHƯƠNG TRANG</h2>
          <p>Cùng bạn trên mọi nẻo đường</p>
          <div className={styles.bannerBox}>
            <Image src="/login.svg" alt="Bus" width={260} height={200} />
            <h3>
              XE TRUNG CHUYỂN
              <br />
              ĐÓN - TRẢ TẬN NƠI
            </h3>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.right}>
          <h3 className={styles.title}>Đăng nhập tài khoản</h3>

          <div className={styles.tabs}>
            <span className={styles.active}>Đăng nhập</span>
            <Link href="/auth/register">Đăng ký</Link>
          </div>

          <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.inputGroup}>
              <span className={styles.icon}>📞</span>
              <input
                name="phone"
                type="text"
                placeholder="Nhập số điện thoại"
                required
                autoFocus
              />
            </div>
            <div className={styles.inputGroup}>
              <span className={styles.icon}>🔒</span>
              <input
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <Link href="#" className={styles.forgot}>
              Quên mật khẩu
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
