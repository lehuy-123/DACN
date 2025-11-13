'use client';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../reports/report.module.css';

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

export default function ReportDatePicker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const defaultEnd = new Date();
  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() - 30);

  const [startDate, setStartDate] = useState<Date>(
    searchParams.get('from') ? new Date(searchParams.get('from')!) : defaultStart
  );
  const [endDate, setEndDate] = useState<Date>(
    searchParams.get('to') ? new Date(searchParams.get('to')!) : defaultEnd
  );

  const handleDateChange = () => {
    const params = new URLSearchParams(searchParams);
    params.set('from', formatDate(startDate));
    params.set('to', formatDate(endDate));
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.datePicker}>
      <DatePicker
        selected={startDate}
        onChange={(date) => date && setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        className={styles.dateInput}
        dateFormat="yyyy-MM-dd"
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => date && setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        className={styles.dateInput}
        dateFormat="yyyy-MM-dd"
      />
      <button
        onClick={handleDateChange}
        style={{
          padding: '10px 16px',
          border: 'none',
          borderRadius: '6px',
          backgroundColor: '#F26522',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        Lọc
      </button>
    </div>
  );
}
