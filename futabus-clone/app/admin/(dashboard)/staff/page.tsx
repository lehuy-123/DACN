// app/admin/(dashboard)/staff/page.tsx
import React from "react";
import Link from "next/link";
import styles from "../../staff/staff.module.css";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import Search from "../../_components/Search";
import Pagination from "../../_components/Pagination";
import { getData, deleteData } from "@/lib/api";
import { Driver } from "@/types";

const ITEMS_PER_PAGE = 5;

async function getStaff(query: string, currentPage: number) {
  // 🟢 Lấy dữ liệu thật từ backend
  const allStaff = await getData<Driver[]>("driver");

  const filtered = allStaff.filter(
    (staff) =>
      staff.name.toLowerCase().includes(query.toLowerCase()) ||
      staff.role.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const staffList = filtered.slice(offset, offset + ITEMS_PER_PAGE);

  return { staffList, totalPages };
}

const StaffPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) => {
  const awaitedParams = await searchParams;
  const query = awaitedParams?.query || "";
  const currentPage = Number(awaitedParams?.page) || 1;

  const { staffList, totalPages } = await getStaff(query, currentPage);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý Nhân viên</h1>
        <Link
          href="/admin/staff/new"
          className={styles.addButton}
          title="Thêm nhân viên mới"
        >
          <FaPlus />
        </Link>
      </div>

      <div className={styles.toolbar}>
        <Search placeholder="Tìm kiếm (tên, chức vụ...)" />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã NV</th>
              <th>Họ và Tên</th>
              <th>Số điện thoại</th>
              <th>Chức vụ</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff._id}>
                <td>{staff._id}</td>
                <td>{staff.name}</td>
                <td>{staff.phone}</td>
                <td>{staff.role}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      staff.status === "active"
                        ? styles.active
                        : styles.inactive
                    }`}
                  >
                    {staff.status === "active"
                      ? "Đang làm việc"
                      : "Tạm nghỉ"}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <Link
                      href={`/admin/staff/${staff._id}`}
                      className={`${styles.actionButton} ${styles.viewButton}`}
                      title="Xem chi tiết"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      href={`/admin/staff/edit/${staff._id}`}
                      className={`${styles.actionButton} ${styles.editButton}`}
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => deleteData(`driver/${staff._id}`)}
                      title="Xóa"
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

export default StaffPage;
