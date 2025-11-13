"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Payment.module.css";

import { PassengerInfo, Order, VehicleType } from "@/models/types";
import { Storage } from "@/lib/storage";

type PendingBooking = {
  customer: PassengerInfo;
  trip: {
    id: string;
    from: string;
    to: string;
    date: string;
    time: string;
    unitPrice: number;
  };
  pickup: { type: string; point: string };
  drop: { type: string; point: string };
  seats: string[];
  total: number;
};

const METHODS = [
  { id: "VietQR",   name: "Thanh toán VietQR",   logo: "/vietqr.png",   desc: "Quét mã từ app ngân hàng" },
  { id: "FUTAPay",  name: "FUTAPay",             logo: "/futapay.png",  desc: "Giữ chỗ nhanh, thanh toán tiện lợi" },
  { id: "ZaloPay",  name: "ZaloPay",             logo: "/zalopay.png",  desc: "Ưu đãi cho khách hàng lần đầu" },
  { id: "VNPAY",    name: "VNPay",               logo: "/vnpay.png",    desc: "Nhập VNPAYFUTA29 – ưu đãi theo chương trình" },
  { id: "ShopeePay",name: "ShopeePay",           logo: "/shopeepay.png",desc: "Ưu đãi theo chương trình" },
  { id: "MoMo",     name: "MoMo",                logo: "/momo.png",     desc: "Ưu đãi cho khách hàng mới" },
  { id: "Viettel",  name: "Viettel Money",       logo: "/viettel.png",  desc: "" },
  { id: "MBBank",   name: "MB Bank",             logo: "/mb.png",       desc: "QR chuyển khoản" },
  { id: "ATM",      name: "Thẻ ATM nội địa",     logo: "/atm.png",      desc: "" },
  { id: "VISA",     name: "Thẻ Visa/Master/JCB", logo: "/visa.png",     desc: "" },
] as const;

const ONLINE_SET = new Set([
  "VietQR","FUTAPay","ZaloPay","VNPAY","ShopeePay","MoMo","Viettel","MBBank","ATM","VISA"
]);

