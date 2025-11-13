"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Schedule.module.css";

interface Route {
  id: number;
  from: string;
  to: string;
  type: string;
  distance: string;
  duration: string;
  price: string; // giữ field nhưng sẽ hiển thị '---'
}

/** Chuẩn hoá tên điểm đi để nhóm (bỏ phần trong ngoặc) */
function normalizeFromLabel(from: string) {
  const idx = from.indexOf("(");
  return (idx > -1 ? from.slice(0, idx) : from).trim();
}

export default function SchedulePage() {
  const router = useRouter();

  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");

  // ===== Danh sách tuyến mở rộng =====
  const routes: Route[] = [
    // ... (toàn bộ danh sách routes của bạn giữ nguyên, mình rút gọn ở đây cho dễ đọc) ...
    { id: 1, from: "An Hữu (Tiền Giang)", to: "TP.Hồ Chí Minh", type: "Limousine", distance: "127km", duration: "2 giờ", price: "230000" },
    { id: 2, from: "An Khê (Gia Lai)", to: "TP.Hồ Chí Minh", type: "Limousine", distance: "640km", duration: "13 giờ", price: "550000" },
    { id: 3, from: "An Khê (Gia Lai)", to: "TP.Hồ Chí Minh", type: "Limousine", distance: "670km", duration: "13 giờ", price: "560000" },
    { id: 4, from: "An Minh (Kiên Giang)", to: "TP.Hồ Chí Minh", type: "Limousine", distance: "295km", duration: "7 giờ", price: "320000" },
    { id: 5, from: "An Nhơn", to: "TP.Hồ Chí Minh", type: "Giường", distance: "720km", duration: "13 giờ", price: "450000" },
    { id: 6, from: "An Nhơn", to: "TP.Hồ Chí Minh", type: "Giường", distance: "710km", duration: "12 giờ", price: "440000" },
    { id: 7, from: "An Nhơn", to: "TP.Hồ Chí Minh", type: "—", distance: "688km", duration: "11 giờ", price: "430000" },
    { id: 8,  from: "Ba Tri (Bến Tre)",     to: "TP.Hồ Chí Minh", type: "Limousine", distance: "126km", duration: "4 giờ",  price: "210000" },

    { id: 9, from: "Bạc Liêu", to: "TP.Hồ Chí Minh", type: "Giường", distance: "280km", duration: "7 giờ", price: "300000" },
    { id: 10, from: "Bạc Liêu", to: "TP.Hồ Chí Minh", type: "Limousine", distance: "243km", duration: "5 giờ", price: "320000" },

    { id: 11, from: "Bảo Lộc", to: "Bình Sơn", type: "Limousine", distance: "670km", duration: "15 giờ", price: "520000" },
    { id: 12, from: "Bảo Lộc", to: "Đà Nẵng", type: "Giường", distance: "850km", duration: "16 giờ", price: "560000" },
    { id: 13, from: "Bảo Lộc", to: "Huế", type: "Giường", distance: "900km", duration: "18 giờ", price: "580000" },
    { id: 14, from: "Bảo Lộc", to: "Quảng Ngãi", type: "Limousine", distance: "740km", duration: "14 giờ", price: "540000" },
    { id: 15, from: "Bảo Lộc", to: "Quảng Nam", type: "Limousine", distance: "780km", duration: "15 giờ", price: "540000" },
    { id: 16, from: "Bảo Lộc", to: "Quy Nhơn", type: "Giường", distance: "540km", duration: "11 giờ", price: "500000" },
    { id: 17, from: "Bảo Lộc", to: "Nha Trang", type: "Giường", distance: "220km", duration: "5 giờ", price: "300000" },
    { id: 18, from: "Bến Tre", to: "TP.Hồ Chí Minh", type: "Limousine", distance: "75km", duration: "3 giờ", price: "160000" },
    { id: 19, from: "Bến Tre", to: "Đà Lạt", type: "Giường", distance: "350km", duration: "9 giờ", price: "380000" },
    { id: 20, from: "Bến Tre", to: "Cà Mau", type: "Giường", distance: "220km", duration: "6 giờ", price: "260000" },

    { id: 21, from: "Bình Thuận", to: "TP.Hồ Chí Minh", type: "Limousine", distance: "200km", duration: "5 giờ", price: "240000" },
    { id: 22, from: "Bình Dương", to: "Nha Trang", type: "Giường", distance: "430km", duration: "10 giờ", price: "400000" },

    { id: 23, from: "Cần Thơ", to: "Đà Lạt", type: "Giường", distance: "420km", duration: "11 giờ", price: "420000" },
    { id: 24, from: "Cần Thơ", to: "TP.Hồ Chí Minh", type: "Limousine", distance: "170km", duration: "4 giờ", price: "200000" },

    { id: 25, from: "Châu Đốc", to: "TP.Hồ Chí Minh", type: "Giường", distance: "245km", duration: "6 giờ", price: "260000" },
    { id: 26, from: "Gia Nghĩa", to: "TP.Hồ Chí Minh", type: "Giường", distance: "230km", duration: "6 giờ", price: "260000" },
    { id: 27, from: "Long Xuyên", to: "TP.Hồ Chí Minh", type: "Limousine", distance: "190km", duration: "5 giờ", price: "230000" },
    { id: 28, from: "Rạch Giá", to: "TP.Hồ Chí Minh", type: "Giường", distance: "250km", duration: "6 giờ", price: "270000" },
    { id: 29, from: "Sóc Trăng", to: "TP.Hồ Chí Minh", type: "Limousine", distance: "230km", duration: "6 giờ", price: "250000" },
    { id: 30, from: "Trà Vinh", to: "TP.Hồ Chí Minh", type: "Limousine", distance: "140km", duration: "4 giờ", price: "190000" },
  ];

  // Lọc theo từ khoá (tính toán bằng useMemo, không cần state phụ)
  const filtered = useMemo(() => {
    if (!fromSearch && !toSearch) return routes;
    return routes.filter(
      (r) =>
        (!fromSearch || r.from.toLowerCase().includes(fromSearch.toLowerCase())) &&
        (!toSearch || r.to.toLowerCase().includes(toSearch.toLowerCase()))
    );
  }, [fromSearch, toSearch, routes]);



  // Điều hướng khi bấm "Tìm tuyến xe"
  const goSearch = (route: Route) => {
    const params = new URLSearchParams({
      from: route.from,
      to: route.to,
      date: new Date().toISOString().slice(0, 10),
      tickets: "1",
      type: route.type,
      price: route.price,
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>LỊCH TRÌNH</h1>

      {/* Thanh nhập (không có nút Tìm) */}
      <div className={styles.searchBox}>
        <input
          className={styles.input}
          placeholder="Nhập điểm đi"
          value={fromSearch}
          onChange={(e) => setFromSearch(e.target.value)}
        />
        <span className={styles.swapIcon} aria-hidden>⇄</span>
        <input
          className={styles.input}
          placeholder="Nhập điểm đến"
          value={toSearch}
          onChange={(e) => setToSearch(e.target.value)}
        />
      </div>

      {/* === PHẦN SỬA LẠI ĐỂ DÙNG TABLE === */}
     <div className={styles.tableContainer}>
  <table className={styles.table}>
    <thead>
      <tr>
        <th>Tuyến xe</th>
        <th>Loại xe</th>
        <th>Quãng đường</th>
        <th>Thời gian hành trình</th>
        <th>Giá vé</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {filtered.map((r) => (
        <tr key={r.id}>
          <td>
            <div>
              <span className={styles.routeFrom}>{r.from}</span>
            </div>
            <div>
              <span>⇄ </span>
              <span className={styles.routeTo}>{r.to}</span>
            </div>
          </td>
          <td>{r.type}</td>
          <td>{r.distance}</td>
          <td>{r.duration}</td>
          <td>---</td>
          <td>
            <button className={styles.button} onClick={() => goSearch(r)}>
              Tìm tuyến xe
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {filtered.length === 0 && (
    <div className={styles.noResult}>Không có kết quả phù hợp</div>
  )}
</div>


    </div>
  );
}