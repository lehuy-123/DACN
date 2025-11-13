import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({
    vehicleId: params.id,
    licensePlate: "51B-12345",
    schedule: [
      { time: "05:30", stop: "BX An Sương, Q12" },
      { time: "06:15", stop: "43 Nguyễn Cư Trinh, Q1" },
      { time: "06:30", stop: "BX Miền Tây, Bình Tân" },
      { time: "09:30", stop: "Bến xe Vũng Tàu" },
    ],
    facilities: ["Wifi", "Nước suối", "Ổ cắm sạc", "Máy lạnh"],
    images: ["/bus1.jpg", "/bus2.jpg"],
    policy: "Vui lòng có mặt tại bến 30 phút trước giờ khởi hành.",
  });
}