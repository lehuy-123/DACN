// models/types.ts
export type Station = { id: string; name: string };
export type VehicleType = "Limousine" | "Giường nằm" | "Ghế ngồi";

export type BookingSearch = {
    from: string;
    to: string;
    date: string;       // ISO (yyyy-mm-dd)
    time: string;       // "HH:mm"
    vehicleType: VehicleType;
    seats: number;
};

export type PassengerInfo = {
    fullName: string;
    phone: string;
    email?: string;
};

export type OrderStatus = "PAID" | "PENDING" | "CANCELLED";

export type Order = {
    id: string;
    code: string;                 // mã vé
    search: BookingSearch;        // thông tin chuyến
    passenger: PassengerInfo;
    price: number;
    method: "VNPAY" | "MOMO" | "CASH";
    status: OrderStatus;
    createdAt: string;            // ISO
};

export type Review = {
    orderId: string;
    rating: number;               // 1..5
    content?: string;
    createdAt: string;
};
