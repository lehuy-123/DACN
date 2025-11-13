"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../../../../schedules/form.module.css";
import { getData, putData } from "@/lib/api";

interface EditPageProps {
  params: { id: string };
}

export default function EditSchedulePage({ params }: EditPageProps) {
  const { id } = params;
  const [formData, setFormData] = useState<any>(null);
  const [routes, setRoutes] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([getData("trip"), getData("vehicle"), getData("schedule")]).then(
      ([r, v, all]) => {
        setRoutes(r);
        setVehicles(v);
        setFormData(all.find((s: any) => s._id === id));
      }
    );
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await putData(`schedule/${id}`, formData);
    alert("✅ Cập nhật thành công!");
    setLoading(false);
  };

  if (!formData)
    return (
      <div className={styles.card}>
        <h1 className={styles.title}>Đang tải dữ liệu...</h1>
      </div>
    );

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Chỉnh sửa lịch trình</h1>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tuyến xe</label>
            <select name="routeId" className={styles.select} value={formData.routeId} onChange={handleChange}>
              {routes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.routeName || `${r.from} - ${r.to}`}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Xe</label>
            <select name="vehicleId" className={styles.select} value={formData.vehicleId} onChange={handleChange}>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.licensePlate}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Giờ khởi hành</label>
            <input
              type="datetime-local"
              name="departureTime"
              className={styles.input}
              value={formData.departureTime?.slice(0, 16)}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Giờ đến</label>
            <input
              type="datetime-local"
              name="arrivalTime"
              className={styles.input}
              value={formData.arrivalTime?.slice(0, 16)}
              onChange={handleChange}
            />
          </div>

          <div className={styles.actions}>
            <Link href="/admin/schedules" className={`${styles.button} ${styles.cancelButton}`}>
              Hủy
            </Link>
            <button type="submit" className={`${styles.button} ${styles.saveButton}`} disabled={loading}>
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
