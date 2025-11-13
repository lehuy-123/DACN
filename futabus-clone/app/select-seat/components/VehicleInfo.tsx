"use client";
import { useState } from "react";
import styles from "../SelectSeat.module.css";

export default function VehicleInfo({ vehicleId }: { vehicleId: string }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"LỊCH TRÌNH" | "HÌNH ẢNH" | "TIỆN ÍCH" | "CHÍNH SÁCH">("LỊCH TRÌNH");

  return (
    <div className={styles.vehicleInfo}>
      <div className={styles.vehicleToggle} onClick={() => setOpen(!open)}>
        Thông tin xe{" "}
        <span className={styles.arrow}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div className={styles.vehicleBox}>
          <div className={styles.tabRow}>
            {["LỊCH TRÌNH", "HÌNH ẢNH", "TIỆN ÍCH", "CHÍNH SÁCH"].map((label) => (
              <button
                key={label}
                className={`${styles.tab} ${tab === label ? styles.activeTab : ""}`}
                onClick={() => setTab(label as any)}
              >
                {label === "HÌNH ẢNH" ? "Hình ảnh/Video" : label}
              </button>
            ))}
          </div>

          <div className={styles.tabPanel}>
            {tab === "LỊCH TRÌNH" && (
              <ul>
                <li><b>05:30</b> – BX An Sương, Q12</li>
                <li><b>06:15</b> – 43 Nguyễn Cư Trinh, Q1</li>
                <li><b>06:30</b> – BX Miền Tây, Bình Tân</li>
                <li><b>09:30</b> – BX Vũng Tàu</li>
              </ul>
            )}

            {tab === "HÌNH ẢNH" && (
              <div>
                <img src="/bus-sample.jpg" alt="Bus" />
                <p>Hình ảnh minh họa xe giường nằm 40 chỗ của FUTA Bus Lines.</p>
              </div>
            )}

            {tab === "TIỆN ÍCH" && (
              <ul>
                <li>Wifi miễn phí</li>
                <li>Ổ cắm sạc điện thoại</li>
                <li>Mền, nước suối, khăn lạnh</li>
              </ul>
            )}

            {tab === "CHÍNH SÁCH" && (
              <ul>
                <li>Quý khách vui lòng có mặt trước giờ khởi hành ít nhất 30 phút.</li>
                <li>Không hoàn/đổi vé sau khi xe xuất bến.</li>
                <li>Trẻ em dưới 6 tuổi miễn vé nếu ngồi cùng người lớn.</li>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
