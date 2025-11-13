"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SeatLayout, { SeatCell } from "./SeatLayout";
import styles from "./SelectSeat.module.css";

type TabKey = "schedule" | "media" | "amenities" | "policy";

export default function SelectSeatPage() {
  const [pickupType, setPickupType] = useState<"station" | "transfer">("station");
  const [dropType, setDropType] = useState<"station" | "transfer">("station");

  const [pickupPoint, setPickupPoint] = useState("BX Miền Tây");
  const [dropPoint, setDropPoint] = useState("Vũng Tàu");

  const router = useRouter();
  const params = useSearchParams();

  const tripId = params.get("tripId") ?? "101";
  const from = params.get("from") ?? "BX Miền Tây";
  const to = params.get("to") ?? "Vũng Tàu";
  const date = params.get("date") ?? "2025-10-31";
  const time = params.get("startTime") ?? "12:30"; // giờ khởi hành từ URL
  const unitPrice = Number(params.get("price") ?? 160000);

  // ====== GHẾ (mock) ======
  const [seats, setSeats] = useState<SeatCell[]>(
    Array.from({ length: 28 }, (_, i) => ({
      id: (i + 1).toString().padStart(2, "0"),
      status: i % 6 === 0 ? "SOLD" : "AVAILABLE",
      floor: "BOTTOM",
    }))
  );

  const toggleSeat = (id: string) => {
    setSeats(prev =>
      prev.map(s =>
        s.id === id
          ? {
              ...s,
              status:
                s.status === "AVAILABLE"
                  ? "SELECTED"
                  : s.status === "SELECTED"
                  ? "AVAILABLE"
                  : s.status,
            }
          : s
      )
    );
  };

  const selected = useMemo(() => seats.filter(s => s.status === "SELECTED"), [seats]);
  const total = selected.length * unitPrice;

  // ====== KHÁCH HÀNG ======
  const [info, setInfo] = useState({ fullName: "", phone: "", email: "" });
  const [agree, setAgree] = useState(false);
  const canPay = selected.length > 0 && info.fullName && agree;

  const handlePay = () => {
    if (!canPay) return;
    const bookingData = {
      customer: info,
      trip: { id: tripId, from, to, date, time, unitPrice },
      pickup: { type: pickupType, point: pickupPoint },
      drop: { type: dropType, point: dropPoint },
      seats: selected.map(s => s.id),
      total,
    };
    sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));
    router.push("/payment");
  };

  // ====== POPUP THÔNG TIN XE ======
  const [showInfo, setShowInfo] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("schedule");

  const timelineData: { time: string; place: string; address: string }[] = [
    { time, place: "BX Miền Tây", address: "VP BX Miền Tây: 395 Kinh Dương Vương , P.An Lạc , Q.Bình Tân , TP.HCM" },
    { time: "11:00", place: "Bệnh Viện Ung Bướu", address: "68 Nơ Trang Long, Phường 14, Quận Bình Thạnh, TP. Hồ Chí Minh" },
    { time: "11:30", place: "BACH KHOA", address: "6B Đường số 2, Cư Xá Lữ Gia, Phường 15, Quận 11" },
    { time: "11:30", place: "BV Y Dược", address: "03 Mạc Thiên Tích, P11, Q5, TP.HCM" },
    { time: "11:30", place: "BV Chợ Rẫy", address: "Số 20 Phạm Hữu Chí, phường 12, Quận 5, Tp HCM" },
    { time: "11:30", place: "Đồng Đen", address: "VP Đồng Đen: 288 Đồng Đen, P. 10, Q. Tân Bình, TP Hồ Chí Minh" },
    { time: "11:30", place: "BX An Sương", address: "Bến Xe An Sương, Quốc Lộ 22, Ấp Đông Lân, Bà Điểm, Hóc Môn, TP Hồ Chí Minh" },
    { time: "11:30", place: "Lũy Bán Bích", address: "973 Lũy Bán Bích" },
    { time: "12:15", place: "43 Nguyễn Cư Trinh", address: "43 Nguyen Cu Trinh, Phường Phạm Ngũ Lão, Quận 1, TP Hồ Chí Minh" },
    { time: "12:15", place: "205 Phạm Ngũ Lão", address: "VP Phạm Ngũ Lão: 205 Phạm Ngũ Lão, P.Phạm Ngũ Lão , Q.1 , TP.HCM" },
    { time: "12:15", place: "231-233 Lê Hồng Phong", address: "VP Lê Hồng Phong: 231 Lê Hồng Phong , P.4 , Q.5 , TP.HCM" },
    { time: "12:15", place: "BX Miền Đông", address: "VP BX Miền Đông: 292 Đinh Bộ Lĩnh, P.26, Q.Bình Thạnh, TP HCM" },
    { time: "12:15", place: "202 Lê Hồng Phong", address: "202 Lê Hồng Phong - P.4 - Q.5 - TP. Hồ Chí Minh" },
    { time: "12:15", place: "Hàng Xanh", address: "VP Hàng Xanh: 486H-486J Điện Biên Phủ, P.21, Q. Bình Thạnh" },
    { time: "13:00", place: "Mai Chí Thọ (đón/trả khách)", address: "0" },
    { time: "16:30", place: "Vũng Tàu", address: "VP Bến Xe Vũng Tàu 192 Nam Kỳ Khởi Nghĩa, P.Thắng Tam, TP.Vũng Tàu" },
  ];

  return (
    <div className={styles.hero}>
      <div className={styles.page}>
        {/* Header trên nền cam */}
        <header className={styles.header}>
          <h1>{from} – {to}</h1>
          <p className={styles.subInfo}>Thứ sáu, {date} • {time}</p>
        </header>

        {/* ===== Card 1: CHỌN GHẾ + THÔNG TIN BÊN PHẢI ===== */}
        <div className={styles.contentCard}>
          <div className={styles.grid}>
            {/* LEFT */}
            <section className={styles.leftCard}>
              <div className={styles.leftHeader}>
                <h3>Chọn ghế</h3>
                <button onClick={() => setShowInfo(!showInfo)} className={styles.vehicleLink}>
                  Thông tin xe
                </button>
              </div>

              {/* Legend */}
              <div className={styles.legend}>
                <span className={styles.legendItem}><i className={`${styles.dot} ${styles.sold}`} /> Đã bán</span>
                <span className={styles.legendItem}><i className={`${styles.dot} ${styles.free}`} /> Còn trống</span>
                <span className={styles.legendItem}><i className={`${styles.dot} ${styles.sel}`} /> Đang chọn</span>
              </div>

              <div className={styles.deckHeader}>Tầng dưới <small>(Chọn ghế)</small></div>
              <SeatLayout cells={seats} columns={4} onToggle={toggleSeat} />

              {/* POPUP Thông tin xe */}
              {showInfo && (
                <div className={styles.vehiclePopup}>
                  <div className={styles.tabHeader}>
                    {(["schedule","media","amenities","policy"] as TabKey[]).map(tab => (
                      <button
                        key={tab}
                        type="button"
                        className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab === "schedule" && "Lịch trình"}
                        {tab === "media" && "Hình ảnh/Video"}
                        {tab === "amenities" && "Tiện ích"}
                        {tab === "policy" && "Chính sách"}
                      </button>
                    ))}
                    <button type="button" className={styles.closeSmall} onClick={() => setShowInfo(false)}>✕</button>
                  </div>

                  <div className={styles.tabContent}>
                    {activeTab === "schedule" && (
                      <>
                        <ul className={styles.timeline}>
                          {timelineData.map((s, idx) => (
                            <li key={`${s.time}-${s.place}-${idx}`} className={`${styles.stop} ${idx === 0 ? "isStart" : ""}`}>
                              <div className={styles.time}>{s.time}</div>
                              <div className={styles.dotLine} />
                              <div className={styles.desc}>
                                <b>{s.place}</b>
                                <p>{s.address}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className={styles.note}>
                          <b>Lưu ý:</b> Thời gian các mốc lịch trình là dự kiến và có thể thay đổi theo tình hình thực tế.
                        </div>
                      </>
                    )}

                    {activeTab === "media" && <p>Hình ảnh và video xe đang được cập nhật...</p>}
                    {activeTab === "amenities" && (
                      <ul>
                        <li>Ghế ngả 120°</li><li>Wifi miễn phí</li><li>Ổ cắm sạc</li><li>Nước suối, khăn lạnh</li>
                      </ul>
                    )}
                    {activeTab === "policy" && (
                      <div className={styles.policyRich}>
                        <h4>Chính sách huỷ vé</h4>
                        <p>Chỉ được chuyển đổi vé 1 lần duy nhất.</p>
                        <p>Chi phí hủy vé từ <b>10% – 30%</b> tuỳ thời điểm so với giờ khởi hành & số lượng vé.</p>
                        <p>Liên hệ <b>1900 6067</b> hoặc quầy vé <b>trước 24h</b> so với giờ xe khởi hành để được hướng dẫn.</p>

                        <h4>Yêu cầu khi lên xe</h4>
                        <ul>
                          <li>Đến Văn phòng/Bến xe <b>trước 30 phút</b> (lễ tết: <b>60 phút</b>).</li>
                          <li>Xuất trình vé (SMS/Email/FUTA App) hoặc nhận vé tại quầy.</li>
                          <li>Không mang đồ có mùi, không hút thuốc/đồ uống có cồn/chất kích thích.</li>
                          <li>Không mang vật cháy nổ, không xả rác, không mang động vật.</li>
                        </ul>

                        <h4>Hành lý xách tay</h4>
                        <ul><li>Tối đa 20kg, không cồng kềnh.</li></ul>

                        <h4>Trẻ em & Phụ nữ có thai</h4>
                        <ul>
                          <li>Trẻ &le; 6 tuổi, cao &le; 1.3m, nặng &le; 30kg: <b>không phải mua vé</b> (mỗi người lớn kèm 1 trẻ).</li>
                          <li>Phụ nữ có thai cần đảm bảo sức khoẻ khi di chuyển.</li>
                        </ul>

                        <h4>Vé đón dọc đường</h4>
                        <p>Gọi <b>1900 6067</b> đăng ký trước <b>2 tiếng</b>; chỉ hỗ trợ một số điểm thuận tiện trên lộ trình.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* RIGHT */}
            <aside className={styles.rightCol}>
              <div className={styles.infoCard}>
                <div className={`${styles.cardTitle} ${styles.tripInfo}`}>Thông tin lượt đi</div>
                <ul className={styles.infoList}>
                  <li><span>Tuyến xe</span><b>{from} → {to}</b></li>
                  <li><span>Thời gian xuất bến</span><b>{time} {date}</b></li>
                  <li><span>Số lượng ghế</span><b>{selected.length}</b></li>
                  <li><span>Tổng tiền lượt đi</span><b>{total.toLocaleString("vi-VN")} đ</b></li>
                </ul>
              </div>

              <div className={styles.infoCard}>
                <div className={`${styles.cardTitle} ${styles.summaryInfo}`}>Chi tiết giá</div>
                <ul className={styles.infoList}>
                  <li><span>Giá vé / ghế</span><b>{unitPrice.toLocaleString("vi-VN")} đ</b></li>
                  <li><span>Phí thanh toán</span><b>0 đ</b></li>
                  <li className={styles.totalRow}><span>Tổng tiền</span><b>{total.toLocaleString("vi-VN")} đ</b></li>
                </ul>
              </div>
            </aside>
          </div>
        </div>

        {/* ===== Card 2: KHÁCH HÀNG + ĐÓN/TRẢ (GỘP CHUNG) ===== */}
        <div className={styles.contentCard}>
          {/* Thông tin khách hàng */}
          <div className={styles.sectionTitle}>Thông tin khách hàng</div>
          <div className={styles.customerGrid}>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Họ và tên *</label>
                <input value={info.fullName} onChange={e => setInfo({ ...info, fullName: e.target.value })} />
              </div>
              <div className={styles.inputGroup}>
                <label>Số điện thoại *</label>
                <input value={info.phone} onChange={e => setInfo({ ...info, phone: e.target.value })} />
              </div>
              <div className={styles.inputGroup}>
                <label>Email *</label>
                <input value={info.email} onChange={e => setInfo({ ...info, email: e.target.value })} />
              </div>
            </div>

            <div className={styles.policyBox}>
              <h4 className={styles.policyTitle}>ĐIỀU KHOẢN & LƯU Ý</h4>
              <p className={styles.redText}>Vui lòng <b>Đăng ký/Đăng nhập</b> để nhận khuyến mãi.</p>
              <p>(*) Có mặt trước 30 phút; mang mã vé từ FUTA. Hỗ trợ: <b className={styles.orange}>1900 6067</b>.</p>
              <p>(*) Trung chuyển: gọi <b className={styles.orange}>1900 6918</b> trước khi đặt vé.</p>
              <p>(*) Nếu đi chặng ngắn hơn, gọi <b className={styles.orange}>1900 6067</b> để có giá tốt.</p>
            </div>
          </div>

          <div className={styles.terms}>
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
            />
            <label htmlFor="agreeTerms">
              Chấp nhận <a href="#">điều khoản</a> & chính sách bảo mật của FUTA Bus Lines
            </label>
          </div>

          {/* Ngăn nhẹ giữa 2 phần trong cùng card (không cần nếu bạn không thích) */}
          <div style={{ height: 14 }} />

          {/* Thông tin đón trả */}
          <div className={styles.sectionTitle}>Thông tin đón trả</div>
          <div className={styles.pdGrid}>
            {/* Điểm đón */}
            <div className={styles.pdCol}>
              <div className={styles.pdTitle}>Điểm đón</div>
              <div className={styles.radioRow}>
                <label><input type="radio" checked={pickupType === "station"} onChange={() => setPickupType("station")} /> Bến xe/VP</label>
                <label><input type="radio" checked={pickupType === "transfer"} onChange={() => setPickupType("transfer")} /> Trung chuyển</label>
              </div>
              <select className={styles.select} value={pickupPoint} onChange={e => setPickupPoint(e.target.value)}>
                <option>BX Miền Tây</option>
              </select>
              {pickupType === "station" && (
                <p className={styles.helper}>Vui lòng có mặt tại <b>{pickupPoint}</b> trước 05:15 31/10/2025.</p>
              )}
            </div>

            {/* Điểm trả */}
            <div className={styles.pdCol}>
              <div className={styles.pdTitle}>Điểm trả</div>
              <div className={styles.radioRow}>
                <label><input type="radio" checked={dropType === "station"} onChange={() => setDropType("station")} /> Bến xe/VP</label>
                <label><input type="radio" checked={dropType === "transfer"} onChange={() => setDropType("transfer")} /> Trung chuyển</label>
              </div>
              <select className={styles.select} value={dropPoint} onChange={e => setDropPoint(e.target.value)}>
                <option>Vũng Tàu</option>
              </select>
            </div>
          </div>

          {/* Hành động ở cuối card */}
          <div className={styles.actions}>
            <div className={styles.amount}><span>FUTAPAY</span><b>{total.toLocaleString("vi-VN")} đ</b></div>
            <div className={styles.btnRow}>
              <button className={styles.btnGhost} onClick={() => router.back()}>Hủy</button>
              <button className={styles.btnPrimary} disabled={!canPay} onClick={handlePay}>Thanh toán</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
