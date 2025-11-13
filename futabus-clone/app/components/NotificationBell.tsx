// DACN10/futabus-clone/app/components/NotificationBell.tsx

'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext'; 
// Giả sử bạn sử dụng thư viện icon (ví dụ: react-icons) hoặc font icon

export default function NotificationBell() {
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    const handleBellClick = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <div className="relative">
            {/* Nút Chuông */}
            <button 
                onClick={handleBellClick} 
                className="relative p-2 rounded-full text-white bg-transparent hover:bg-orange-600 transition"
            >
                {/* 🔔 Thay bằng icon chuông thực tế (ví dụ: Iconify hoặc thư viện icon) */}
                <span style={{ fontSize: '24px' }}>🔔</span>
                
                {/* Badge/Dot thông báo chưa đọc */}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-red-600 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div 
                    className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden"
                    // Để giữ dropdown mở khi click bên trong
                    onClick={(e) => e.stopPropagation()} 
                >
                    <h4 className="p-3 font-bold border-b text-gray-800">Thông báo ({unreadCount} chưa đọc)</h4>
                    {notifications.length === 0 ? (
                        <p className="p-3 text-gray-500">Không có thông báo mới.</p>
                    ) : (
                        <ul className="max-h-80 overflow-y-auto divide-y">
                            {notifications.slice(0, 10).map((noti) => ( // Chỉ hiển thị tối đa 10 thông báo
                                <li 
                                    key={noti.id} 
                                    className={`p-3 text-sm cursor-pointer ${!noti.read ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'}`}
                                    onClick={() => {
                                        markAsRead(noti.id);
                                        setIsOpen(false); // Đóng dropdown sau khi click
                                        // window.location.href = noti.link; 
                                    }}
                                >
                                    <p className={!noti.read ? 'font-semibold text-gray-900' : 'text-gray-600'}>
                                        {noti.message}
                                    </p>
                                    <span className="text-xs text-gray-400">{new Date(noti.timestamp).toLocaleTimeString()}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="p-2 text-center border-t">
                        <a href="/admin/notifications" className="text-blue-500 text-sm block">Xem tất cả</a>
                    </div>
                </div>
            )}
        </div>
    );
}