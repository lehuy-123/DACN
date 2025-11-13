import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // ⚠️ BẮT BUỘC phải import CSS này
import L from 'leaflet';

// ⚠️ FIX LỖI ICON MẶC ĐỊNH CỦA LEAFLET
// Cần copy icon của Leaflet vào thư mục public/images/marker-icon.png nếu dùng Next.js
// Hoặc sử dụng cách fix sau:
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png',
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png',
});

// Tùy chọn: Icon xe tùy chỉnh (Bạn nên tạo icon riêng trong thư mục public)
const busIcon = new L.Icon({
    iconUrl: '/icons/bus_marker.png', // TẠO FILE NÀY TRONG PUBLIC
    iconSize: [40, 40], // Kích thước icon
    iconAnchor: [20, 40], // Điểm neo của icon
    popupAnchor: [0, -40]
});


interface VehicleLocation {
    id: string;
    lat: number;
    lng: number;
    licensePlate: string;
}

interface MapComponentProps {
    vehicleLocations: VehicleLocation[];
}

export default function MapComponent({ vehicleLocations }: MapComponentProps) {
    // Tọa độ trung tâm bản đồ mặc định (Ví dụ: Trung tâm VN - Đà Nẵng)
    const initialCenter: [number, number] = [16.0544, 108.2022]; 

    return (
        <MapContainer 
            center={initialCenter} 
            zoom={6} // Zoom tổng quan Việt Nam
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        >
            {/* Tile Layer: Lớp bản đồ cơ sở */}
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Vòng lặp để tạo Marker cho từng xe */}
            {vehicleLocations.map((vehicle) => (
                <Marker 
                    key={vehicle.id} 
                    position={[vehicle.lat, vehicle.lng]} 
                    icon={busIcon} // Dùng icon xe
                >
                    <Popup>
                        <h4 style={{ margin: '0 0 5px' }}>Biển số: <b style={{ color: '#ff6600' }}>{vehicle.licensePlate}</b></h4>
                        <p style={{ margin: '0' }}>Vị trí: {vehicle.lat}, {vehicle.lng}</p>
                        <p style={{ margin: '0' }}>Tình trạng: Đang di chuyển...</p>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}