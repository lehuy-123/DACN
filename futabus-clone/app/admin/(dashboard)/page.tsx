"use client";
import React, { useEffect, useState } from "react";
import styles from "../overview.module.css";
import { FaDollarSign, FaTicketAlt, FaBus, FaUserPlus } from "react-icons/fa";
import StatisticCard from "../_components/StatisticCard";
import RevenueChart from "../_components/RevenueChart";
import { getData } from "@/lib/api";
import { Booking, Trip, User } from "@/types"; 

interface ActivityItem {
  id: string;
  text: string;
}

interface TopRouteItem {
  name: string;
  total: number;
}

interface SummaryState {
  todayRevenue: number;
  ticketsSold: number;
  upcomingTrips: number;
  newCustomers: number;
  recentActivities: ActivityItem[];
  topRoutes: TopRouteItem[];
}

export default function AdminHomePage() {
  const [summary, setSummary] = useState<SummaryState>({
    todayRevenue: 0,
    ticketsSold: 0,
    upcomingTrips: 0,
    newCustomers: 0,
    recentActivities: [],
    topRoutes: [],
  });

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [bookings, trips, users] = await Promise.all([
          getData<Booking[]>("booking"),
          getData<Trip[]>("trip"),
          getData<User[]>("user"),
        ]);

        // --- Tính doanh thu hôm nay ---
        const today = new Date().toISOString().slice(0, 10);
        const todayBookings = bookings.filter(
          (b) => b.status === "paid" && b.createdAt?.startsWith(today)
        );
        const todayRevenue = todayBookings.reduce(
          (sum, b) => sum + (b.totalPrice || 0),
          0
        );

        // --- Tổng số vé đã bán ---
        const ticketsSold = bookings.length;

        // --- Chuyến sắp khởi hành ---
        const now = new Date();
        const upcomingTrips = trips.filter(
          (t) => new Date(t.departureTime) > now
        ).length;

        // --- Khách hàng mới (7 ngày gần nhất) ---
        const newCustomers = users.filter((u) => {
          const created = new Date(u.createdAt);
          return (now.getTime() - created.getTime()) / (1000 * 3600 * 24) < 7;
        }).length;

        // --- Hoạt động gần đây ---
        const recentActivities: ActivityItem[] = bookings
          .slice(-5)
          .reverse()
          .map((b) => ({
            id: b._id,
            text: `${b.userName || "Người dùng"} vừa đặt vé ${
              b.tripName || "chuyến xe"
            }.`,
          }));

        // --- Top tuyến xe (Theo doanh thu) ---
        const revenueByRoute: Record<string, number> = {};
        for (const b of bookings) {
          const routeName = b.tripName || "Không xác định";
          revenueByRoute[routeName] =
            (revenueByRoute[routeName] || 0) + (b.totalPrice || 0);
        }

        const topRoutes: TopRouteItem[] = Object.entries(revenueByRoute)
          .map(([name, total]) => ({ name, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);

        // --- Cập nhật state ---
        setSummary({
          todayRevenue,
          ticketsSold,
          upcomingTrips,
          newCustomers,
          recentActivities,
          topRoutes,
        });
      } catch (err) {
        console.error("❌ Lỗi load dashboard:", err);
      }
    }

    fetchDashboard();
  }, []);

  // === JSX HIỂN THỊ ===
  return (
    <div className={styles.container}>
      {/* Hàng 1: Thẻ KPI */}
      <div className={styles.statsGrid}>
        <StatisticCard
          icon={<FaDollarSign />}
          title="Doanh thu hôm nay"
          value={summary.todayRevenue.toLocaleString("vi-VN") + "đ"}
          color="#0d6efd"
          href="/admin/invoices"
        />
        <StatisticCard
          icon={<FaTicketAlt />}
          title="Số vé đã bán"
          value={summary.ticketsSold.toString()}
          color="#198754"
          href="/admin/invoices"
        />
        <StatisticCard
          icon={<FaBus />}
          title="Chuyến sắp khởi hành"
          value={summary.upcomingTrips.toString()}
          color="#ffc107"
          href="/admin/schedules"
        />
        <StatisticCard
          icon={<FaUserPlus />}
          title="Khách hàng mới"
          value={summary.newCustomers.toString()}
          color="#dc3545"
          href="/admin/users"
        />
      </div>

      {/* Hàng 2: Biểu đồ + Hoạt động */}
      <div className={styles.mainGrid}>
        <div className={styles.chartContainer}>
          <h3>Doanh thu 7 ngày gần nhất</h3>
          <RevenueChart />
        </div>
        <div className={styles.activityContainer}>
          <h3>Hoạt động gần đây</h3>
          <ul className={styles.activityList}>
            {summary.recentActivities.map((a) => (
              <li key={a.id}>{a.text}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Hàng 3: Top Tuyến xe */}
      <div className={styles.topRoutesContainer}>
        <h3>Top Tuyến xe (Theo Doanh thu)</h3>
        <ul className={styles.topRoutesList}>
          {summary.topRoutes.map((r, i) => (
            <li key={r.name} className={styles.topRoutesItem}>
              <span className={styles.routeRank}>{i + 1}</span>
              <span className={styles.routeName}>{r.name}</span>
              <span className={styles.routeRevenue}>
                {r.total.toLocaleString("vi-VN")}đ
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
