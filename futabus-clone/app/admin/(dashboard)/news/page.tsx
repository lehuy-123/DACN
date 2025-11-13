import React from "react";
import Link from "next/link";
import styles from "../../news/news.module.css";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Search from "../../_components/Search";
import Pagination from "../../_components/Pagination";
import { getData, deleteData } from "@/lib/api";

const ITEMS_PER_PAGE = 5;

async function getNews(query: string, currentPage: number) {
  const allNews = await getData<any[]>("news");
  const filtered = allNews.filter(
    (n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      (n.author?.toLowerCase() || "").includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const newsList = filtered.slice(offset, offset + ITEMS_PER_PAGE);

  return { newsList, totalPages };
}

const NewsPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) => {
  const awaitedParams = await searchParams;
  const query = awaitedParams?.query || "";
  const currentPage = Number(awaitedParams?.page) || 1;
  const { newsList, totalPages } = await getNews(query, currentPage);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý Tin tức</h1>
        <Link href="/admin/news/new" className={styles.addButton} title="Thêm bài viết mới">
          <FaPlus />
        </Link>
      </div>

      <div className={styles.toolbar}>
        <Search placeholder="Tìm kiếm (tiêu đề, tác giả...)" />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã tin</th>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Trạng thái</th>
              <th>Ngày đăng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {newsList.map((n) => (
              <tr key={n._id}>
                <td>{n._id}</td>
                <td>{n.title}</td>
                <td>{n.author || "Admin"}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      n.status === "published" ? styles.đãxuấtbản : styles.bảnnháp
                    }`}
                  >
                    {n.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                  </span>
                </td>
                <td>{new Date(n.createdAt).toLocaleDateString("vi-VN")}</td>
                <td className={styles.actions}>
                  <Link
                    href={`/admin/news/${n._id}`}
                    className={`${styles.actionButton} ${styles.viewButton}`}
                  >
                    <FaEye />
                  </Link>
                  <Link
                    href={`/admin/news/edit/${n._id}`}
                    className={`${styles.actionButton} ${styles.editButton}`}
                  >
                    <FaEdit />
                  </Link>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => deleteData("news", n._id)}
                  >
                    <FaTrash />
                  </button>
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
export default NewsPage;
