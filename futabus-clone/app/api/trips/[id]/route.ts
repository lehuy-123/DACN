import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const tripId = params.id;
  return NextResponse.json({
    tripId,
    from: "TP. Hồ Chí Minh",
    to: "Vũng Tàu",
    date: "2025-10-30",
    vehicleId: "101",
    type: "Giường nằm cao cấp",
    price: 160000,
    seats: Array.from({ length: 28 }, (_, i) => ({
      seatNo: (i + 1).toString().padStart(2, "0"),
      status: Math.random() > 0.7 ? "booked" : "available",
    })),
  });
}