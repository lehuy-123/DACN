// src/types.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt?: string;
}

export interface Driver {
  _id: string;
  name: string;
  phone: string;
  role: string;
  license: string;
  status: "active" | "inactive";
}

export interface Vehicle {
  _id: string;
  licensePlate: string;
  type: string;
  seats: number;
  driverName?: string;
  status: "active" | "maintenance" | "inactive";
}

export interface Route {
  _id: string;
  routeName: string;
  from: string;
  to: string;
  distance?: number;
  duration?: string;
}

export interface Schedule {
  _id: string;
  routeId: string;
  vehicleId: string;
  routeName?: string;
  from?: string;
  to?: string;
  vehiclePlate?: string;
  departureTime: string;
  arrivalTime: string;
  status: "upcoming" | "running" | "completed" | "cancelled";
}

export interface Invoice {
  _id: string;
  userName: string;
  scheduleId: string;
  totalPrice: number;
  status: "paid" | "pending" | "cancelled";
  createdAt?: string;
}

export interface Promotion {
  _id: string;
  code: string;
  discountType: "percent" | "fixed";
  value: number;
  description: string;
  startDate: string;
  endDate: string;
}

export interface News {
  _id: string;
  title: string;
  author?: string;
  status: "published" | "draft";
  content: string;
  createdAt: string;
}
