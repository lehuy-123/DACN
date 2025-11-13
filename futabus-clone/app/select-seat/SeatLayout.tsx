"use client";

import React from "react";
import styles from "./SelectSeat.module.css";

export type SeatStatus = "AVAILABLE" | "SOLD" | "SELECTED";
export type SeatCell = {
  id: string;
  status: SeatStatus;
  floor: "BOTTOM" | "TOP";
};

type Props = {
  cells: SeatCell[];
  /** Không còn cần dùng, giữ lại cho tương thích */
  columns?: number;
  onToggle: (id: string) => void;
};

/**
 * Bố cục 2–aisle–2 theo từng hàng:
 * mỗi hàng 4 ghế: [L1][L2]  |  [R1][R2]
 */
export default function SeatLayout({ cells, onToggle }: Props) {
  const totalRows = Math.ceil(cells.length / 4);

  const SeatButton = ({ cell }: { cell: SeatCell }) => {
    const stateClass =
      cell.status === "SOLD"
        ? styles.soldSeat
        : cell.status === "SELECTED"
        ? styles.selectedSeat
        : styles.availableSeat;

    return (
      <button
        type="button"
        key={`${cell.floor}-${cell.id}`}
        className={`${styles.seatCell} ${stateClass}`}
        disabled={cell.status === "SOLD"}
        onClick={() => cell.status !== "SOLD" && onToggle(cell.id)}
        aria-label={`Ghế ${cell.id}`}
      >
        {/* Icon ghế để CSS kiểm soát màu (fill/stroke) */}
        <svg
          viewBox="0 0 36 44"
          width="36"
          height="44"
          aria-hidden="true"
          className={styles.seatIcon}
        >
          {/* tựa lưng */}
          <rect x="8" y="4" width="20" height="22" rx="6" />
          {/* nệm ngồi */}
          <rect x="6" y="24" width="24" height="10" rx="6" />
          {/* tay vịn */}
          <rect x="2" y="17" width="6" height="12" rx="3" />
          <rect x="28" y="17" width="6" height="12" rx="3" />
          {/* chân ghế */}
          <rect x="8" y="36" width="6" height="6" rx="2" />
          <rect x="22" y="36" width="6" height="6" rx="2" />
        </svg>

        <span className={styles.seatLabel}>{cell.id}</span>
      </button>
    );
  };

  const getCell = (row: number, col: 0 | 1 | 2 | 3) => {
    const idx = row * 4 + col;
    return cells[idx];
  };

  return (
    <div className={styles.seatMatrix}>
      {Array.from({ length: totalRows }).map((_, r) => {
        const l1 = getCell(r, 0);
        const l2 = getCell(r, 1);
        const r1 = getCell(r, 2);
        const r2 = getCell(r, 3);

        return (
          <div className={styles.seatRow} key={r}>
            <div className={styles.block}>
              {l1 && <SeatButton cell={l1} />}
              {l2 && <SeatButton cell={l2} />}
            </div>

            <div className={styles.aisle} /> {/* lối đi */}

            <div className={styles.block}>
              {r1 && <SeatButton cell={r1} />}
              {r2 && <SeatButton cell={r2} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
