// app/admin/(dashboard)/promotions/page.tsx
import React from "react";
import Link from "next/link";
import styles from "../../promotions/promotions.module.css";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import Search from "../../_components/Search";
import Pagination from "../../_components/Pagination";
import { getData, deleteData } from "@/lib/api";

const ITEMS_PER_PAGE = 5;

async function getPromotions(query: string, currentPage: number) {
  const allPromos = await getData<any[]>("promotion"); // 🟢 gọi dữ liệu thật
  const filtered = allPromos.filter(
    (p) =>
      p.code.toLowerCase().includes(query.toLowerCase()) ||
      (p.description?.toLowerCase() || "").includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const promotions = filtered.slice(offset, offset + ITEMS_PER_PAGE);

  return { promotions, totalPages };
}

const PromotionsPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) => {
  const awaitedParams = await searchParams;
  const query = awaitedParams?.query || "";
  const currentPage = Number(awaitedParams?.page) || 1;

  const { promotions, totalPages } = await getPromotions(query, currentPage);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý Khuyến mãi</h1>
        <Link
          href="/admin/promotions/new"
          className={styles.addButton}
          title="Tạo Khuyến mãi mới"
        >
          <FaPlus />
        </Link>
      </div>

      <div className={styles.toolbar}>
        <Search placeholder="Tìm kiếm (mã, mô tả...)" />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã Code</th>
              <th>Loại</th>
              <th>Giá trị</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo._id}>
                <td className={styles.promoCode}>{promo.code}</td>
                <td>
                  {promo.discountType === "percent"
                    ? "Phần trăm"
                    : "Số tiền cố định"}
                </td>
                <td>
                  {promo.discountType === "percent"
                    ? `${promo.value}%`
                    : `${promo.value.toLocaleString("vi-VN")}đ`}
                </td>
                <td>{new Date(promo.startDate).toLocaleDateString("vi-VN")}</td>
                <td>{new Date(promo.endDate).toLocaleDateString("vi-VN")}</td>
                <td>
                  <div className={styles.actions}>
                    <Link
                      href={`/admin/promotions/${promo._id}`}
                      className={`${styles.actionButton} ${styles.viewButton}`}
                    >
                      <FaEye />
                    </Link>
                    <Link
                      href={`/admin/promotions/edit/${promo._id}`}
                      className={`${styles.actionButton} ${styles.editButton}`}
                    >
                      <FaEdit />
                    </Link>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => deleteData("promotion", promo._id)}
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
export default PromotionsPage;
