// app/admin/(dashboard)/users/page.tsx
import React from "react";
import Link from "next/link";
import styles from "../../users/users.module.css";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import Search from "../../_components/Search";
import Pagination from "../../_components/Pagination";
import { getData, deleteData } from "@/lib/api";
import { User } from "@/types";

const ITEMS_PER_PAGE = 5;

async function getUsers(query: string, currentPage: number) {
  const allUsers = await getData<User[]>("user");
  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const users = filteredUsers.slice(offset, offset + ITEMS_PER_PAGE);

  return { users, totalPages };
}

const UsersPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) => {
  const awaitedParams = await searchParams;
  const query = awaitedParams?.query || "";
  const currentPage = Number(awaitedParams?.page) || 1;

  const { users, totalPages } = await getUsers(query, currentPage);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý Người dùng</h1>
        <Link
          href="/admin/users/new"
          className={styles.addButton}
          title="Thêm người dùng mới"
        >
          <FaPlus />
        </Link>
      </div>

      <div className={styles.toolbar}>
        <Search placeholder="Tìm kiếm (tên, email...)" />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <div className={styles.actions}>
                    <Link
                      href={`/admin/users/${user._id}`}
                      className={`${styles.actionButton} ${styles.viewButton}`}
                    >
                      <FaEye />
                    </Link>
                    <Link
                      href={`/admin/users/edit/${user._id}`}
                      className={`${styles.actionButton} ${styles.editButton}`}
                    >
                      <FaEdit />
                    </Link>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => deleteData(`user/${user._id}`)}
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
export default UsersPage;