export default function PaymentPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<PendingBooking | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>("FUTAPay");
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 phút

  // Lấy dữ liệu đặt chỗ
  useEffect(() => {
    const dataString = sessionStorage.getItem("pendingBooking");
    if (!dataString) {
      alert("Không tìm thấy thông tin đặt vé, vui lòng chọn lại chuyến.");
      router.replace("/select-seat");
      return;
    }
    setBookingData(JSON.parse(dataString));
  }, [router]);

  // Đếm ngược giữ chỗ
  useEffect(() => {
    if (!bookingData) return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          alert("Hết thời gian giữ chỗ. Vui lòng đặt lại.");
          router.push("/select-seat");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [bookingData, router]);

  // Tính giá
  const pricing = useMemo(() => {
    if (!bookingData) return { base: 0, fee: 0, discount: 0, total: 0 };
    const base = bookingData.total;
    const fee = 0;
    const discount = ONLINE_SET.has(selectedPayment) ? Math.round(base * 0.02) : 0; // 2%
    const total = Math.max(0, base + fee - discount);
    return { base, fee, discount, total };
  }, [bookingData, selectedPayment]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  // Meta của phương thức đang chọn (để hiện logo giữa QR + tên)
  const selectedMeta = useMemo(
    () => METHODS.find((m) => m.id === selectedPayment) ?? METHODS[0],
    [selectedPayment]
  );

  const handleMockPaymentSuccess = () => {
    if (!bookingData) return;
    const order: Order = {
      id: crypto.randomUUID(),
      code: "FB" + Math.floor(Math.random() * 1e6).toString().padStart(6, "0"),
      search: {
        from: bookingData.trip.from,
        to: bookingData.trip.to,
        date: bookingData.trip.date,
        time: bookingData.trip.time,
        vehicleType: "Giường nằm" as VehicleType,
        seats: bookingData.seats.length,
      },
      passenger: bookingData.customer,
      price: pricing.total,
      method: selectedPayment as any,
      status: "PAID",
      createdAt: new Date().toISOString(),
    };
    Storage.pushOrder(order);
    alert("Thanh toán thành công! Đã lưu vé vào lịch sử.");
    router.push("/profile");
  };

  if (!bookingData) {
    return <div className={styles.loading}>Đang tải thông tin thanh toán...</div>;
  }

  return (
    <div className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Cột 1: phương thức */}
          <section className={`${styles.card} ${styles.methodsCard}`}>
            <h3 className={styles.cardTitle}>Chọn phương thức thanh toán</h3>
            <ul className={styles.methodsList}>
              {METHODS.map((m) => {
                const active = selectedPayment === m.id;
                return (
                  <li key={m.id}>
                    <label
                      className={`${styles.methodItem} ${active ? styles.active : ""}`}
                      onClick={() => setSelectedPayment(m.id)}
                    >
                      <input
                        type="radio"
                        name="method"
                        checked={active}
                        onChange={() => setSelectedPayment(m.id)}
                        aria-label={m.name}
                      />
                      <Image src={m.logo} alt={m.name} width={28} height={28} className={styles.methodLogo} />
                      <div className={styles.methodText}>
                        <div className={styles.methodName}>{m.name}</div>
                        {m.desc && <div className={styles.methodDesc}>{m.desc}</div>}
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Cột 2: QR + tổng tiền */}
          <section className={`${styles.card} ${styles.centerCard}`}>
            <div className={styles.amountTop}>
              <div>Tổng thanh toán</div>
              <strong>{pricing.total.toLocaleString("vi-VN")}đ</strong>
            </div>

            <div className={styles.holdTimer}>
              Thời gian giữ chỗ còn lại <b>{minutes}:{seconds}</b>
            </div>

            <div className={styles.qrWrap}>
              <Image src="/QRcode.png" alt="QR Code" width={260} height={260} className={styles.qrImg} />
              {/* ✅ Logo đổi theo phương thức chọn */}
              <div className={styles.qrBrand}>
                <Image
                  src={selectedMeta.logo}
                  alt={selectedMeta.name}
                  width={40}
                  height={40}
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>

            <div className={styles.instructions}>
              <h4>Hướng dẫn thanh toán bằng {selectedMeta.name}</h4>
              <ol>
                <li>Mở ứng dụng {selectedMeta.name} trên điện thoại</li>
                <li>Dùng chức năng quét mã QR</li>
                <li>Quét mã trên trang này và xác nhận thanh toán</li>
              </ol>
            </div>

            <button className={styles.confirmBtn} onClick={handleMockPaymentSuccess}>
               Thanh Toán
            </button>
          </section>

          {/* Cột 3: Thông tin */}
          <aside className={styles.rightCol}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Thông tin hành khách</div>
              <div className={styles.infoRow}><span>Họ và tên</span><b>{bookingData.customer.fullName}</b></div>
              <div className={styles.infoRow}><span>Số điện thoại</span><b>{bookingData.customer.phone}</b></div>
              <div className={styles.infoRow}><span>Email</span><b>{bookingData.customer.email}</b></div>
            </div>

            <div className={styles.card}>
              <div className={`${styles.cardTitle} ${styles.withInfo}`}>Thông tin lượt đi <i>ⓘ</i></div>
              <div className={styles.infoRow}><span>Tuyến xe</span><b>{bookingData.trip.from} – {bookingData.trip.to}</b></div>
              <div className={styles.infoRow}><span>Thời gian xuất bến</span><b>{bookingData.trip.time} {bookingData.trip.date}</b></div>
              <div className={styles.infoRow}><span>Số lượng ghế</span><b>{bookingData.seats.length} Ghế</b></div>
              <div className={styles.infoRow}><span>Số ghế</span><b>{bookingData.seats.join(", ")}</b></div>
              <div className={styles.infoRow}><span>Điểm lên xe</span><b>{bookingData.pickup.point}</b></div>
              <div className={styles.infoRow}><span>Điểm trả khách</span><b>{bookingData.drop.point}</b></div>
              <div className={`${styles.infoRow} ${styles.totalLike}`}><span>Tổng tiền lượt đi</span><b>{bookingData.total.toLocaleString("vi-VN")}đ</b></div>
            </div>

            <div className={styles.card}>
              <div className={`${styles.cardTitle} ${styles.withInfo}`}>Chi tiết giá <i>ⓘ</i></div>
              <div className={styles.infoRow}><span>Giá vé / ghế</span><b>{bookingData.trip.unitPrice.toLocaleString("vi-VN")}đ</b></div>
              <div className={styles.infoRow}><span>Phí thanh toán</span><b>0đ</b></div>
              <div className={styles.infoRow}>
                <span>Ưu đãi thanh toán Online</span>
                <b>{pricing.discount > 0 ? `(2%) -${pricing.discount.toLocaleString("vi-VN")}đ` : "0đ"}</b>
              </div>
              <div className={`${styles.infoRow} ${styles.totalRow}`}><span>Tổng tiền</span><b>{pricing.total.toLocaleString("vi-VN")}đ</b></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
