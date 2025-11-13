// app/admin/(dashboard)/reports/page.tsx
import React from 'react';
import styles from '../../reports/report.module.css';
import ReportDatePicker from '../../_components/ReportDatePicker';

// --- (Giả lập) Dữ liệu Database ---
const mockInvoices = [
  { id: 'HD001', customerName: 'Nguyễn Văn A', total: 250000, date: '2025-10-20' },
  { id: 'HD002', customerName: 'Trần Thị B', total: 100000, date: '2025-10-22' },
  { id: 'HD003', customerName: 'Lê Văn C', total: 70000, date: '2025-10-15' },
  { id: 'HD004', customerName: 'Phạm Thị D', total: 150000, date: '2025-10-24' },
  { id: 'HD005', customerName: 'Nguyễn Văn A', total: 180000, date: '2025-10-25' },
  { id: 'HD006', customerName: 'Nguyễn Văn A', total: 500000, date: '2025-09-15' }, // Hóa đơn cũ
];
// ---------------------------------

/**
 * Hàm lấy báo cáo, lọc theo ngày
 */
async function getRevenueReport(dateFrom: string, dateTo: string) {
  const from = new Date(dateFrom).getTime();
  const to = new Date(dateTo).getTime();

  const filteredInvoices = mockInvoices.filter(inv => {
    const invDate = new Date(inv.date).getTime();
    return invDate >= from && invDate <= to;
  });

  const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalTickets = filteredInvoices.length;

  return { filteredInvoices, totalRevenue, totalTickets };
}


export default async function ReportPage({
  searchParams,
}: {
  searchParams?: Promise<{
    from?: string;
    to?: string;
  }>;
}) {
  const awaitedParams = await searchParams;
  
  // Mặc định 30 ngày
  const to = awaitedParams?.to || new Date().toISOString().split('T')[0];
  let fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 30);
  const from = awaitedParams?.from || fromDate.toISOString().split('T')[0];

  const { filteredInvoices, totalRevenue, totalTickets } = await getRevenueReport(from, to);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Báo cáo Doanh thu</h1>
        {/* Component chọn ngày (Client) */}
        <ReportDatePicker />
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Tổng Doanh thu</div>
          <div className={styles.kpiValue}>{totalRevenue.toLocaleString('vi-VN')}đ</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Tổng số vé</div>
          <div className={styles.kpiValue}>{totalTickets}</div>
        </div>
      </div>
      
      {/* (Bạn có thể thêm 1 bảng ở đây để hiển thị 'filteredInvoices') */}
      
    </div>
  );
}