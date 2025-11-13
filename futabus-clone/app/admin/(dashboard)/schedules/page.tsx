// app/admin/(dashboard)/schedules/page.tsx
import React from "react";
import Link from "next/link";
import styles from "../../schedules/schedules.module.css";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import Search from "../../_components/Search";
import Pagination from "../../_components/Pagination";
import { getData, deleteData } from "@/lib/api";
import { Schedule } from "@/types";
const ITEMS_PER_PAGE = 5;

async function getSchedules(query: string, currentPage: number) {
const allSchedules = await getData<Schedule[]>("schedule");
  const filtered = allSchedules.filter(
    (s) =>
      s._id.toLowerCase().includes(query.toLowerCase()) ||
      (s.routeName?.toLowerCase() || "").includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const schedules = filtered.slice(offset, offset + ITEMS_PER_PAGE);

  return { schedules, totalPages };
}

const SchedulesPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) => {
  const awaitedParams = await searchParams;
  const query = awaitedParams?.query || "";
  const currentPage = Number(awaitedParams?.page) || 1;
  const { schedules, totalPages } = await getSchedules(query, currentPage);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý Lịch trình</h1>
        <Link
          href="/admin/schedules/new"
          className={styles.addButton}
          title="Thêm lịch trình mới"
        >
          <FaPlus />
        </Link>
      </div>

      <div className={styles.toolbar}>
        <Search placeholder="Tìm kiếm (mã chuyến, tuyến...)" />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã chuyến</th>
              <th>Tuyến xe</th>
              <th>Xe</th>
              <th>Giờ khởi hành</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s._id}>
                <td>{s._id}</td>
                <td>{s.routeName || `${s.from} - ${s.to}`}</td>
                <td>{s.vehiclePlate || "N/A"}</td>
                <td>
                  {new Date(s.departureTime).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </td>
                <td>
                  <span
                    className={`${styles.status} ${
                      s.status === "completed"
                        ? styles.hoànthành
                        : s.status === "upcoming"
                        ? styles.sắpkhởihành
                        : s.status === "running"
                        ? styles.đangchạy
                        : styles.đãhủy
                    }`}
                  >
                    {s.status === "completed"
                      ? "Hoàn thành"
                      : s.status === "upcoming"
                      ? "Sắp khởi hành"
                      : s.status === "running"
                      ? "Đang chạy"
                      : "Đã hủy"}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <Link
                      href={`/admin/schedules/${s._id}`}
                      className={`${styles.actionButton} ${styles.viewButton}`}
                      title="Xem chi tiết"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      href={`/admin/schedules/edit/${s._id}`}
                      className={`${styles.actionButton} ${styles.editButton}`}
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => deleteData("schedule", s._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default SchedulesPage;
