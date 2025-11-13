// app/admin/(dashboard)/layout.tsx
'use client'; 

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Đường dẫn đúng: Đi lùi 1 cấp từ (dashboard) ra admin
import styles from '../admin.module.css'; 
import { 
    FaTachometerAlt, 
    FaUsers, 
    FaUserTie,
    FaBus, 
    FaRoute, 
    FaCalendarAlt, 
    FaFileInvoice,
    FaNewspaper,
    FaTags,
    FaChartBar
} from 'react-icons/fa';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <h1 className={styles.header}>Trang Quản Trị (Admin Dashboard)</h1>
            </div>
            
            <div className={styles.mainContent}>
                <aside className={styles.sidebar}>
                    <h3>Chức năng</h3>
                    <ul>
                        <li>
                            <Link 
                                href="/admin" 
                                className={`${styles.sidebarLink} ${pathname === '/admin' ? styles.active : ''}`}
                            >
                                <FaTachometerAlt /> 
                                <span>Tổng quan</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/admin/users" 
                                className={`${styles.sidebarLink} ${pathname === '/admin/users' ? styles.active : ''}`}
                            >
                                <FaUsers /> 
                                <span>Quản lý người dùng</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/admin/staff" 
                                className={`${styles.sidebarLink} ${pathname === '/admin/staff' ? styles.active : ''}`}
                            >
                                <FaUserTie /> 
                                <span>Quản lý Nhân viên</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/admin/vehicles" 
                                className={`${styles.sidebarLink} ${pathname === '/admin/vehicles' ? styles.active : ''}`}
                            >
                                <FaBus /> 
                                <span>Quản lý Đội xe</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/admin/routes" 
                                className={`${styles.sidebarLink} ${pathname === '/admin/routes' ? styles.active : ''}`}
                            >
                                <FaRoute /> 
                                <span>Quản lý Tuyến xe</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/admin/schedules" 
                                className={`${styles.sidebarLink} ${pathname === '/admin/schedules' ? styles.active : ''}`}
                            >
                                <FaCalendarAlt /> 
                                <span>Quản lý Lịch trình</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/admin/invoices" 
                                className={`${styles.sidebarLink} ${pathname === '/admin/invoices' ? styles.active : ''}`}
                            >
                                <FaFileInvoice /> 
                                <span>Quản lý hóa đơn</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/admin/news" 
                                className={`${styles.sidebarLink} ${pathname === '/admin/news' ? styles.active : ''}`}
                            >
                                <FaNewspaper /> 
                                <span>Quản lý Tin tức</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/admin/promotions" 
                                className={`${styles.sidebarLink} ${pathname === '/admin/promotions' ? styles.active : ''}`}
                            >
                                <FaTags /> 
                                <span>Quản lý Khuyến mãi</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/admin/reports" 
                                className={`${styles.sidebarLink} ${pathname === '/admin/reports' ? styles.active : ''}`}
                            >
                                <FaChartBar /> 
                                <span>Báo cáo & Thống kê</span>
                            </Link>
                        </li>
                    </ul>
                </aside>

                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}