// app/admin/(dashboard)/routes/page.tsx
import React from "react";
import Link from "next/link";
import styles from "../../routes/routes.module.css";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import Search from "../../_components/Search";
import Pagination from "../../_components/Pagination";
import { getData, deleteData } from "@/lib/api";

const ITEMS_PER_PAGE = 5;

async function getRoutes(query: string, currentPage: number) {
  // 🟢 GỌI API THẬT
  const allRoutes = await getData<any[]>("trip");
  const filtered = allRoutes.filter(
    (r) =>
      (r._id?.toLowerCase() || "").includes(query.toLowerCase()) ||
      (r.routeName?.toLowerCase() || "").includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const routes = filtered.slice(offset, offset + ITEMS_PER_PAGE);

  return { routes, totalPages };
}

const RoutesPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) => {
  const awaitedParams = await searchParams;
  const query = awaitedParams?.query || "";
  const currentPage = Number(awaitedParams?.page) || 1;

  const { routes, totalPages } = await getRoutes(query, currentPage);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý Tuyến xe</h1>
        <Link
          href="/admin/routes/new"
          className={styles.addButton}
          title="Thêm tuyến xe mới"
        >
          <FaPlus />
        </Link>
      </div>

      <div className={styles.toolbar}>
        <Search placeholder="Tìm kiếm (mã, tên tuyến...)" />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã tuyến</th>
              <th>Tên tuyến</th>
              <th>Điểm đi</th>
              <th>Điểm đến</th>
              <th>Khoảng cách</th>
              <th>Thời gian</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr key={r._id}>
                <td>{r._id}</td>
                <td>{r.routeName || "Chưa có"}</td>
                <td>{r.from || "Không rõ"}</td>
                <td>{r.to || "Không rõ"}</td>
                <td>{r.distance ? `${r.distance} km` : "?"}</td>
                <td>{r.duration || "?"}</td>
                <td>
                  <div className={styles.actions}>
                    <Link
                      href={`/admin/routes/${r._id}`}
                      className={`${styles.actionButton} ${styles.viewButton}`}
                      title="Xem chi tiết"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      href={`/admin/routes/edit/${r._id}`}
                      className={`${styles.actionButton} ${styles.editButton}`}
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      title="Xóa"
                      onClick={() => deleteData("trip", r._id)}
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
export default RoutesPage;
