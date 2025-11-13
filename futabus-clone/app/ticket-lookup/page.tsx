"use client";
import { useState } from "react";
import styles from "./TicketLookup.module.css";

export default function TicketLookupPage() {
  const [phone, setPhone] = useState("");
  const [ticketCode, setTicketCode] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !ticketCode) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    alert(`SĐT: ${phone}\nMã vé: ${ticketCode}`);
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>TRA CỨU THÔNG TIN ĐẶT VÉ</h1>

      <form onSubmit={handleSearch} className={styles.form}>
        <input
          type="text"
          className={styles.input}
          placeholder="Vui lòng nhập số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          className={styles.input}
          placeholder="Vui lòng nhập mã vé"
          value={ticketCode}
          onChange={(e) => setTicketCode(e.target.value)}
        />
        <button type="submit" className={styles.button}>
          Tra cứu
        </button>
      </form>
    </div>
  );
}
