'use client'; 

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // Dùng dynamic import cho Leaflet
import { io } from 'socket.io-client';

// ⚠️ Quan trọng: Dynamic import để tắt Server-Side Rendering (SSR) cho Leaflet
const MapComponent = dynamic(() => import('./components/MapComponent'), {
    ssr: false, 
});

// Định nghĩa kiểu dữ liệu vị trí xe
interface VehicleLocation {
    id: string; // ID của xe
    lat: number; // Vĩ độ
    lng: number; // Kinh độ
    licensePlate: string; // Biển số xe
}

// ⚠️ CẬP NHẬT URL SOCKET CỦA BACKEND
const SOCKET_URL = 'http://localhost:5000/tracking'; 

export default function RealtimeSimulationPage() {
    // State chứa vị trí của tất cả các xe
    const [vehicleLocations, setVehicleLocations] = useState<VehicleLocation[]>([]);

    useEffect(() => {
        // 1. Kết nối Socket.io
        const socket = io(SOCKET_URL);

        // 2. Lắng nghe sự kiện cập nhật vị trí
        socket.on('vehicleUpdate', (update: VehicleLocation) => {
            // Cập nhật state vị trí xe
            setVehicleLocations(prevLocations => {
                // Thêm log để kiểm tra nhận dữ liệu
                console.log(`📡 Vị trí mới nhận: Xe ${update.licensePlate} (${update.id}) tại ${update.lat}, ${update.lng}`);
                
                const existingIndex = prevLocations.findIndex(v => v.id === update.id);
                
                if (existingIndex > -1) {
                    // Nếu xe đã tồn tại, cập nhật tọa độ mới
                    const newLocations = [...prevLocations];
                    newLocations[existingIndex] = update;
                    return newLocations;
                }
                // Nếu xe mới, thêm vào danh sách
                return [...prevLocations, update];
            });
        });
        
        // Log để kiểm tra kết nối (tùy chọn)
        socket.on('connect', () => console.log('✅ Tracking Socket connected!'));
        socket.on('disconnect', () => console.log('❌ Tracking Socket disconnected!'));


        return () => {
            // Ngắt kết nối khi component bị unmount
            socket.disconnect();
        };
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Giả lập & Giám sát Di chuyển Realtime</h1>
            <p className="mb-4 text-gray-600">Hiển thị vị trí trực tiếp của các xe trên bản đồ.</p>
            
            {/* Vùng hiển thị bản đồ */}
            <div style={{ height: '70vh', width: '100%', border: '1px solid #ddd' }} className="mt-4 shadow-lg rounded-lg">
                <MapComponent vehicleLocations={vehicleLocations} />
            </div>
            
            {/* 💡 Bảng điều khiển/Danh sách xe đang hoạt động (ĐÃ THÊM CHI TIẾT) */}
            <div className="mt-4 p-4 bg-white rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-3">Thông tin {vehicleLocations.length} Xe đang theo dõi</h3>
                
                {vehicleLocations.length === 0 ? (
                    <p className="text-gray-500">Đang chờ dữ liệu vị trí đầu tiên...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vehicleLocations.map(vehicle => (
                            <div key={vehicle.id} className="p-3 border rounded-lg bg-gray-50">
                                <p className="font-bold text-lg text-orange-600">{vehicle.licensePlate}</p>
                                <p className="text-sm">ID: {vehicle.id}</p>
                                <p className="text-sm">Vĩ độ (Lat): <span className="font-mono">{vehicle.lat.toFixed(5)}</span></p>
                                <p className="text-sm">Kinh độ (Lng): <span className="font-mono">{vehicle.lng.toFixed(5)}</span></p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}