'use client';
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from '../overview.module.css';
import { getData } from '@/lib/api';
import { Booking } from '@/types'; // 🟢 import kiểu thật

interface RevenueItem {
  name: string;
  DoanhThu: number;
}

export default function RevenueChart() {
  const [data, setData] = useState<RevenueItem[]>([]);

  useEffect(() => {
    async function loadRevenue() {
      try {
        // 🟢 Lấy đúng kiểu dữ liệu
        const bookings = await getData<Booking[]>('bookings'); // hoặc 'payment'

        const days: RevenueItem[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const label = i === 0 ? 'Hôm nay' : `${i} ngày trước`;
          const dayStr = date.toISOString().slice(0, 10);

          const total = bookings
            .filter(
              (b) => b.createdAt?.startsWith(dayStr) && b.status === 'paid'
            )
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

          days.push({ name: label, DoanhThu: total });
        }

        setData(days);
      } catch (err) {
        console.error('❌ Lỗi load doanh thu:', err);
      }
    }

    loadRevenue();
  }, []);

  const formatCurrency = (tickItem: number) =>
    (tickItem / 1_000_000).toLocaleString('vi-VN') + 'tr';

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} tickFormatter={formatCurrency} />
          <Tooltip formatter={(v: number) => `${v.toLocaleString('vi-VN')}đ`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="DoanhThu"
            stroke="#0d6efd"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
