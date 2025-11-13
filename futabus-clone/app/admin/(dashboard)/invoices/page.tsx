// app/admin/(dashboard)/invoices/page.tsx
import React from "react";
import Link from "next/link";
import styles from "../../invoices/invoices.module.css";
import { FaEye, FaPrint } from "react-icons/fa";
import Search from "../../_components/Search";
import Pagination from "../../_components/Pagination";
import { getData } from "@/lib/api";

const ITEMS_PER_PAGE = 5;

async function getInvoices(query: string, currentPage: number) {
  // 🟢 GỌI API THẬT
  const allInvoices = await getData<any[]>("payment"); // hoặc "booking"
  const filtered = allInvoices.filter(
    (i) =>
      i._id.toLowerCase().includes(query.toLowerCase()) ||
      (i.userName?.toLowerCase() || "").includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const invoices = filtered.slice(offset, offset + ITEMS_PER_PAGE);

  return { invoices, totalPages };
}

const InvoicesPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) => {
  const awaitedParams = await searchParams;
  const query = awaitedParams?.query || "";
  const currentPage = Number(awaitedParams?.page) || 1;

  const { invoices, totalPages } = await getInvoices(query, currentPage);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý Hóa đơn</h1>
      </div>

      <div className={styles.toolbar}>
        <Search placeholder="Tìm kiếm (mã HĐ, tên khách hàng...)" />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã HĐ</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id}>
                <td>{invoice._id}</td>
                <td>{invoice.userName || "Ẩn danh"}</td>
                <td>
                  {new Date(invoice.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td>
                  <span
                    className={`${styles.status} ${
                      invoice.status === "paid"
                        ? styles.đãthanhtoán
                        : invoice.status === "cancelled"
                        ? styles.đãhủy
                        : styles.chưathanhtoán
                    }`}
                  >
                    {invoice.status === "paid"
                      ? "Đã thanh toán"
                      : invoice.status === "cancelled"
                      ? "Đã hủy"
                      : "Chưa thanh toán"}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <Link
                      href={`/admin/invoices/${invoice._id}`}
                      className={`${styles.actionButton} ${styles.viewButton}`}
                      title="Xem chi tiết"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      href={`/admin/invoices/${invoice._id}`}
                      className={`${styles.actionButton} ${styles.printButton}`}
                      title="In hóa đơn"
                    >
                      <FaPrint />
                    </Link>
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
export default InvoicesPage;
