'use client';

import Link from 'next/link';
import { useAuth } from '@/app/auth/AuthProvider';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '/styles/UserMenu.module.css';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!user) {
    return (
      <Link href="/auth/login" prefetch={false} className="loginBtn">
        Đăng nhập / Đăng ký
      </Link>
    );
  }

  const name = user.name || user.email.split('@')[0] || 'User';
  const initial = name.charAt(0).toUpperCase();

  // click outside / Esc → đóng
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  // Hover intent helpers
  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 140); // delay nhỏ
  };

  return (
    <div ref={wrapRef} className={styles.wrap}>
      {/* Trigger */}
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}                 // click-toggle (mobile)
        onMouseEnter={() => { clearCloseTimer(); setOpen(true); }}   // hover mở
        onMouseLeave={scheduleClose}                                  // rời nút: chờ 140ms
      >
        <span className={styles.avatar}>{initial}</span>
        <span className={styles.name}>{name}</span>
        <svg className={styles.caret} width="12" height="12" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className={styles.menu}
          onMouseEnter={clearCloseTimer}   // đi vào menu: hủy đóng
          onMouseLeave={scheduleClose}     // rời menu: đóng trễ
        >
          <Link className={styles.item} href="/profile?tab=futapay">FUTAPay</Link>
          <Link className={styles.item} href="/profile?tab=account">Thông tin tài khoản</Link>
          <Link className={styles.item} href="/profile?tab=orders">Lịch sử mua vé</Link>
          <Link className={styles.item} href="/profile?tab=addresses">Địa chỉ của bạn</Link>
          <Link className={styles.item} href="/profile?tab=password">Đặt lại mật khẩu</Link>
          <button
            type="button"
            className={`${styles.item} ${styles.danger}`}
            onClick={async () => { await logout(); router.replace('/'); }}
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
