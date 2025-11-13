// Đánh dấu đây là Client Component vì sử dụng hooks (useState, useRouter)
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/styles/SearchForm.module.css";

// BƯỚC 1: IMPORT THƯ VIỆN DATEPICKER VÀ CSS CỦA NÓ
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// (Tùy chọn) Import tiếng Việt cho lịch
// import { registerLocale, setDefaultLocale } from "react-datepicker";
// import { vi } from 'date-fns/locale/vi';
// registerLocale('vi', vi);
// setDefaultLocale('vi');

export default function SearchForm() {
  const router = useRouter();

  // BƯỚC 2: QUẢN LÝ STATE
  const [tripType, setTripType] = useState("oneWay"); // 'oneWay' hoặc 'roundTrip'
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [tickets, setTickets] = useState(1);

  /**
   * Định dạng đối tượng Date thành chuỗi YYYY-MM-DD
   * (an toàn hơn toISOString() vì nó không bị ảnh hưởng bởi múi giờ)
   */
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // BƯỚC 3: VALIDATE DỮ LIỆU
    if (!origin || !destination || !departureDate) {
      alert("Vui lòng nhập điểm đi, điểm đến và ngày đi!");
      return;
    }

    // Kiểm tra ngày về nếu là khứ hồi
    if (tripType === 'roundTrip' && !returnDate) {
      alert("Vui lòng chọn ngày về cho chuyến khứ hồi!");
      return;
    }

    // BƯỚC 4: TẠO CÁC THAM SỐ TRUY VẤN (QUERY PARAMS)
    const params = new URLSearchParams({
      from: origin,
      to: destination,
      date: formatDate(departureDate), // Định dạng ngày đi
      tickets: tickets.toString(),
      tripType: tripType,
    });

    // Thêm ngày về vào params nếu có
    if (tripType === 'roundTrip' && returnDate) {
      const formattedReturnDate = formatDate(returnDate);
      params.set('returnDate', formattedReturnDate);
    }

    // BƯỚC 5: CHUYỂN HƯỚNG
    router.push(`/search?${params.toString()}`);
  };

  // BƯỚC 6: RENDER GIAO DIỆN
  return (
    <div className={styles.box}>
      <form onSubmit={handleSubmit}>
        <div className={styles.header}>
          <div className={styles.radioGroup}>
            {/* Radio button cho Một chiều */}
            <label>
              <input
                type="radio"
                name="tripType"
                value="oneWay"
                checked={tripType === "oneWay"}
                onChange={() => {
                  setTripType("oneWay");
                  setReturnDate(null); // Xóa ngày về khi chọn 1 chiều
                }}
              /> Một chiều
            </label>
            {/* Radio button cho Khứ hồi */}
            <label>
              <input
                type="radio"
                name="tripType"
                value="roundTrip"
                checked={tripType === "roundTrip"}
                onChange={() => setTripType("roundTrip")}
              /> Khứ hồi
            </label>
          </div>
          <span className={styles.guide}>Hướng dẫn mua vé</span>
        </div>

        {/* Hàng chứa các ô input */}
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Điểm đi</label>
            <input 
              placeholder="Chọn điểm đi" 
              value={origin}
              onChange={(e) => setOrigin(e.target.value)} 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Điểm đến</label>
            <input 
              placeholder="Chọn điểm đến" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)} 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Ngày đi</label>
            <DatePicker
              selected={departureDate}
              onChange={(date) => setDepartureDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày đi"
              className={styles.dateInput} // Dùng class để style
              minDate={new Date()} // Không cho chọn ngày quá khứ
            />
          </div>

          {/* === PHẦN HIỂN THỊ CÓ ĐIỀU KIỆN === */}
          {/* Chỉ hiển thị ô "Ngày về" khi tripType là 'roundTrip' */}
          {tripType === 'roundTrip' && (
            <div className={styles.inputGroup}>
              <label>Ngày về</label>
              <DatePicker
                selected={returnDate}
                onChange={(date) => setReturnDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày về"
                className={styles.dateInput}
                // Đảm bảo ngày về không thể trước ngày đi
                minDate={departureDate || new Date()}
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Số vé</label>
            <select 
              value={tickets}
              onChange={(e) => setTickets(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className={styles.btn}>Tìm chuyến xe</button>
      </form>
    </div>
  );
}