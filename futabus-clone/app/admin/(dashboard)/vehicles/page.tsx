// app/admin/(dashboard)/vehicles/page.tsx
import React from 'react';
import Link from 'next/link';
import styles from '../../vehicles/vehicles.module.css'; 
import { FaEdit, FaTrash, FaSearch, FaEye, FaPlus } from 'react-icons/fa';
// THÊM: Import Search và Pagination
import Search from '../../_components/Search';
import Pagination from '../../_components/Pagination';

const ITEMS_PER_PAGE = 5;

// Dữ liệu giả
const mockVehicles = [
  { id: 'XE001', licensePlate: '51F-123.45', type: 'Giường nằm 40 chỗ' },
  { id: 'XE002', licensePlate: '29B-987.65', type: 'Ghế ngồi 29 chỗ' },
  { id: 'XE003', licensePlate: '43A-987.65', type: 'Giường nằm 40 chỗ' },
  { id: 'XE004', licensePlate: '92A-112.33', type: 'Limousine 16 chỗ' },
  { id: 'XE005', licensePlate: '51F-456.78', type: 'Giường nằm 40 chỗ' },
  { id: 'XE006', licensePlate: '60A-111.22', type: 'Limousine 16 chỗ' },
];

// SỬA: Hàm lấy dữ liệu
async function getVehicles(query: string, currentPage: number) {
  const filteredVehicles = mockVehicles.filter((vehicle) =>
    vehicle.licensePlate.toLowerCase().includes(query.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const vehicles = filteredVehicles.slice(offset, offset + ITEMS_PER_PAGE);

  return { vehicles, totalPages };
}

// SỬA: Thêm props searchParams và 'await'
const VehiclesPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) => {
  const awaitedParams = await searchParams; 
  const query = awaitedParams?.query || '';
  const currentPage = Number(awaitedParams?.page) || 1;

  const { vehicles, totalPages } = await getVehicles(query, currentPage);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý Đội xe</h1>
        <Link href="/admin/vehicles/new" className={styles.addButton} title="Thêm xe mới">
          <FaPlus />
        </Link>
      </div>
      
      {/* THÊM: Component Search */}
      <div className={styles.toolbar}>
        <Search placeholder="Tìm kiếm (biển số, loại xe...)" />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã xe</th>
              <th>Biển số</th>
              <th>Loại xe</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* SỬA: map từ vehicles */}
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.id}</td>
                <td className={styles.licensePlate}>{vehicle.licensePlate}</td>
                <td>{vehicle.type}</td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/admin/vehicles/${vehicle.id}`} className={`${styles.actionButton} ${styles.viewButton}`} title="Xem chi tiết"><FaEye /></Link>
                    <Link href={`/admin/vehicles/edit/${vehicle.id}`} className={`${styles.actionButton} ${styles.editButton}`} title="Chỉnh sửa"><FaEdit /></Link>
                    <button className={`${styles.actionButton} ${styles.deleteButton}`} title="Xóa"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* THÊM: Component Pagination */}
      <Pagination totalPages={totalPages} />
    </div>
  );
};
export default VehiclesPage;