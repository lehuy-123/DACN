'use client';
import React from 'react';
import Link from 'next/link';
import styles from '../overview.module.css';

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  href: string;
  color: string;
}

export default function StatisticCard({
  title,
  value,
  icon,
  href,
  color,
}: CardProps) {
  return (
    <Link
      href={href}
      className={styles.statCard}
      style={{ textDecoration: 'none' }}
    >
      <div className={styles.cardIcon} style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className={styles.cardInfo}>
        <span className={styles.cardTitle}>{title}</span>
        <span className={styles.cardValue}>{value}</span>
      </div>
    </Link>
  );
}
