"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../../schedules/form.module.css";
import { getData, postData } from "@/lib/api";

export default function CreateSchedulePage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [existing, setExisting] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([getData("trip"), getData("vehicle"), getData("schedule")]).then(
      ([r, v, e]) => {
        setRoutes(r);
        setVehicles(v);
        setExisting(e);
      }
    );
  }, []);

  function isVehicleOverlapping(vehicleId: string, newStart: string, newEnd: string) {
    const start = new Date(newStart).getTime();
    const end = new Date(newEnd).getTime();

    return existing.some(
      (s) =>
        s.vehicleId === vehicleId &&
        start < new Date(s.arrivalTime).getTime() &&
        end > new Date(s.departureTime).getTime()
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (isVehicleOverlapping(data.vehicleId as string, data.departureTime as string, data.arrivalTime as string)) {
      alert("❌ Xe đã có lịch trong khung giờ này!");
      setLoading(false);
      return;
    }

    await postData("schedule", data);
    alert("✅ Đã tạo lịch trình mới!");
    setLoading(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Thêm lịch trình mới</h1>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tuyến xe</label>
            <select name="routeId" className={styles.select}>
              {routes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.routeName || `${r.from} - ${r.to}`}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Xe</label>
            <select name="vehicleId" className={styles.select}>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.licensePlate}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Giờ khởi hành</label>
            <input type="datetime-local" name="departureTime" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Giờ đến</label>
            <input type="datetime-local" name="arrivalTime" className={styles.input} required />
          </div>

          <div className={styles.actions}>
            <Link href="/admin/schedules" className={`${styles.button} ${styles.cancelButton}`}>
              Hủy
            </Link>
            <button type="submit" className={`${styles.button} ${styles.saveButton}`} disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu lịch trình"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
