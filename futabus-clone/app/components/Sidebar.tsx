'use client';

import styles from '../profile/profile.module.css';

type TabKey = 'futapay' | 'account' | 'orders' | 'addresses' | 'password' | 'logout';

export default function Sidebar({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: TabKey; label: string }[];
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  const iconClass = (k: TabKey) =>
    `${styles.sideIcon} ${
      k === 'futapay'   ? styles.sideIconFuta :
      k === 'account'   ? styles.sideIconAccount :
      k === 'orders'    ? styles.sideIconOrders :
      k === 'addresses' ? styles.sideIconAddress :
      k === 'password'  ? styles.sideIconPassword :
                          styles.sideIconLogout
    }`;

  const iconGlyph = (k: TabKey) =>
    k === 'futapay'   ? 'F' :
    k === 'account'   ? '👤' :
    k === 'orders'    ? '🕓' :
    k === 'addresses' ? '📍' :
    k === 'password'  ? '⋯'  : '↪';

  return (
    <aside className={styles.sidebar}>
      {tabs.map((t) => (
        <button
          key={t.key}
          className={`${styles.sideItem} ${active === t.key ? styles.sideItemActive : ''}`}
          onClick={() => onChange(t.key)}
        >
          <span className={iconClass(t.key)}>{iconGlyph(t.key)}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </aside>
  );
}
